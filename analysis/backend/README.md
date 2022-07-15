# backend

## usage

### 1. 生成结构化的省市烂尾数据

这个脚本，从主仓库的 `README.md` 中解析各个省市烂尾楼信息，然后输出结构化。

run:

```shell
ts-node v2-flat/genProperties.ts
```

data-struct:

```typescript 
// backend/v2-flat/ds.ts
export interface Property {
    province: string
    city: string
    name: string
    link?: string
    month?: number
}
```

output:

```text
// backend/v2-flat/properties.json
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

### 3. 为烂尾楼数据加上地理位置标识

run:

```shell
ts-node v2-flat/genCitiesOnMap.ts
```

data-struct:

```typescript
// frontend/src/ds.ts
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