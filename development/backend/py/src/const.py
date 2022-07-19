import os.path as path


# path

SRC_DIR = path.dirname(__file__)
PROJECT_DIR = path.dirname(SRC_DIR)
ROOT_DIR = path.dirname(path.dirname(path.dirname(PROJECT_DIR)))

DATA_DIR = path.join(ROOT_DIR, "data")
DATA_GEN_DIR = path.join(DATA_DIR, "generated")
DATA_GEN_DETAILED_DIR = path.join(DATA_GEN_DIR, "detailed")
