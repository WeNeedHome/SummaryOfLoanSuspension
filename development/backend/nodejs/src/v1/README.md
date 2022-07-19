# v1 instructions

## 楼盘数据接口

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

## `analyze.ts`

[analyze.ts](src/ v1/analyze.ts) 脚本负责解析 [README.md](../../../README.md)
文档，校验其市、省、国三级的数据合计，生成 [基于楼盘的结构化停贷数据文件](../../data/generated/properties.json)。该脚本已写入 CI，由 WeihanLi 维护。

用法：

```shell
ts-node analyze.ts
```
