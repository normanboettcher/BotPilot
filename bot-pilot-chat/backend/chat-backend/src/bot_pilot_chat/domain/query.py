from pydantic import BaseModel


class BotQuery(BaseModel):
    question: str
