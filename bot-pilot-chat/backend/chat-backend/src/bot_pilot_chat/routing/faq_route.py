from fastapi import APIRouter
from bot_pilot_chat.domain.query import BotQuery
from bot_pilot_chat.service.matching import find_most_similar_faq

faq_router = APIRouter()


@faq_router.post("/faqs")
async def get_answer(query: BotQuery) -> dict:
    result = find_most_similar_faq(query.question)
    return result.as_dict()
