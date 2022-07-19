from enum import Enum


class Errors(Enum):
    # base
    NO_RESULT = "没有结果"
    NOT_EQUAL = "不相等"
    NOT_QUALIFIED = "不符合限定"

    # re
    RE_NOT_MATCHED = "正则不匹配"

    # bs4
    ELE_NOT_FOUND = "目标元素没有找到"
    ELE_TOO_MANY = "候选元素太多"
