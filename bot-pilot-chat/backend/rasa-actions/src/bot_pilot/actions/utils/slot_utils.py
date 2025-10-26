import logging
from datetime import datetime
from typing import List

from rasa.shared.core.events import SlotSet

logger = logging.getLogger(__name__)


def meeting_date_from_slot_value(
    slot_value: str | None, format: str = "%d.%m.%Y %H:%M"
) -> str | None:
    utc_format = "%Y-%m-%dT%H:%M:%S.%fZ"
    if slot_value is None:
        return None
    try:
        return datetime.strptime(slot_value, utc_format).strftime(format)
    except ValueError as e:
        logger.error(
            f"Could not parse date [{slot_value}] into format: [{format}]."
            f"Reason: {e}"
        )
        pass
    return None


def clear_slots(collected_slots: List[str]) -> List[SlotSet]:
    if len(collected_slots) == 0:
        return []
    return [SlotSet(key=slot, value=None) for slot in collected_slots if slot]
