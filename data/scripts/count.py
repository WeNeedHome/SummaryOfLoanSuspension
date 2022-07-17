import json

def getNumOfSusprnsion(propertiesJson:json.JSONDecoder):
    return len(propertiesJson)


def main():
    #parse Json
    with open("..\generated\properties.json","r",encoding="UTF-8") as file:
        propertiesJson = json.loads(file.read())
    print("共{}个楼盘".format(getNumOfSusprnsion(propertiesJson)))

if __name__ == '__main__':
    main()