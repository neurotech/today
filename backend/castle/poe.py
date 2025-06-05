import requests
from typing import TypedDict, Any


class CurrencyDetail(TypedDict):
    id: int
    icon: str
    name: str
    tradeId: str


class CurrencyLine(TypedDict):
    pay: Any
    receive: Any
    chaosEquivalent: float


class CurrencyResponse(TypedDict):
    chaos_orb: CurrencyDetail
    currency_detail: CurrencyDetail
    buy: float
    sell: float


def get_currency_line(lines: Any, currency: str = "Divine Orb") -> CurrencyLine:
    currency_line: CurrencyLine = {}

    for line in lines:
        if line["currencyTypeName"] == currency:
            currency_line = {
                "pay": line["pay"],
                "receive": line["receive"],
                "chaosEquivalent": line["chaosEquivalent"],
            }
            break

    return currency_line


def get_currency_detail(details: Any, currency: str) -> CurrencyDetail:
    for detail in details:
        if detail["name"] == currency:
            currency_detail = detail
            break

    return currency_detail


def get_poe_currency(
    league: str = "Standard", currency: str = "Divine Orb"
) -> CurrencyResponse:
    """Fetches currency data from poe.ninja for the specified currency and league."""
    currency_detail: CurrencyDetail = {}
    currency_line: CurrencyLine = {}

    contents = requests.get(
        f"https://poe.ninja/api/data/currencyoverview?league={league}&type=Currency"
    )
    json_data = contents.json()

    chaos_orb = get_currency_detail(json_data["currencyDetails"], "Chaos Orb")
    currency_detail = get_currency_detail(json_data["currencyDetails"], currency)
    currency_line = get_currency_line(json_data["lines"], currency)
    buy = currency_line["receive"]["value"]
    sell = 1 / currency_line["pay"]["value"]

    return {
        "chaos_orb": chaos_orb,
        "currency_detail": currency_detail,
        "buy": buy,
        "sell": sell,
    }
