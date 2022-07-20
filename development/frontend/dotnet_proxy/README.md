# 基于 .NET 的反向代理实现

## Intro

基于 .NET 6 + Yarp 实现的一个简单的反向代理

## 开发

下载安装 .NET 6 SDK (<https://get.dot.net>)，安装好 SDK 以后，在这个目录下执行 `dotnet run` 就可以运行项目了

## 部署

可以使用已有的 docker 镜像进行部署

``` sh
docker run -d --name github-proxy-sample -d 9000:80 weihanli/github-proxy-sample
```

也可以自己 build 镜像部署

``` sh
# 打包镜像
docker build -t github-proxy-sample .
# 运行容器
docker run -d --name github-proxy-sample -d 9000:80 github-proxy-sample
```

不使用 docker 也可以部署，可以参考文档：
<https://docs.microsoft.com/zh-cn/aspnet/core/host-and-deploy/?view=aspnetcore-6.0>

## Demo

- <https://weneedhome.weihanli.xyz>

## References

- <https://dot.net>
- <https://docs.microsoft.com/zh-cn/aspnet/core/host-and-deploy/?view=aspnetcore-6.0>
