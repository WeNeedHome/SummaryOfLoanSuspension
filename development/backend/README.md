# backend (v2)

[--> 后端TODO](../../TODO.md#后端)

## versions

- [DEPRECIATED: V1](./src/v1/README.md)

## core

### 开发商、楼盘等数据网络接口

该接口能搜索获得开发商数据（尽管有点瑕疵）：`https://fang.com/quanwangso/ajax/search.html?keyword=恒大&cityname=上海&num=1000`

另外该网站还可基于楼盘搜索到开发商，这需要写一整套爬虫流程，感兴趣的朋友可以实现一下，属于 [TODO](../../TODO.md) 中的 `B001` 需求。

该接口由 richardo876 提供，具体见：[建议新增分开发商数据,给开放商压力,让购房者注意规避 by junioresident · Pull Request #814](https://github.com/WeNeedHome/SummaryOfLoanSuspension/pull/814)

### 停贷数据基本接口

```typescript
// ds/property.ts
export interface IItem {
    name: string
    uri: string
}

export interface INode {
    name: string
    count: number   // 文档中的标记总数
    children: any[]
}

export interface ICity extends INode {children: IItem[]}

export interface IProv extends INode {children: ICity[]}

export interface ITree extends INode {children: IProv[]}
```

### `genPropertiesTreeFromReadme.ts`

[genPropertiesTreeFromReadme.ts](src/genPropertiesTreeFromReadme.ts) 可以从 [README.md文档](../../README.md) 中解析出**树状的**
停贷数据并存储，这相对于原先的 [analyze.ts](./src/v1/analyze.ts) 脚本来说有诸多好处。

首先，原先的 `analyze.ts`
脚本没有输出任何的中间结构，尽管它也基于局部组合实现了对省份的拼音排序，但是由于其没有构建树状结构，而是线性结构，导致其无法实现任意级别的序列重组。而 `genPropertiesTreeFromReadme.ts`
则吸收了 `analyze.ts` 中的所有精华设计部分，并专注于输出树状结构，对于 `markdown` 重写等功能则留给其他脚本接续完成。

用法：

```shell
ts-node genPropertiesTreeFromReadme.ts
```

输出位置： [properties-tree.json](../../data/generated/properties-tree.json)。

### `genMdFromPropertiesTree.ts`

[genMdFromPropertiesTree.ts](src/genMdFromPropertiesTree.ts)
可以对基于 [genPropertiesTreeFromReadme.ts](src/genPropertiesTreeFromReadme.ts)
输出的 [properties-tree.json](../../data/generated/properties-tree.json)
结构树的基础上，进行自由重组，然后重新生成markdown文件，并且支持与原有的 `README.md` 进行无缝拼接（`-j`参数），从而生成一份新的 `README.md` 文件。

用法：

```shell
ts-node genMdFromPropertiesTree.ts -h # 查看使用说明

# 默认按拼音增序进行三级排序（一直排到项目级别）（排头兵：安徽-合肥-恒大……），并输出到`README-by-lines.md`文件（纯省份文件）
ts-node genMdFromPropertiesTree.ts                
        
# 按数量减序进行二级排序（一直排到城市级别）（排头兵：河南-郑州），并输出到`README-by-lines.md`文件
ts-node genMdFromPropertiesTree.ts -b count -d 2  

# 修改输出文件地址，:waring: 注意，如果修改为本工程的 README.md 文档，将直接覆盖！
ts-node genMdFromPropertiesTree.ts -t /tmp/README.md 

# 与 readme 文档合并输出完整的 README 文档
ts-node genMdFromPropertiesTree.ts -j
```

由此可知，我们只需要使用 `ts-node genMdFromPropertiesTree.ts -j -t ../../README.md` 即可以直接实现覆写 README
的效果，但是请注意，这样的操作是不可逆的，所以必要时要记得备份。

由于目前，我们还未确定是否采用按行输出项目的方案，因此本方案仅试运行，晚点我们发个PR探讨一下。

## visualization

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

### `genCitiesForVisualization.ts`

[genCitiesForVisualization.ts](src/supports/genCitiesForVisualization.ts)
脚本负责解析基于前者生成的 [基于楼盘的结构化数据文件](../../data/generated/properties.json)
，提供含有经纬度、楼盘合计的[基于城市的结构化停贷数据文件](../../data/generated/cities-for-visualization.json)，可供于可视化。该脚本已写入 CI，由 WeihanLi 维护。

用法：

```shell
ts-node genCitiesForVisualization.ts
```

### `genMap.ts`

[genMap.ts](src/supports/genMap.ts) 脚本负责解析基于前者生成的 [基于城市的结构化停贷数据文件](../../data/generated/cities-for-visualization.json)
，对接Google Static Map API，生成基于城市的全国停贷地图：[基于城市的全国停贷地图（标准主题）](../../data/generated/visualization-standard.png)
、[基于城市的全国停贷地图（淡色主题）](../../data/generated/visualization-light.png)
、[基于城市的全国停贷地图（暗色主题）](../../data/generated/visualization-dark.png)。该脚本已写入 CI，由 WeihanLi 维护。

用法：

```shell
ts-node development/backend/src/genMap.ts           # generate standard
ts-node development/backend/src/genMap.ts -t light  # generate light
ts-node development/backend/src/genMap.ts -t dark   # generate dark
```

## others

### `validateLocalImages.ts`

[validateLocalImages.ts](src/supports/validateLocalImages.ts) 可以对 [images](../../images)
目录下的文件的在 [README.md文档](../../README.md) 内的引用进行核验，以确保没有游离的文件。

用法：

```shell
ts-node validateLocalImages.ts
```

## references

- 全国城市经纬度：<https://github.com/boyan01/ChinaRegionDistrict>
- GoogleMapsApiKey: <https://github.com/webcoiruser/tvc/blob/2c10cad726e92282ba3a8e672890bd91a40160ba/gradle.properties>
