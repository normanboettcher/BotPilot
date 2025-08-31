import logging

from markdown_strings import bold

from rasa_sdk import Tracker
from utils.entity_utils import map_medium

logger = logging.getLogger(__name__)


def make_termin_from_medium(tracker: Tracker) -> tuple[str, str]:
    medium = None
    for entity in tracker.slots:
        if entity == "termin_medium":
            medium = tracker.slots["termin_medium"]
    if medium:
        medium = map_medium(medium)
        message = (
            "Sehr gut, Sie möchten also einen Termin per "
            + bold(medium)
            + " vereinbaren."
        )
        logger.debug(f"termin_medium: {medium}")
        return message, medium
    return (
        "Bei der Verarbeitung Ihrer Terminanfrage ist leider "
        "ein Fehler aufgetreten."
    ), f"{medium}"
