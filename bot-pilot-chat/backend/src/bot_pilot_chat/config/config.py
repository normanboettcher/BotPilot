import os


def app_config():
    return {
        "APP_PREFIX": "api",
        "FAQ_DATA_PATH": os.path.join(
            "/home/norman/Projekte",
            "bot-pilot",
            "bot-pilot-chat",
            "backend",
            "src",
            "bot_pilot_chat",
            "data",
            "faqs.json",
        ),
    }
