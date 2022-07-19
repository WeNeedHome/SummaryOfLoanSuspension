# python - backend

## problems

- [ ] 程序中只检测新房可能是不够稳健的，刚核实一个楼盘时发现不属于房天下的新房分类，而是二手房：https://gz.newhouse.fang.com/house/s/a9%BA%A3%C9%CF%C3%F7%D4%C2/?refer=sy_seach ，参见：[recover vanke lunasea by vk20220 · Pull Request #769 · WeNeedHome/SummaryOfLoanSuspension](https://github.com/WeNeedHome/SummaryOfLoanSuspension/pull/769)

## features

- [ ] 增加楼盘价格的接口，用于统计与估算事件影响度，参见：[统计涉及人数 & 总金额？ · Discussion #888 · WeNeedHome/SummaryOfLoanSuspension](https://github.com/WeNeedHome/SummaryOfLoanSuspension/discussions/888)

## objective

本项目主要是基于爬虫获取开发商、楼盘等数据，从而对接停贷数据，获得更丰富的数据维度。

- [x] 基于城市+楼盘名获得楼盘基本数据
- [x] 基于楼盘基本数据获得开发商信息
- [ ] 基于开发商信息获得更多的楼盘信息

## web api

本项目数据主要基于房天下，起源于[#814](https://github.com/WeNeedHome/SummaryOfLoanSuspension/pull/814)。

1. 搜索楼盘得到楼盘的id，这个只有 html 版，配合网页解析即可：https://{城市拼音}.newhouse.fang.com/house/s/a9{待搜索楼盘}

2. 根据楼盘id得到楼盘详细的json信息，是点击楼盘主页里的地图链接后跳转抓包得到的，里面不仅有地址（`baidu_coord_x/y`）参数，还有非常多的其他参数，目测用这个就够了，是目前的主力接口：https://sh.newhouse.fang.com/loupan/1210125944/house/ajax/fixtiousPhoneGet/?newcode=1210125944 （后面的query不能省略）

3. 根据楼盘id得到楼盘周边相关的json信息，和上者一起抓到的，信息也有不少，但貌似暂时不需要：https://ditu.fang.com/?c=channel&a=ajaxXiaoquMapSearch&x1=121.7006607055664&y1=31.402236938476562&distance=2&strNewCode=1210125944&city=sh

4. 根据开发商搜索得到开发商的所有楼盘信息，https://fang.com/quanwangso/ajax/search.html?keyword=恒大&cityname=上海&num=1000，（暂未用上，是下一步规划）

## data interface

1. [fang.com 所有分类请求接口](./src/fang/fang-page.yml)
2. [fang.com 楼盘详情数据接口的PY声明](./src/fang/idb_property.py)
3. [fang.com 楼盘详情数据接口的一份样本](../../../data/generated/detailed/北京/上东郡.json)

## usage

### init

```shell
pip install -r requirements.txt
```

### demo

```shell
# c: city（城市中文名）, p: property(楼盘中文名)
python main.py fetch-detail -c 北京 -p 上东郡
# detailed file outputs to:
# /data/generated/detailed/北京/上东郡.json
```

output: 

```text
(venv) 2022/07/19 10:57:23 ➜  src git:(main) ✗ python main.py fetch-detail -c 北京 -p 上东郡 
2022-07-19 10:58:47,945 - root - INFO - running fetch-detail
2022-07-19 10:58:47,945 - root - INFO - fetching property id of bj-上东郡
2022-07-19 10:58:53,426 - root - INFO - requesting: https://bj.newhouse.fang.com/loupan/1010123441/house/ajax/fixtiousPhoneGet/?newcode=1010123441
2022-07-19 10:58:53,492 - root - INFO - inserting property detail of id 1010123441 into fang-detail
2022-07-19 10:58:53,495 - root - WARNING - duplicated
2022-07-19 10:58:53,496 - root - INFO - dumped data into file:///Users/mark/coding/WebstormProjects/SummaryOfLoanSuspension/data/generated/detailed/北京/上东郡.json
2022-07-19 10:58:53,496 - root - INFO - 开发商：北京大成昌润置业有限公司
```

### test

```shell
cd src
python -m unittest ./tests/test_search_property_by_city.py
```

output:

```text
(venv) 2022/07/19 11:01:33 ➜  src git:(main) ✗ python -m unittest ./tests/test_search_property_by_city.py
2022-07-19 11:02:30,540 - root - INFO - requesting: https://sh.newhouse.fang.com/loupan/1210125944/house/ajax/fixtiousPhoneGet/?newcode=1210125944
2022-07-19 11:02:30,609 - root - INFO - inserting property detail of id 1210125944 into fang-detail
2022-07-19 11:02:30,625 - root - WARNING - duplicated
2022-07-19 11:02:30,625 - root - INFO - searching in the db... property name: 恒大名都, city name: 广州
2022-07-19 11:02:30,627 - root - INFO - searching in the db... property name: 泰禾大城小院, city name: 上海
2022-07-19 11:02:30,628 - root - INFO - requesting: https://sh.newhouse.fang.com/loupan/1210125944/house/ajax/fixtiousPhoneGet/?newcode=1210125944
2022-07-19 11:02:30,688 - root - INFO - inserting property detail of id 1210125944 into fang-detail
2022-07-19 11:02:30,689 - root - WARNING - duplicated
2022-07-19 11:02:30,689 - root - INFO - searching in the db... property name: 恒大名都, city name: 广州
.2022-07-19 11:02:30,690 - root - INFO - fetching property id of 上海-泰禾大城小院
2022-07-19 11:02:31,094 - root - INFO - fetching property id of 广州-恒大名都
----------------------------------------------------------------------
Ran 3 tests in 5.905s

OK
```

Use it well.
