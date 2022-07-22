<h1 align="center">MS Template</h1>

<div align="center">
    开箱即用的中台前端/设计解决方案。并且支持多标签和单标签模式。
</div>

<br />

![image](https://user-images.githubusercontent.com/91561865/142795569-6ae1150f-f3de-4857-9833-1f7590a81066.png)


## 快速开始

> PS: 此项目属于探索阶段，在没有发布 `1.0.0` 版本的情况下，任何 `API` 也项目结构都可能会进行重大的调整以及改变。


使用下面命令克隆项目

```sh

# 克隆项目
git clone https://github.com/Web-Lif/ms-template.git

# 安装依赖 
npm run install 

# 启动项目
npm run start 

# 可选， 进行编译 dist 文件
npm run build

# 可选， 检查 eslint
npm run lint:script

# 可选，执行测试测过
npm run test
```


```sh
.
├── babel.config.js
├── jest.config.ts
├── LICENSE
├── package.json
├── package-lock.json
├── README.md
├── src                   
│   ├── app.tsx  
│   ├── components    
│   │   ├── Loading.tsx
│   │   ├── NotFound.tsx
│   │   └── styles
│   │       ├── assets
│   │       │   └── undraw_Taken_re_yn20.svg
│   │       └── notfound.mless
│   ├── layouts
│   │   ├── BasicLayout.tsx
│   │   ├── index.tsx
│   │   └── styles
│   │       └── layout.mless
│   ├── pages
│   │   ├── index.tsx
│   │   ├── User
│   │   │   ├── Login.tsx
│   │   │   └── styles
│   │   │       ├── assets
│   │   │       │   └── LoginBackground.svg
│   │   │       └── login.mless
│   │   └── welcome.tsx
│   ├── typings.d.ts
│   └── utils
└── tsconfig.json
```

项目的大致目录如下

- `pages` 只有在 pages 编写的页面，才能配置成为路由信息
- `layouts` 主要的布局文件
- `components` 项目中自定义的组件信息
- `app.tsx` 留给用户的扩展点，里面都会配置对应的接口和方法

## 配置说明

在项目中 `src/app.tsx` 会有很多导出的函数，这些函数需要使用者进行实现，或则进行修改进行扩展功能


### config

- layout `'side' | 'top'| 'mix'`   菜单的布局方式
- navTheme `'light' | 'dark'`  导航的主题，side 和 mix 模式下是左侧菜单的主题，top 模式下是顶部菜单
- headerTheme  `'light' | 'dark'`  顶部导航的主题，mix 模式生效
- tabs `'single' | 'multi'`  标签页模式 

一些全局的配置信息

### checkLoginStatus

- return `boolean`

检查用户是否登入, `true` 表示用户已经登入， `false` 表示用户已经退出

### requestIgnoreList 

- return `string[]`

如果请求的路径匹配到了返回的结果，表示这个路由是不经过 `layouts` 处理， 也就是用户可以自定自己想要的登入页面。

### requestGlobalData

- return `Promise<GlobalData>`

请求后端接口，返回当期的菜单信息, 以及对应的人员信息


## 多标签页说明

当用户开启多标签页模式的时候，那么就会想子组件传递一个 `tabs` 的属性

`tabs` 有以下信息

- `open` 开启一个新的标签页面
- `close` 关闭一个标签页面
- `active` 激活当前标签页面
- `status` 当期的标签页的状态
- `params` 传入进来的参数信息

> 见 [src/types.ts](./src/types.ts) 里面的 `RouteComponentProps` 的定义


建议采用 `RouteComponentProps` 来定义类型，这样有更好的开发体验


```tsx
import React, { FC, useRef } from 'react'
import { Button } from '@weblif/fast-ui'
import { RouteComponentProps } from '@/types'


const App: FC<RouteComponentProps> = ({
    tabs
}) => {
    const count = useRef<number>(0)
    return  (
        <>
            <Button
                onClick={() => {
                    count.current += 1
                    tabs.active({
                        key: '/',
                        params: {
                            message: `hello, word - ${count.current}`
                        }
                    })
                }}
            >
                点击跳转到首页
            </Button>
            <Button
                onClick={() => {
                    count.current += 1
                    tabs.open({
                        item: {
                            key: `newHome${count.current}`,
                            path: '/',
                            name: 'New Home Tab'
                        },
                        params: {
                            message: `hello, word New - ${count.current} `
                        }
                    })
                }}
            >
                打开新的首页信息
            </Button>
        </>
    )
}

export default App
```
