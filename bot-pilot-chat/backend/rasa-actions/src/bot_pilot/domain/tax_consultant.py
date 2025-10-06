from dataclasses import dataclass, asdict


@dataclass
class TaxConsultant:
    tax_consultant_id: str
    tax_consultant_lastname: str
    tax_consultant_firstname: str

    def as_dict(self):
        return asdict(self)
