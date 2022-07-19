import re
from typing import Union

import pypinyin

from supports.errors import Errors


# general

def ensure_one(l: Union[list, int]):
    n = len(l) if isinstance(l, list) else l
    assert n > 0, Errors.NO_RESULT
    assert n == 1, f"{Errors.ELE_TOO_MANY}: {n}"
    return l[0] if isinstance(l, list) else 1


def ensure_ok(i):
    assert i, Errors.NO_RESULT
    return i


# city

def revert_dict(a: dict) -> dict:
    return dict((j, i) for i, j in a.items())


def get_city_code_from_name(city_name: str) -> str:
    return ''.join([i[0] for i in pypinyin.pinyin(city_name, style=pypinyin.Style.FIRST_LETTER)])


def is_city_code(city: str) -> bool:
    return re.match(r'^[a-zA-Z]+$', city) is not None


def get_city_code_robust(city: str) -> str:
    return city if is_city_code(city) else get_city_code_from_name(city)
