import re
import urllib.parse

import requests
from bs4 import BeautifulSoup

from fang.idb_property import IDBProperty
from settings import COLL_NAME_DETAIL
from supports.db import db
from supports.errors import Errors
from supports.log import logger
from supports.utils import ensure_one, get_city_code_robust, ensure_ok


def is_property_id(property_: str) -> bool:
    return re.match(r'^\d+$', property_) is not None


def search_property_by_id(property_id: str) -> IDBProperty:
    return ensure_ok(db[COLL_NAME_DETAIL].find_one({"_id": property_id}))


def search_property_by_name(property_name: str, city_name: str) -> IDBProperty:
    """
    数据库中的城市数据，是名称形式，不是代码形式
    目前就做精确搜索吧，TODO: 未来再做模糊搜索
    """
    logger.info(f'searching in the db... property name: {property_name}, city name: {city_name}')
    return ensure_ok(db[COLL_NAME_DETAIL].find_one({"city": city_name, "ProjName": property_name}))


def get_property_name_from_id(property_id: str, city: str = None) -> str:
    return search_property_by_id(property_id)["ProjName"]


def get_property_id_from_name(property_name: str, city: str) -> str:
    return search_property_by_name(property_name, city)['bbs_id']


def get_property_name_robust(property_: str, city: str = None) -> str:
    return get_property_name_from_id(property_) if is_property_id(property_) else property_


def get_property_id_robust(property_: str, city: str) -> str:
    return property_ if is_property_id(property_) else get_property_id_from_name(property_, city)


def fetch_property_id(property_name: str, city: str) -> str:
    """
    Notes:
        尽管在搜索楼盘的列表页，也已经能获得不少的信息，但是缺少开发商等重要信息
        因此，不做过多解析，没有必要，确认找到 id 之后立即调用 json api 即可

    Examples:
        https://sh.newhouse.fang.com/house/s/a9泰禾大城小院/

    """
    logger.info(f'fetching property id of {city}-{property_name}')
    city = get_city_code_robust(city)
    property_name = urllib.parse.quote(get_property_name_robust(property_name))

    url = f"https://{city}.newhouse.fang.com/house/s/a9{property_name}/"
    content = requests.get(url).text
    soup = BeautifulSoup(content, "html.parser")

    count = int(re.search(r'\d+', soup.select('#allUrl span')[0].text).group())
    ensure_one(count)
    ele_item = ensure_one(soup.select('#newhouse_loupan_list > ul > li'))  # 新房列表，本项目主要就是针对新房的，所以其他的不考虑
    url = ensure_one(ele_item.select(".house_value .nlcd_name a"))['href']  # 没有类型提示好痛苦
    property_id = re.search(r'\d+', url).group()  # id是纯数字
    assert property_id and abs(len(property_id) - 9) < 3, \
        f'{Errors.RE_NOT_MATCHED}: {property_id}, count: {count}'  # id是九位左右
    return property_id


if __name__ == '__main__':
    result = fetch_property_id('恒大名都', '广州')
    print(result)
