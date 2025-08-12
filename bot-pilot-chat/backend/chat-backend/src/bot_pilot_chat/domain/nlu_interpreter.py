from rasa.core.agent import Agent


class NlUInterpreter:
    def __init__(self, model_path: str):
        self._model_path = model_path
        self.model = None

    async def load_model(self):
        if self.model is None:
            print(f"loading model from {self._model_path}")
            self.model = Agent.load(self._model_path)
        else:
            print("model already loaded")

    async def predict_intent(self, message: str):
        return await self.model.parse_message(message)

    async def handle_text(self, message: str) -> str:
        result = await self.model.handle_text(message)
        print(f'result from handle_text: {result}')
        if result[0] and 'text' in result[0]:
            return result[0]['text']
        else:
            return ""
