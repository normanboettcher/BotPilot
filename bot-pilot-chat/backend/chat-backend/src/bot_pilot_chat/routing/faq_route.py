from fastapi import APIRouter

from bot_pilot_chat.domain.nlu_interpreter import NlUInterpreter
from bot_pilot_chat.domain.query import BotQuery
from bot_pilot_chat.service.matching import find_most_similar_faq

faq_router = APIRouter()

nlu_interpreter = NlUInterpreter(
    "/home/norman/projects/bot-pilot/bot-pilot-chat/backend/chat-backend/models/20250806-063717-boxy-city.tar.gz")


@faq_router.post("/faqs")
async def get_answer(query: BotQuery) -> dict:
    await nlu_interpreter.load_model()
    res = await nlu_interpreter.predict_intent(query.question)
    result = find_most_similar_faq(query.question)
    return result.as_dict()
