# 开发相关

## 关于数据分析工作的进一步规划

简单的地图可视化，我们已经看到有几个版本了，大致就是以气泡图或者热力图把每个城市的数据可视化出来，包括不限于基于`react`、`php`等语言的，以及想直接做个网站的。

不过在那之前，可能还有更细致的活我们可以做，例如：
1. 以小区为单位，实现可视化，思路：结合城市与小区，对接高德api，基于每个小区的轮廓数据画polygon
2. 以小区为单位，统计开发商信息，思路：搜索城市与小区，看是否有相关的开发商信息，爬虫并汇总数据
3. ……

欢迎大家踊跃贡献思路与代码 ^_^

## 自动验证数据hook脚本

如果会`nodejs`的话，可以运行以下语句，它将自动检查`README.md`文档中的计数问题，您可以根据提示进行逐一人工检查，直到确保准确：

```shell
ts-node analysis/backend/v2-flat/genProperties.ts
```

在`README.md`文档人工校验通过的情况下，该脚本输出：

```text
...
parsing province 吉林省
parsing province 内蒙古自治区
总计25个省份，103个城市，276个楼盘
楼盘合计校验通过！
```

脚本使用提醒：
1. `ts-node` 可以通过 `npm i -g ts-node`安装
2. 脚本需要先初始化：`cd analysis/backend && npm i`
3. 建议直接加入hook脚本，每次commit的时候自动检查：
```shell
echo 'ts-node analysis/backend/v2-flat/genProperties.ts' >> .git/hooks/post-commit
chmod +x .git/hooks/post-commit
```

## 热力图制作

基于https://l7plot.antv.vision/zh/examples/heat/heatmap#traffic-accident：

```js
import { Heatmap } from '@antv/l7plot';

fetch('https://gw.alipayobjects.com/os/antfincdn/OOSGL1vhp3/20200726024229.json')
  .then((response) => response.json())
  .then((data) => {
    let d = {
      type: "FeatureCollection",
      features: []
    }, l = ['湖北省', '江西省', '河南省', '山西省', '湖南省', '辽宁省', '江苏省', '陕西省', '广西壮族自治区', '河北省', '吉林省', '云南省', '广东省', '重庆市', '山东省', '四川省'];
    let q = {
      湖北省: 14,
      江西省: 8,
      河南省: 27,
      山西省: 2,
      湖南省: 10,
      辽宁省: 2,
      江苏省: 4,
      陕西省: 3,
      广西壮族自治区: 2,
      河北省: 1,
      云南省: 2,
      广东省: 2,
      重庆市: 3,
      山东省: 3,
      四川省: 1
    }
    console.log(data)
    data.features.forEach(v => {
      if (l.includes(v.properties.prov)) {
        v.properties.value = q[v.properties.prov]
        d["features"].push(v)
      }
    })
    new Heatmap('container', {
      map: {
        type: 'mapbox',
        style: 'dark',
        center: [127.5671666579043, 7.445038892195569],
        zoom: 2.632456779444394,
        pitch: 45,
      },
      source: {
        data: d,
        parser: {
          type: 'geojson',
        },
      },
      shape: 'heatmap',
      size: {
        field: 'value'
      },
      legend: {
        position: 'bottomleft',
      },
    });
  });
```
 