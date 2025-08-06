from rasa_sdk import Action


class ActionNLUFallback(Action):
    def name(self):
        return "action_default_fallback"

    def run(self, dispatcher, tracker, domain):
        dispatcher.utter_message("Es tut mir leid, ich konnte Sie noch nicht ganz verstehen. "
                                 "Bitte formulieren Sie Ihre Frage anders.")
        return []
