# nodejs - backend (V3)

nodejs部分主要负责本项目的数据校验与地图生成。

## release notes

V3 版本抽象出了停贷数据的结构树 [`ITree`](./src/itree/ds.ts)
，在此基础之上实现了 `validate | sort | reshape` 三大功能，这样可以有很强的兼容性。

基于 `ITree`，我们实现的 [`genProperties`](./src/genProperties.ts)
与 [`genMarkdown`](./src/genMarkdown.ts) 两个主函数，已经能够同时读取旧版与新版 readme 文档。

例如 `ts-node genMarkdown.ts -b pronunciation -j README.md -t README.md`
可以实现无脑生成按拼音排序的 readme 文档。

## versions

- [DEPRECIATED: V1](src/v1/README.md)
- [DEPRECIATED: V2](src/v2/README.md)

## core

### `genProperties.ts`

[genProperties.ts](src/genProperties.ts) 可以从 [README.md文档](../../../README.md)
中解析出结构树，并自动校验，然后分别存储成 `tree | flat` 两个版本的停贷楼盘数据。

用法：

```shell
ts-node genProperties.ts
```

输出位置：

- [properties-tree.json](../../../data/generated/properties-tree.json)
- [properties-flat.json](../../../data/generated/properties-flat.json)

### `genMarkdown.ts`

[genMarkdown.ts](src/genMarkdown.ts)
可以对 `ITree` [properties-tree.json](../../../data/generated/properties-tree.json)
自由重组，然后重新生成markdown文件，并且支持与原有的 `README.md` 进行无缝拼接（`-j`
参数），从而生成一份新的 `README.md` 文件。

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

由此可知，我们只需要使用 `ts-node genMarkdown.ts -b pronunciation -j README.md -t README.md` 即可以直接实现覆写 README
的效果，但是请注意，这样的操作是不可逆的，所以必要时要记得备份。

### `validateLocalImages.ts`

[validateLocalImages.ts](src/validateLocalImages.ts)
可以对 [images](../../../images)
目录下的文件的在 [README.md文档](../../../README.md) 内的引用进行核验，以确保没有游离的文件。

用法：

```shell
ts-node validateLocalImages.ts
```

## visualization

### `genCities.ts`

[genCities.ts](src/visualization/genCities.ts)
脚本负责解析 [基于楼盘的结构化数据文件](../../../data/generated/properties.json)
，提供含有经纬度、楼盘合计的[基于城市的结构化停贷数据文件](../../../data/generated/cities-for-visualization.json)
，可供于可视化。该脚本已写入 CI，由 WeihanLi 维护。

用法：

```shell
ts-node genCities.ts
```

### `genMap.ts`

[genMap.ts](src/visualization/genMap.ts)
脚本负责解析 [基于城市的结构化停贷数据文件](../../../data/generated/cities-for-visualization.json)
，对接Google Static Map
API，生成基于城市的全国停贷地图：[基于城市的全国停贷地图（标准主题）](../../../data/generated/visualization-standard.png)
、[基于城市的全国停贷地图（淡色主题）](../../../data/generated/visualization-light.png)
、[基于城市的全国停贷地图（暗色主题）](../../../data/generated/visualization-dark.png)。该脚本已写入 CI，由
WeihanLi 维护。

用法：

```shell
ts-node genMap.ts           # generate standard
ts-node genMap.ts -t light  # generate light from under google theme config directory
ts-node genMap.ts -t dark   # generate dark from under google theme config directory
ts-node genMap.ts -t all    # generate all maps from under google theme config directory
```

## references

- 全国城市经纬度：<https://github.com/boyan01/ChinaRegionDistrict>
-

GoogleMapsApiKey: <https://github.com/webcoiruser/tvc/blob/2c10cad726e92282ba3a8e672890bd91a40160ba/gradle.properties>
