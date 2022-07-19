import http.client as http_client

import requests

from settings import ENABLE_DEBUG_REQUESTS
from supports.log import logger

# enable debug requests, ref: https://stackoverflow.com/a/16630836/9422455
http_client.HTTPConnection.debuglevel = ENABLE_DEBUG_REQUESTS


class LiveSession(requests.Session):

    def __init__(self, base_url: str = None):
        super().__init__()
        self._base_url = base_url
        self.headers[
            "User-Agent"] = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36'
        # self.verify = False

    @property
    def base_url(self):
        return self._base_url

    @base_url.setter
    def base_url(self, new_base_url: str):
        self._base_url = new_base_url.strip('/')

    def request(
        self,
        method,
        url,  # type: str
        *args,
        **kwargs
    ):
        """
        custom base url, ref: https://stackoverflow.com/a/51026159/9422455
        """
        if self._base_url and url.startswith('/'):
            url = self._base_url + url
        # 转码才能terminal跳转
        logger.info(f'requesting: {url}')
        return super().request(method, url, *args, **kwargs)
