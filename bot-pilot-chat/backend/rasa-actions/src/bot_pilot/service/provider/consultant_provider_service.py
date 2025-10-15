from bot_pilot.domain.tax_consultant import TaxConsultant


def get_consultant(customer_id: str) -> dict[str, TaxConsultant]:
    return {
        "1": TaxConsultant("1", "Meyer", "Peter"),
        "2": TaxConsultant("2", "Schmidt", "Oliver"),
        "3": TaxConsultant("3", "Müller", "Stefanie"),
    }
