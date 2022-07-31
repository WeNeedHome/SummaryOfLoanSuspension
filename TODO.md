# TODO

## 协同

- [x] C001: 完善PR文档，让新手知道如何提交项目信息，具体见：[PR-instruction.md](./PR-instruction.md)
- [ ] C002: 增加PR模板，让用户在PR时能按照约定进行（尚未完成），具体见：[CONTRIBUTING.md](./CONTRIBUTING.md)
- [x] C003: 考虑是否要按行显示楼盘，具体见：[#786: Propose 修改数据展示的结构](https://github.com/WeNeedHome/SummaryOfLoanSuspension/pull/786)。已实现，见：commit@1f42bf121a2634baee6114f446ec70cab86f273d，但尚未确认将分行 README 作为主版本
- [ ] C004: 增加版本自动计数器
- [ ] C005: 建议打开 issue
- [ ] ...

## 后端

- [ ] B001:基于楼盘数据，查找开发商，生成停贷开发商数据（issue: 2022/07/18）
- [x] B002: 确保每张图片都能与楼盘对应，具体见：[validateLocalImages.ts](development/backend/nodejs/src/validateLocalImages.ts)
- [x] B003: 增加了可视化脚本，具体见：[genMap.ts](development/backend/nodejs/src/visualization/genMap.ts)
- [x] B004: 实现所有图片按省/市二级分类（目前仍有许多图片未严格分类到城市文件夹内）
- [x] B005: 实现所有图片按省/市/区三级分类
- [ ] B006: OCR提取银行等相关信息，见 [#840](https://github.com/WeNeedHome/SummaryOfLoanSuspension/discussions/840)
- [x] B007: 因为[#911](https://github.com/WeNeedHome/SummaryOfLoanSuspension/discussions/911)，实现了添加水印
- [ ] ...

## 前端

- [x] F001: 以城市为单位，实现可视化统计
- [ ] F002: 以楼盘为单位，实现可视化，思路：结合城市与小区，对接开源的地图库，例如：[Leaflet](https://github.com/Leaflet/Leaflet) 或者其他，基于每个小区的轮廓数据画polygon
- [ ] F003: 以小区为单位，统计开发商信息，思路：搜索城市与小区，看是否有相关的开发商信息，爬虫并汇总数据
- [ ] F004: 对没有来源的楼盘数据做特殊标识，见：https://github.com/WeNeedHome/SummaryOfLoanSuspension/discussions/860#discussioncomment-3180057
- [ ] ...
