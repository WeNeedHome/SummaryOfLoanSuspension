# 前端

## TODO

- [x] feature001: 以城市为单位，实现可视化统计
- [ ] feature002: 以小区为单位，实现可视化，思路：结合城市与小区，对接高德api，基于每个小区的轮廓数据画polygon
- [ ] feature003: 以小区为单位，统计开发商信息，思路：搜索城市与小区，看是否有相关的开发商信息，爬虫并汇总数据
- [ ] ...

## 解决方案列表

> 以下解决方案基本解决了 feature001
> 

### 基于 react + google-map-api

由markshawn2020维护，基于`react`、`backend`的数据结构、`google-map-api`，见 [frontend/react](./react)

### 基于 nginx + php

由NishizakiHayato维护，基于nginx+php，见 [frontend/php_proxy](./php_proxy)

### 单页面可视化

由UAreSky维护，基于`html`实现的单页面可视化，见 [frontend/single-page](./single-page)

### 基于antv的热力图制作

由RowlingJoe维护，基于antv，见： [热力图 by RowlingJoe · Pull Request #55 · WeNeedHome/SummaryOfLoanSuspension](https://github.com/WeNeedHome/SummaryOfLoanSuspension/pull/55)
