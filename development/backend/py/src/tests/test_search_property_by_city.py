import warnings
from unittest import TestCase

from fang.fang import Fang
from fang.property_ import fetch_property_id


class Test(TestCase):

    def setUp(self) -> None:
        """
        suppress the warning causes by unittest, see: [ResourceWarning unclosed socket in Python 3 Unit Test - Stack Overflow](https://stackoverflow.com/questions/48160728/resourcewarning-unclosed-socket-in-python-3-unit-test)
        """
        warnings.filterwarnings(action="ignore", message="unclosed", category=ResourceWarning)

    def test_fetch_property_id_from_name(self):
        self.assertEqual(fetch_property_id('泰禾大城小院', '上海'), '1210125944')
        self.assertRaises(AssertionError, lambda: fetch_property_id('恒大名都', '广州'))

    def test_fetch_property_developer_from_id(self):
        self.assertEqual(Fang('1210125944', '上海').fetch_detail()["developerAll"], '上海禾柃房地产开发有限公司,上海兴闳房地产开发有限公司')
        self.assertRaises(AssertionError, lambda: Fang('恒大名都', '广州').fetch_detail()['developerAll'])

    def test_fetch_property_developer_from_name(self):
        self.assertEqual(Fang('泰禾大城小院', '上海').fetch_detail()['developerAll'], '上海禾柃房地产开发有限公司,上海兴闳房地产开发有限公司')
        self.assertRaises(AssertionError, lambda: Fang('恒大名都', '广州').fetch_detail()['developerAll'])
