import os


def app_config():
    return {
        "APP_PREFIX": "api",
        "FAQ_DATA_PATH": os.path.join(
            "/home/norman/projects",
            "bot-pilot",
            "bot-pilot-chat",
            "backend",
            "chat-backend",
            "src",
            "bot_pilot_chat",
            "data",
            "faqs.json",
        ),
    }
