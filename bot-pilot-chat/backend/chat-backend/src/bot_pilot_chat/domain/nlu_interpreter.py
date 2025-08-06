from rasa.core.agent import Agent


class NlUInterpreter:
    def __init__(self, model_path: str):
        self._model_path = model_path
        self.model = None

    async def load_model(self):
        self.model = Agent.load(self._model_path)

    async def predict_intent(self, message: str):
        return await self.model.parse_message(message)

    async def handle_text(self, message: str):
        result = await self.model.handle_text(message)
        print(f'result from handle_text: {result}')
        return result[0]['text']
