from dataclasses import dataclass


@dataclass
class ButtonOption:
    title: str
    payload: str
    emoji: str

    def render(self) -> dict:
        return {
            "title": f"{self.emoji} {self.title}",
            "payload": self.payload,
        }
