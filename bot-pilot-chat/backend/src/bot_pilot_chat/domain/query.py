from pydantic.v1 import BaseModel


class BotQuery(BaseModel):
    question: str
