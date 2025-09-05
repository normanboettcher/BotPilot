from sentence_transformers import SentenceTransformer, util, CrossEncoder
import json

from bot_pilot.config.config import app_config
from bot_pilot.domain.response import BotResponse

model = SentenceTransformer("all-MiniLM-L6-v2")
cross_encoder = CrossEncoder("cross-encoder/stsb-roberta-base")

# Top Level for caching
_faqs = None
_faq_embeddings = None


def load_faq_embeddings():
    global _faqs, _faq_embeddings
    config = app_config()
    data_path = config["FAQ_DATA_PATH"]
    print(f"loaded data path: {data_path}")
    if _faqs is None or _faq_embeddings is None:
        with open(data_path, encoding="utf-8") as f:
            _faqs = json.load(f)
        faq_questions = [faq["question"] for faq in _faqs]
        _faq_embeddings = model.encode(faq_questions, convert_to_tensor=True)
    return _faqs, _faq_embeddings


def find_most_similar_faq(user_question, top_k=1, threshold=0.7):
    # step 1 embed user input
    user_embedding = model.encode(user_question, convert_to_tensor=True)
    # step 2 load FAQs and their embeddings
    faqs, faq_embeddings = load_faq_embeddings()
    num_candidates = min(top_k * 5, len(faqs))
    # step 3 find top_k most similar FAQs
    similarities = util.cos_sim(user_embedding, faq_embeddings)[0]
    top_candidates = similarities.topk(k=num_candidates, sorted=True).indices
    candidate_faqs = [faqs[i] for i in top_candidates]
    # step 4 CrossEncoder Re-Ranking
    pairs = [
        (user_question, candidate["question"]) for candidate in candidate_faqs
    ]
    cross_scores = cross_encoder.predict(pairs)

    # step 5 find the best match
    best_idx = int(cross_scores.argmax())
    best_score = round(float(cross_scores[best_idx]), 3)

    if best_score >= threshold:
        answer = candidate_faqs[best_idx]["answer"]
        return BotResponse.with_answer_and_score(answer, best_score)
    return BotResponse.no_answer_found()
