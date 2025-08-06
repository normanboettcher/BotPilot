from fastapi import APIRouter
from bot_pilot_chat.domain.query import BotQuery
from bot_pilot_chat.service.matching.text_matching import find_most_similar_faq

faq_router = APIRouter()


@faq_router.post("/faqs")
def get_answer(query: BotQuery) -> dict:
    print(f"{query.question}")
    result = find_most_similar_faq(query.question)
    return result.as_dict()
