from pymongo.errors import DuplicateKeyError

from fang.fang_page import convert_fang_page, FANG_PAGES
from fang.property_ import get_property_id_robust
from fang.idb_property import IDBProperty
from settings import COLL_NAME_DETAIL, DB_NAME
from supports.db import db
from supports.errors import Errors
from supports.log import logger
from supports.sess import LiveSession
from supports.utils import get_city_code_robust, is_city_code


class Fang:
    """
    房天下接口实现
    """

    def __init__(self, property_id: str, city_name: str):
        """

        Args:
            property_id: 楼盘ID，需要事先通过 `search_property` 函数获得
            city_name: 城市代码，比如 sh 与 bj
        """
        self._city_name = city_name
        self._city_code = get_city_code_robust(city_name)
        self._id = get_property_id_robust(property_id, self._city_name)
        self._base_url = f'https://{self._city_code}.newhouse.fang.com'
        self._fang_pages = dict((i, convert_fang_page(j, self._id)) for i, j in FANG_PAGES.items())
        logger.debug("fang pages: ", self._fang_pages)

        self._lss = LiveSession(self._base_url)

    @property
    def id(self):
        return self._id

    @property
    def city_code(self):
        return self._city_code

    @property
    def city_name(self):
        if is_city_code(self._city_name):
            logger.warning("used pronunciation as the name since input is not chinese")
        return self._city_name

    def _check_api_type(self, api_key) -> str:
        assert api_key in self._fang_pages, Errors.NOT_QUALIFIED
        return self._fang_pages[api_key]['type']

    def _fetch(self, api_key: str):
        res = self._lss.get(self._fang_pages[api_key]['path'])
        result = res.json() if self._check_api_type(api_key) == "json" else res.text
        return result

    def fetch_detail(self) -> IDBProperty:
        result = self._fetch('detail')
        assert result['code'] == '100', result
        item = result["data"]  # type: IDBProperty
        assert item["bbs_id"] == self._id, result
        item["_id"] = self._id
        logger.debug(item)
        logger.info(f'inserting property detail of id {self._id} into {DB_NAME}-{COLL_NAME_DETAIL}')
        try:
            inserted_result = db[COLL_NAME_DETAIL].insert_one(item, bypass_document_validation=True)
            logger.info(f'inserted result: {inserted_result}')
        except DuplicateKeyError:
            logger.warning('duplicated')
        return item