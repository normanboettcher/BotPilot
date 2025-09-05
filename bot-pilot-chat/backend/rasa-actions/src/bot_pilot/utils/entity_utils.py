def map_medium(value: str) -> str:
    value = value.lower()
    if value in ["telefonisch", "telefon", "anrufen"]:
        return "Telefon"
    if value in ["mail", "e-mail", "email"]:
        return "E-Mail"
    if value in ["online", "digital", "webseite"]:
        return "online"
    return value
