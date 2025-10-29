from rasa_sdk import Tracker
from rasa_sdk.executor import CollectingDispatcher

from bot_pilot.actions.action_submit_make_meeting_form import (
    ActionSubmitMakeMeetingForm,
)


def test_action_submit_make_meeting_form():
    # given
    dispatcher = CollectingDispatcher()
    tracker = Tracker(
        sender_id="test_user",
        slots={
            "meeting_datetime": "2025-10-28T12:00:00.000Z",
            "user_name": "Tobias Test",
            "user_mail": "jane.doe@web.de",
            "consultant_name": "Mario Testmueller",
            "user_type": "freiberufler",
            "termin_type": "erstberatung",
        },
        latest_message={},
        latest_action_name="action_submit_make_meeting_form",
        events=[],
        paused=False,
        followup_action=None,
        active_loop={},
    )
    domain = {}

    action = ActionSubmitMakeMeetingForm()

    # when
    result = action.run(dispatcher, tracker, domain)

    # then
    assert len(result) == 6
    for slot in result:
        assert slot.value is None
