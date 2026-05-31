package de.botpilot.faqs.infrastructure.nlp;

import ai.djl.MalformedModelException;
import ai.djl.huggingface.tokenizers.Encoding;
import ai.djl.huggingface.tokenizers.HuggingFaceTokenizer;
import ai.djl.inference.Predictor;
import ai.djl.ndarray.NDArray;
import ai.djl.ndarray.NDList;
import ai.djl.ndarray.NDManager;
import ai.djl.repository.zoo.Criteria;
import ai.djl.repository.zoo.ModelNotFoundException;
import ai.djl.repository.zoo.ModelZoo;
import ai.djl.repository.zoo.ZooModel;
import ai.djl.translate.TranslateException;
import ai.djl.translate.Translator;
import ai.djl.translate.TranslatorContext;
import de.botpilot.faqs.domain.model.Faq;
import de.botpilot.faqs.domain.port.EmbeddingPort;
import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;

import java.io.IOException;
import java.util.List;
import java.util.concurrent.atomic.AtomicReference;
import java.util.logging.Logger;

/**
 * {@link EmbeddingPort} adapter backed by DJL and the {@code all-MiniLM-L6-v2}
 * sentence-transformer model, loaded via the ONNX Runtime engine.
 *
 * <h2>Why ONNX Runtime instead of PyTorch</h2>
 * The DJL PyTorch model zoo ships TorchScript models that are JIT-traced with a fixed
 * sequence length.  Inputs longer than that traced length cause a shape mismatch at
 * runtime.  The ONNX Runtime engine uses the original ONNX graph which declares dynamic
 * axes, so any sequence length is accepted.
 *
 * <h2>Named inputs</h2>
 * Unlike the PyTorch engine (positional NDList), ONNX Runtime resolves model inputs by
 * name.  Each NDArray must have its name set before being added to the NDList.
 */
public class DjlEmbeddingAdapter implements EmbeddingPort {

    private static final Logger log = Logger.getLogger(DjlEmbeddingAdapter.class.getName());

    private static final String BI_ENCODER_MODEL_URL =
            "djl://ai.djl.huggingface.onnxruntime/sentence-transformers/all-MiniLM-L6-v2";

    private ZooModel<String, float[]> model;
    private Predictor<String, float[]> predictor;

    /** Cached FAQ embeddings — written once in warmUp(), read-only thereafter. */
    private final AtomicReference<float[][]> cachedFaqEmbeddings = new AtomicReference<>();

    private final List<Faq> faqsToWarmUp;

    public DjlEmbeddingAdapter(List<Faq> faqsToWarmUp) {
        this.faqsToWarmUp = List.copyOf(faqsToWarmUp);
    }

    @PostConstruct
    public void warmUp() throws ModelNotFoundException, MalformedModelException, IOException {
        log.info("Loading bi-encoder via ONNX Runtime: " + BI_ENCODER_MODEL_URL);

        Criteria<String, float[]> criteria = Criteria.builder()
                .setTypes(String.class, float[].class)
                .optModelUrls(BI_ENCODER_MODEL_URL)
                .optEngine("OnnxRuntime")
                .optTranslator(new SentenceEmbeddingTranslator())
                .build();

        model = ModelZoo.loadModel(criteria);
        predictor = model.newPredictor();

        log.info("Bi-encoder loaded. Pre-computing embeddings for " + faqsToWarmUp.size() + " FAQs...");
        cachedFaqEmbeddings.set(batchEncode(faqsToWarmUp.stream().map(Faq::question).toList()));
        log.info("FAQ embeddings cached.");
    }

    @PreDestroy
    public void shutdown() {
        if (predictor != null) predictor.close();
        if (model != null) model.close();
    }

    @Override
    public float[] encode(String text) {
        try {
            return predictor.predict(text);
        } catch (TranslateException e) {
            throw new NlpInferenceException("Failed to encode text: " + text, e);
        }
    }

    @Override
    public float[][] encodeAll(List<Faq> faqs) {
        float[][] cached = cachedFaqEmbeddings.get();
        if (cached != null) {
            return cached;
        }
        float[][] computed = batchEncode(faqs.stream().map(Faq::question).toList());
        cachedFaqEmbeddings.compareAndSet(null, computed);
        return cachedFaqEmbeddings.get();
    }

    private float[][] batchEncode(List<String> texts) {
        float[][] result = new float[texts.size()][];
        for (int i = 0; i < texts.size(); i++) {
            result[i] = encode(texts.get(i));
        }
        return result;
    }

    // ---- Translator: String → float[384] ----

    /**
     * Tokenizes the input, runs the ONNX model, mean-pools the token embeddings over
     * the sequence dimension, and L2-normalises — matching SentenceTransformers defaults.
     *
     * <p>NDArray names are mandatory for the ONNX Runtime engine: it resolves inputs by
     * name, not position.
     */
    private static class SentenceEmbeddingTranslator implements Translator<String, float[]> {

        private HuggingFaceTokenizer tokenizer;

        @Override
        public void prepare(TranslatorContext ctx) throws IOException {
            tokenizer = HuggingFaceTokenizer.builder()
                    .optTokenizerName("sentence-transformers/all-MiniLM-L6-v2")
                    .build();
        }

        @Override
        public NDList processInput(TranslatorContext ctx, String input) {
            Encoding encoding = tokenizer.encode(input);
            NDManager manager = ctx.getNDManager();

            // Return 1D tensors — DJL's StackBatchifier adds the batch dimension,
            // producing [1, seqLen] as the model expects. Reshaping to [1, seqLen]
            // here would result in rank 3 after batching.
            NDArray inputIds = manager.create(encoding.getIds());
            inputIds.setName("input_ids");

            NDArray attentionMask = manager.create(encoding.getAttentionMask());
            attentionMask.setName("attention_mask");

            return new NDList(inputIds, attentionMask);
        }

        @Override
        public float[] processOutput(TranslatorContext ctx, NDList output) {
            // DJL's StackBatchifier strips the batch dimension before calling processOutput,
            // so the tensor here is [seqLen, hiddenDim], not [1, seqLen, hiddenDim].
            // Mean-pool over dim 0 (sequence) → [hiddenDim].
            NDArray tokenEmbeddings = output.getFirst();
            NDArray meanPooled = tokenEmbeddings.mean(new int[]{0});
            // L2-normalise: norm() is not implemented in the Rust-backed NDArray,
            // so we use equivalent element-wise ops.
            NDArray l2Norm = meanPooled.mul(meanPooled).sum().sqrt().maximum(1e-9f);
            return meanPooled.div(l2Norm).toFloatArray();
        }
    }
}
