from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from bot_pilot_chat.domain.nlu_interpreter import NlUInterpreter
from bot_pilot_chat.routing.faq_route import faq_router

app = FastAPI(root_path="api")

import os
import tensorflow as tf

print("LD_LIBRARY_PATH:", os.environ.get("LD_LIBRARY_PATH"))
print("GPUs:", tf.config.list_physical_devices("GPU"))

# CORS für lokale Tests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(faq_router, prefix="/api", tags=["faqs"])
