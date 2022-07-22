# 设置反向代理服务以优化境内访问列表效果

为了优化境内访问列表的效果，可自行设置反向代理服务。但是，如果单纯把整个github一起反代的话，Microsoft和Google有很大的可能认为你正在进行钓鱼而把网站ban掉。

## 环境要求

- 部署的环境需要能访问这两个域名
    - https://raw.githubusercontent.com
    - https://api.github.com/markdown
- PHP 7.0+
- Nginx

以 php built server 的方式运行
```
php -S 0.0.0.0:80 index.php
```
这种方式不支持 https ，如果需要 https ，要在前面再加一个 TLS 代理。
建议用于只开发测试。

## Demo
https://across.quest/WeNeedHome/
