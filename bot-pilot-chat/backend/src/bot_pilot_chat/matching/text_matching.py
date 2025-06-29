from sentence_transformers import SentenceTransformer, util
import json
from bot_pilot_chat.domain.response import BotResponse

model = SentenceTransformer('all-MiniLM-L6-v2')

##Top Level for caching
_faqs = None
_faq_embeddings = None


def load_faq_embeddings():
    global _faqs, _faq_embeddings
    if _faqs is None or _faq_embeddings is None:
        with open('data/faqs.json', encoding='utf-8') as f:
            _faqs = json.load(f)
        faq_questions = [faq['question'] for faq in _faqs]
        _faq_embeddings = model.encode(faq_questions, convert_to_tensor=True)
    return _faqs, _faq_embeddings


def find_most_similar(user_question, top_k=1, threshold=0.5):
    user_embedding = model.encode(user_question, convert_to_tensor=True)
    faqs, faq_embeddings = load_faq_embeddings()
    similarities = util.cos_sim(user_embedding, faq_embeddings)[0]

    best_score = round(float(similarities.max()), 3)
    best_idx = int(similarities.argmax().item())

    if best_score >= threshold:
        answer = faqs[best_idx]['answer']
        return BotResponse.with_answer_and_score(answer, best_score)
    return BotResponse.no_answer_found()
