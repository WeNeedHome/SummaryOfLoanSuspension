# 前端

## 方案一：react + google-map-api

`frontend/react`：基于`backend`的数据结构与`google-map-api`实现，语言为`typescript`，由markshawn2020维护

## 方案二：nginx + php

`frontend/php_proxy`: 基于nginx+php，由NishizakiHayato维护

## 方案三：单页面可视化

`frontend/singele-page`：基于`html`实现的单页面可视化，由UAreSky维护

## 方案四：热力图制作

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
 