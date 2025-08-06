from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from bot_pilot_chat.routing.faq_route import faq_router

app = FastAPI(root_path="api")

# CORS für lokale Tests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(faq_router, prefix="/api", tags=["faqs"])
