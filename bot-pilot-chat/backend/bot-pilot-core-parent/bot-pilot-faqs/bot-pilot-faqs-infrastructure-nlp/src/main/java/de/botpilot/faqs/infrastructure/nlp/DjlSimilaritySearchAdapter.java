package de.botpilot.faqs.infrastructure.nlp;

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
import de.botpilot.faqs.domain.port.SimilaritySearchPort;
import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.logging.Logger;

/**
 * {@link SimilaritySearchPort} adapter implementing the two retrieval phases.
 *
 * <h2>Stage 1 — Cosine similarity recall (bi-encoder)</h2>
 * Because embeddings from {@link DjlEmbeddingAdapter} are L2-normalised, cosine
 * similarity reduces to a dot product — computed in pure Java, no model call needed.
 *
 * <h2>Stage 2 — Cross-encoder re-ranking</h2>
 * Loads {@code cross-encoder/stsb-roberta-base} via the DJL ONNX Runtime engine.
 * If that model is not available in the DJL ONNX model zoo, the adapter falls back
 * to cosine re-ranking using the {@link EmbeddingPort} — identical semantics, slightly
 * less precise, but correct.  A WARNING log indicates which path is active at startup.
 *
 * <h2>Why ONNX Runtime</h2>
 * The DJL PyTorch engine uses JIT-traced TorchScript models with a fixed sequence
 * length.  ONNX models declare dynamic axes, so any sequence length is accepted.
 */
public class DjlSimilaritySearchAdapter implements SimilaritySearchPort {

    private static final Logger log = Logger.getLogger(DjlSimilaritySearchAdapter.class.getName());

    private static final String CROSS_ENCODER_MODEL_URL =
            "djl://ai.djl.huggingface.onnxruntime/cross-encoder/stsb-roberta-base";

    private final EmbeddingPort embeddingPort;

    private ZooModel<String[], Float> crossEncoderModel;
    private Predictor<String[], Float> crossEncoderPredictor;
    private boolean crossEncoderAvailable = false;

    /**
     * @param embeddingPort used for cosine-similarity fallback when the cross-encoder
     *                      ONNX model is not available in the DJL model zoo.
     */
    public DjlSimilaritySearchAdapter(EmbeddingPort embeddingPort) {
        this.embeddingPort = embeddingPort;
    }

    @PostConstruct
    public void warmUp() {
        log.info("Loading cross-encoder model via ONNX Runtime: " + CROSS_ENCODER_MODEL_URL);
        try {
            Criteria<String[], Float> criteria = Criteria.builder()
                    .setTypes(String[].class, Float.class)
                    .optModelUrls(CROSS_ENCODER_MODEL_URL)
                    .optEngine("OnnxRuntime")
                    .optTranslator(new CrossEncoderTranslator())
                    .build();
            crossEncoderModel = ModelZoo.loadModel(criteria);
            crossEncoderPredictor = crossEncoderModel.newPredictor();
            crossEncoderAvailable = true;
            log.info("Cross-encoder loaded successfully.");
        } catch (Exception e) {
            log.warning("Cross-encoder model not available in the DJL ONNX zoo ("
                    + e.getMessage() + "). Falling back to cosine similarity re-ranking.");
        }
    }

    @PreDestroy
    public void shutdown() {
        if (crossEncoderPredictor != null) crossEncoderPredictor.close();
        if (crossEncoderModel != null) crossEncoderModel.close();
    }

    @Override
    public List<Faq> retrieveCandidates(
            float[] userEmbedding,
            float[][] faqEmbeddings,
            List<Faq> faqs,
            int numCandidates
    ) {
        record Scored(int index, float score) {}

        List<Scored> scored = new ArrayList<>(faqs.size());
        for (int i = 0; i < faqs.size(); i++) {
            scored.add(new Scored(i, dotProduct(userEmbedding, faqEmbeddings[i])));
        }
        return scored.stream()
                .sorted(Comparator.comparingDouble(Scored::score).reversed())
                .limit(numCandidates)
                .map(s -> faqs.get(s.index()))
                .toList();
    }

    @Override
    public float[] rerank(String userQuestion, List<Faq> candidates) {
        if (crossEncoderAvailable) {
            return rerankWithCrossEncoder(userQuestion, candidates);
        }
        return rerankWithCosine(userQuestion, candidates);
    }

    // ---- Private helpers ----

    private float[] rerankWithCrossEncoder(String userQuestion, List<Faq> candidates) {
        float[] scores = new float[candidates.size()];
        for (int i = 0; i < candidates.size(); i++) {
            try {
                scores[i] = crossEncoderPredictor.predict(
                        new String[]{userQuestion, candidates.get(i).question()});
            } catch (TranslateException e) {
                throw new NlpInferenceException(
                        "Cross-encoder inference failed for: " + candidates.get(i).question(), e);
            }
        }
        return scores;
    }

    /**
     * Fallback: re-encode the user question and each candidate with the bi-encoder and
     * return cosine similarity scores.  The threshold in the use case was calibrated for
     * the cross-encoder, but MiniLM-L6-v2 cosine scores are on the same 0–1 scale so
     * the threshold of 0.7 remains a reasonable guard.
     */
    private float[] rerankWithCosine(String userQuestion, List<Faq> candidates) {
        float[] userEmb = embeddingPort.encode(userQuestion);
        float[] scores = new float[candidates.size()];
        for (int i = 0; i < candidates.size(); i++) {
            float[] candidateEmb = embeddingPort.encode(candidates.get(i).question());
            scores[i] = dotProduct(userEmb, candidateEmb);
        }
        return scores;
    }

    private static float dotProduct(float[] a, float[] b) {
        float sum = 0f;
        for (int i = 0; i < a.length; i++) {
            sum += a[i] * b[i];
        }
        return sum;
    }

    // ---- Cross-encoder translator ----

    /**
     * ONNX-aware translator for cross-encoder pair scoring.
     *
     * Named inputs ({@code input_ids}, {@code attention_mask}) are required by the
     * ONNX Runtime engine — unlike the PyTorch engine which accepted positional NDList
     * entries.
     */
    private static class CrossEncoderTranslator implements Translator<String[], Float> {

        private HuggingFaceTokenizer tokenizer;

        @Override
        public void prepare(TranslatorContext ctx) throws IOException {
            tokenizer = HuggingFaceTokenizer.builder()
                    .optTokenizerName("cross-encoder/stsb-roberta-base")
                    .build();
        }

        @Override
        public NDList processInput(TranslatorContext ctx, String[] pair) {
            Encoding encoding = tokenizer.encode(pair[0], pair[1]);
            NDManager manager = ctx.getNDManager();

            NDArray inputIds = manager.create(encoding.getIds());
            inputIds.setName("input_ids");

            NDArray attentionMask = manager.create(encoding.getAttentionMask());
            attentionMask.setName("attention_mask");

            return new NDList(inputIds, attentionMask);
        }

        @Override
        public Float processOutput(TranslatorContext ctx, NDList output) {
            return output.get(0).squeeze().getFloat();
        }
    }
}
