from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import json

app = FastAPI()

# CORS für lokale Tests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/chat")
async def get_answer(q: str):
    with open("data/faqs.json", "r", encoding="utf-8") as f:
        faqs = json.load(f)

    for entry in faqs:
        if q.lower() in entry["frage"].lower():
            return {"response": entry["antwort"]}

    return {"response": "Dazu habe ich aktuell leider keine Antwort gefunden."}
