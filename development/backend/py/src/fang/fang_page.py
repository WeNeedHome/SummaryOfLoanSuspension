import os
from typing import TypedDict, Dict

import yaml

from const import SRC_DIR


class FangPage(TypedDict):
    type: str
    title: str
    path: str


def convert_fang_page(fang_page: FangPage, property_id: str) -> FangPage:
    fang_page["path"] = fang_page["path"].format(id=property_id)
    return fang_page


with open(os.path.join(SRC_DIR, "fang/fang-page.yml")) as f:
    FANG_PAGES: Dict[str, FangPage] = yaml.full_load(f.read())
