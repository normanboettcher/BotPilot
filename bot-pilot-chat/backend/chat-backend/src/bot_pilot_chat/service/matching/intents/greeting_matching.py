import textwrap

import spacy

nlp = spacy.load("de_core_news_md")
BEGRUESSUNGEN = [
    "hallo",
    "hi",
    "guten tag",
    "guten morgen",
    "servus",
    "moin",
    "grüß dich",
    "hey",
    "na",
]


def is_greeting(message: str) -> bool:
    """
    Detects the intent of a greeting message.

    Args:
        message (str): The input message to analyze.

    Returns:
        str: The detected intent, which is 'greeting' for this function.
    """
    doc = nlp(message.lower())
    for token in doc:
        if token.text in BEGRUESSUNGEN:
            return True
    # If no greeting token is found, return False
    return False


def react_to_greeting(message: str) -> str:
    """
    Reacts to a greeting message with a friendly response.

    Args:
        message (str): The input message to analyze.

    Returns:
        str: A friendly greeting response.
    """
    if is_greeting(message):
        return "Hallo! Wie kann ich Ihnen helfen?"
    return textwrap.dedent(
        """
                        Entschuldigung, ich habe Sie nicht ganz verstanden.
                        Wie kann ich Ihnen helfen?"""
    ).strip()
