# backend

## 楼盘接口

```typescript 
// development/backend/property.ts
export interface Property {
    province: string
    city: string
    name: string
    link?: string
    month?: number
}
```

## 自动验证readme与生成楼盘数据 

如果会`nodejs`的话，可以运行以下语句，它将自动检查`README.md`文档中的计数问题，您可以根据提示进行逐一人工检查，直到确保准确：

```shell
ts-node development/backend/analyze.ts
```

脚本使用提醒：
1. `ts-node` 可以通过 `npm i -g ts-node`安装
2. 脚本需要先初始化：`cd analysis/backend && npm i`
3. 建议直接加入hook脚本，每次commit的时候自动检查：
```shell
echo 'ts-node development/backend/analyze.ts' >> .git/hooks/post-commit
chmod +x .git/hooks/post-commit
```

在`README.md`文档人工校验通过的情况下，该脚本输出：

```text
...
parsing province 吉林省
parsing province 内蒙古自治区
总计25个省份，103个城市，276个楼盘
楼盘合计校验通过！
```

同时它也会自动生成楼盘数据：

```text
// data/generated/properties.json
[
  {
    "name": "恒大珑庭",
    "city": "景德镇市",
    "province": "江西省"
  },
  ...
  {
    "name": "鸿海城",
    "city": "南昌市",
    "province": "江西省",
    "month": 10
  },
  ...
    {
    "name": "豫发白鹭源春晓三期",
    "city": "郑州市",
    "province": "河南省",
    "link": "./images/郑州航空港区豫发白鹭源春晓三期全体业主停贷告知书.jpg"
  }
  ...
]
```

## 地图可视化数据结构

```typescript
// frontend/src/property.ts
export type Pos = google.maps.LatLngLiteral

export interface Address {
    province: string
    city?: string
    district?: string
    pos: Pos
}

export interface AddressWithCount extends Address {
    count: number
}

export type CitiesOnMap = Record<string, AddressWithCount>
```

## 生成地图可视化数据

在已有最新的`properties.json`的数据前提下，运行：

```shell
ts-node develpment/backend/genCitiesForVisualization.ts
```

output:

```text
{
  "江西省-景德镇市": {
    "province": "江西省",
    "city": "景德镇市",
    "pos": {
      "lng": 117.178222,
      "lat": 29.268945
    },
    "count": 3
  },
  ...
}
```

## 数据来源

- 全国城市经纬度（文件：`data/region.json`）：https://github.com/boyan01/ChinaRegionDistrict
- GoogleMapsApiKey: https://github.com/webcoiruser/tvc/blob/2c10cad726e92282ba3a8e672890bd91a40160ba/gradle.properties
- 
