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
- [x] B002: 确保每张图片都能与楼盘对应，具体见：[validateLocalImages.ts](development/backend/src/supports/validateLocalImages.ts)
- [x] B003: 增加了可视化脚本，具体见：[genMap.ts](development/backend/src/supports/genMap.ts)
- [ ] B004: 实现所有图片按省/市二级分类（目前仍有许多图片未严格分类到城市文件夹内）
- [ ] B005: 实现所有图片按省/市/区三级分类
- [ ] ...

## 前端

- [x] F001: 以城市为单位，实现可视化统计
- [ ] F002: 以小区为单位，实现可视化，思路：结合城市与小区，对接高德api，基于每个小区的轮廓数据画polygon
- [ ] F003: 以小区为单位，统计开发商信息，思路：搜索城市与小区，看是否有相关的开发商信息，爬虫并汇总数据
- [ ] ...
