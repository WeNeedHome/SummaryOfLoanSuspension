# 烂尾楼数据分析（持续）

## features

### 【后端】加入了城市地名校验、数量校验

```text
2022/07/15 05:56:19 (base) ➜  backend git:(main) ✗ ts-node v2-flat/genProperties.ts && ts-node v2-flat/genCitiesOnMap.ts
properties count in province 河南省 failed to validate, calculated:  46, marked:  44
    properties count in city 武汉市 failed to validate, calculated:  14, marked:  13
    properties count in city 湘潭市 failed to validate, calculated:   4, marked:   3
properties count in province 湖南省 failed to validate, calculated:  25, marked:  24
    properties count in city 镇江市 failed to validate, calculated:   2, marked:   1
properties count in province 江苏省 failed to validate, calculated:  13, marked:  12
    properties count in city 西安市 failed to validate, calculated:  14, marked:  15
properties count in province 陕西省 failed to validate, calculated:  14, marked:  15
    properties count in city 南宁市 failed to validate, calculated:   7, marked:   6
    properties count in city 桂林市 failed to validate, calculated:   1, marked:   2
    properties count in city 黔江区 failed to validate, calculated:   2, marked:   1

```

### 【前端】对接了城市的经纬度数据，实现了烂尾楼可视化


## usage

分别见前后端部分

## reference

- 谷歌地图js api(细节要看js api，实现看react api或者内部源码): https://developers.google.com/maps/documentation/javascript
- 谷歌地图react api: https://react-google-maps-api-docs.netlify.app/

## 数据来源

- 全国城市经纬度（文件：`data/region.json`）：https://github.com/boyan01/ChinaRegionDistrict
- GoogleMapsApiKey: https://github.com/webcoiruser/tvc/blob/2c10cad726e92282ba3a8e672890bd91a40160ba/gradle.properties
- 
