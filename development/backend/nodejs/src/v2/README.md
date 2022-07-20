# nodejs - backend

nodejs部分主要负责本项目的数据校验与地图生成。

## versions

- [DEPRECIATED: V1](src/v1/README.md)

## interface

- [三级行政区数据接口](src/ds/region.ts)
- [停贷楼盘数据接口](src/ds/property.ts)
- [城市可视化数据接口](../../frontend/react/src/visualization/ds.ts)

## core

### 开发商、楼盘等数据网络接口

该接口能搜索获得开发商数据（尽管有点瑕疵）：`https://fang.com/quanwangso/ajax/search.html?keyword=恒大&cityname=上海&num=1000`

另外该网站还可基于楼盘搜索到开发商，这需要写一整套爬虫流程，感兴趣的朋友可以实现一下，属于 [TODO](../../../TODO.md) 中的 `B001` 需求。

该接口由 richardo876
提供，具体见：[#814 建议新增分开发商数据,给开放商压力,让购房者注意规避](https://github.com/WeNeedHome/SummaryOfLoanSuspension/pull/814)

### `genProperties.ts`

[genProperties.ts](src/genProperties.ts) 可以从 [README.md文档](../../../README.md) 中解析出 **树状的**
停贷数据并存储，这相对于原先的 [analyze.ts](src/v1/analyze.ts) 脚本来说有诸多好处。

首先，原先的 `analyze.ts`
脚本没有输出任何的中间结构，尽管它也基于局部组合实现了对省份的拼音排序，但是由于其没有构建树状结构，而是线性结构，导致其无法实现任意级别的序列重组。而 `genProperties.ts`
则吸收了 `analyze.ts` 中的所有精华设计部分，并专注于输出树状结构，对于 `markdown` 重写等功能则留给其他脚本接续完成。

用法：

```shell
ts-node genProperties.ts
```

输出位置： [properties-tree.json](../../../data/generated/properties-tree.json)。

### `genMdFromProperties.ts`

[genMarkdown.ts](src/genMarkdown.ts)
可以对 [properties-tree.json](../../../data/generated/properties-tree.json)
结构树的基础上，进行自由重组，然后重新生成markdown文件，并且支持与原有的 `README.md` 进行无缝拼接（`-j`参数），从而生成一份新的 `README.md` 文件。

用法：

```shell
ts-node genMarkdown.ts -h # 查看使用说明

# 默认按拼音增序进行三级排序（一直排到项目级别）（排头兵：安徽-合肥-恒大……），并输出到`README-by-lines.md`文件（纯省份文件）
ts-node genMarkdown.ts                
        
# 按数量减序进行二级排序（一直排到城市级别）（排头兵：河南-郑州），并输出到`README-by-lines.md`文件
ts-node genMarkdown.ts -b count -d 2  

# 修改输出文件地址，:waring: 注意，如果修改为本工程的 README.md 文档，将直接覆盖！
ts-node genMarkdown.ts -t /tmp/README.md 

# 与 readme 文档合并输出完整的 README 文档
ts-node genMarkdown.ts -j
```

由此可知，我们只需要使用 `ts-node genMarkdown.ts -j -t ../../README.md` 即可以直接实现覆写 README
的效果，但是请注意，这样的操作是不可逆的，所以必要时要记得备份。

### `validateLocalImages.ts`

[validateLocalImages.ts](src/validateLocalImages.ts) 可以对 [images](../../../images)
目录下的文件的在 [README.md文档](../../../README.md) 内的引用进行核验，以确保没有游离的文件。

用法：

```shell
ts-node validateLocalImages.ts
```

## visualization

### `genCities.ts`

[genCities.ts](src/visualization/genCities.ts)
脚本负责解析 [基于楼盘的结构化数据文件](../../../data/generated/properties.json)
，提供含有经纬度、楼盘合计的[基于城市的结构化停贷数据文件](../../../data/generated/cities-for-visualization.json)，可供于可视化。该脚本已写入 CI，由 WeihanLi 维护。

用法：

```shell
ts-node genCities.ts
```

### `genMap.ts`

[genMap.ts](src/visualization/genMap.ts)
脚本负责解析 [基于城市的结构化停贷数据文件](../../../data/generated/cities-for-visualization.json)
，对接Google Static Map API，生成基于城市的全国停贷地图：[基于城市的全国停贷地图（标准主题）](../../../data/generated/visualization-standard.png)
、[基于城市的全国停贷地图（淡色主题）](../../../data/generated/visualization-light.png)
、[基于城市的全国停贷地图（暗色主题）](../../../data/generated/visualization-dark.png)。该脚本已写入 CI，由 WeihanLi 维护。

用法：

```shell
ts-node src/genMap.ts           # generate standard
ts-node src/genMap.ts -t light  # generate light from under google theme config directory
ts-node src/genMap.ts -t dark   # generate dark from under google theme config directory
ts-node src/genMap.ts -t all    # generate all maps from under google theme config directory
```

## references

- 全国城市经纬度：<https://github.com/boyan01/ChinaRegionDistrict>
- GoogleMapsApiKey: <https://github.com/webcoiruser/tvc/blob/2c10cad726e92282ba3a8e672890bd91a40160ba/gradle.properties>
