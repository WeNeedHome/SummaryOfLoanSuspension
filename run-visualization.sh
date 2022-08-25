cd development/backend/nodejs/src/visualization || exit
ts-node genCities.ts &&     # flat --> 城市数据
ts-node genMap.ts -t all    # 城市数据 --> 地图