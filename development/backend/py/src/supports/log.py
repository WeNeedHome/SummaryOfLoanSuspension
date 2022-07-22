import logging.config
from os import path

import yaml

with open(path.join(path.dirname(__file__), 'logger.config.yml')) as f:
    config = yaml.safe_load(f.read())
    logging.config.dictConfig(config)

logger = logging.getLogger()
