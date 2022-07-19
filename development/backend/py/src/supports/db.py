import pymongo

from settings import DB_NAME, MONGO_URI

client = pymongo.MongoClient(MONGO_URI)
db = client[DB_NAME]
