from typing import Any, Coroutine

from fastapi import APIRouter
import requests
from bot_pilot_chat.domain.nlu_interpreter import NlUInterpreter
from bot_pilot_chat.domain.query import BotQuery
from bot_pilot_chat.domain.response import BotResponse
from bot_pilot_chat.service.matching import find_most_similar_faq

faq_router = APIRouter()

nlu_interpreter = NlUInterpreter(
    "/home/norman/projects/bot-pilot/bot-pilot-chat/backend/chat-backend/models/new_model.gz")


@faq_router.post("/faqs")
async def get_answer(query: BotQuery) -> dict:
    await nlu_interpreter.load_model()
    res = await nlu_interpreter.predict_intent(query.question)
    intent, confidence = extract_intent(res)
    print(f"intent: {intent}, confidence: {confidence}")
    if confidence < 0.5 or intent == "nlu_fallback":
        return BotResponse.no_answer_found().as_dict()
    elif intent == "faq":
        result = find_most_similar_faq(query.question)
        return result.as_dict()
    else:
        result = await nlu_interpreter.handle_text(query.question)
        return BotResponse.with_answer_and_score(result, confidence).as_dict()


def extract_intent(result: dict) -> tuple[str, float]:
    return result['intent']['name'], result['intent']['confidence']
