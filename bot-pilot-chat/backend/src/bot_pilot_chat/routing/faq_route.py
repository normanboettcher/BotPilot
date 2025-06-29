from fastapi import APIRouter

from bot_pilot_chat.domain.query import BotQuery
from bot_pilot_chat.matching.text_matching import find_most_similar

faq_router = APIRouter()


@faq_router.get("/faqs/")
def get_answer(query: BotQuery) -> dict:
    result = find_most_similar(query.question)
    return result.as_dict()
