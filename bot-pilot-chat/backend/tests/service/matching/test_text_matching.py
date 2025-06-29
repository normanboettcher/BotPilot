from bot_pilot_chat.service.matching import find_most_similar


def test_find_most_similar_returns_answer():
    question = "Welche Dokumente brauche ich für die Steuererklärung?"
    response = find_most_similar(question, threshold=0.3)

    assert response._success is True
    assert "Einkommensnachweise" in response._answer
    assert "Belege" in response._answer
    assert "Sonderausgaben" in response._answer
    assert response._score >= 0.3


def test_find_most_similar_no_answer():
    question = "Unverständliche Frage ohne Antwort"
    response = find_most_similar(question, threshold=0.9)

    assert response._success is False
