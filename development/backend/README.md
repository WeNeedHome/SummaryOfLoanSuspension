# backend

[--> 后端TODO](../../TODO.md#后端)

## 接口

### 楼盘数据接口

```typescript
// development/backend/ds/property.ts
export interface Property {
    province: string
    city: string
    name: string
    link?: string
    month?: number
}
```

### 城市数据接口

```typescript
// frontend/react/src/property.ts
export interface Pos {
    lat: number
    lng: number
}

export interface Address {
    province: string
    city?: string
    district?: string
    pos: Pos
}

export interface AddressWithCount extends Address {
    count: number
}
```

## 脚本

### `analyze.ts`

[analyze.ts](./src/analyze.ts) 脚本负责解析 [README.md](../../README.md) 文档，校验其市、省、国三级的数据合计，生成 [基于楼盘的结构化停贷数据文件](../../data/generated/properties.json)。该脚本已写入 CI，由 WeihanLi 维护。

具体使用如下：

```shell
ts-node analyze.ts
```

### `genCitiesForVisualization.ts`

[genCitiesForVisualization.ts](./src/genCitiesForVisualization.ts) 脚本负责解析基于前者生成的 [基于楼盘的结构化数据文件](../../data/generated/properties.json)，提供含有经纬度、楼盘合计的[基于城市的结构化停贷数据文件](../../data/generated/cities-for-visualization.json)，可供于可视化。该脚本已写入 CI，由 WeihanLi 维护。

具体使用如下：

```shell
ts-node genCitiesForVisualization.ts
```

### `genMap.ts`

[genMap.ts](./src/genMap.ts) 脚本负责解析基于前者生成的 [基于城市的结构化停贷数据文件](../../data/generated/cities-for-visualization.json)，对接Google Static Map API，生成基于城市的全国停贷地图：[基于城市的全国停贷地图（标准主题）](../../data/generated/visualization-standard.png)、[基于城市的全国停贷地图（淡色主题）](../../data/generated/visualization-light.png)、[基于城市的全国停贷地图（暗色主题）](../../data/generated/visualization-dark.png)。该脚本已写入 CI，由 WeihanLi 维护。

具体使用如下：

```shell
ts-node development/backend/src/genMap.ts           # generate standard
ts-node development/backend/src/genMap.ts -t light  # generate light
ts-node development/backend/src/genMap.ts -t dark   # generate dark
```

## `validateLocalImages.ts`

[validateLocalImages.ts](./src/validateLocalImages.ts) 可以对 [images](../../images) 目录下的文件的在 [README.md文档](../../README.md) 内的引用进行核验，以确保没有游离的文件。

具体使用如下：

```shell
ts-node validateLocalImages.ts
```

## 数据来源

- 全国城市经纬度：<https://github.com/boyan01/ChinaRegionDistrict>
- GoogleMapsApiKey: <https://github.com/webcoiruser/tvc/blob/2c10cad726e92282ba3a8e672890bd91a40160ba/gradle.properties>
