# Google Static Map Instruction

## 背景

我们其实已经在前端部分实现了一套谷歌地图的渲染。

但前端毕竟有些麻烦，还需要启动服务。

所以我尝试使用后端的办法复现前端的结果。

好在谷歌提供了一种基于API的办法。

也就是 google-static-map-api。

顾名思义，静态地图api，也就是发起一个http请求，返回一张图片。

原本以为这是一个非常直观、好用的工具。

但是后来发现，坑还是不少的。

首先，由于http的限制，不能在报文中一次性发送太多数据，但是绘图往往是很复杂的，比如要渲染上万个点，就需要上万个点的数据喂进去，而每个点就是一个经纬度（至少是float精度）。

实测下来，使用原始经纬度，官方的api顶多几十个点就直接报错了。

因此，必须使用编码的手段，也就是 polyline 算法。

这样每个经纬度就压缩成2-10个ascii码长度了，可以传送更多的数据。

这就是第一个坑。

第二个坑是api的封装比较低级，很多高级的接口都没有（比如：绘制一个圆）。

所以得自己封装实现（基于path）。

## 手动实现polyline算法

具体见 [encodePolyline.ts](algos/encodePolyline.ts)，有时间再更吧。

## 手动实现绘圆算法

由于地球是椭球形，所以直接给定一个经纬度，然后以固定单位的经纬长度画圆，到地图上实际就是个椭圆。

因此，如果想在地图上画出正圆，就需要用到一些三角函数，或者直接用一些专用地理位置信息库。

参考：[python - Get lat/long given current point, distance and bearing - Stack Overflow](https://stackoverflow.com/questions/7222382/get-lat-long-given-current-point-distance-and-bearing/46410871#46410871) 这里给出了多种语言的实现，其中 https://stackoverflow.com/a/51765950/9422455 是js版本。

注意，输入角度单位为度数（不是弧度），距离单位是千米（不是米，也不是经纬度）。
