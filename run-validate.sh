pwd
cd development/backend/nodejs/src || exit
ts-node genPropertiesFromReadme.ts && # 生成停贷数据（同时生成tree与flat）
  ts-node validateLocalImages.ts && # 验证本地图片索引
  ts-node genMdFromPropertiesTree.ts # tree --> 新的readme
