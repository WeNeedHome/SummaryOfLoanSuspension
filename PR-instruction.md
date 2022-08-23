# 如何通过发 PR 为本项目做贡献

鉴于很多人对于 Git 较为生疏，创建一个 `Pull Request` 来为本项目增砖添瓦是较为困难的，这里就写上一篇尽可能通俗易懂的文章来帮助没有技术的人创建 PR 并将你的信息发布到仓库中。

**文末还附上了完全零门槛的提交信息的方法。**

## 概念补充

### 什么是 `fork` ? 为什么需要`fork`?

> GitHub 中 Fork 是服务端的代码仓库克隆（即 新克隆出来的代码仓库在远程服务端），包含了原来的仓库（即 upstream repository，上游仓库）所有内容，如分支、Tag、提交。代码托管服务（如 Github、BitBucket）都提供了方便完成 Fork 操作的功能（在仓库页面点一下 Fork 按钮）。

除非你的账号获得了仓库主的授权，否则你是没有权限来直接编辑该项目中的任何内容的，这时我们可以通过 `fork` 操作将仓库复制一份到自己的 GitHub 账户名下，以便获得完整权限从而对其进行修改。

通过 `fork`，我们可以得到包含完整版本历史的目标仓库的拷贝，之后可以对 `fork` 得到的仓库进行任意操作，此时你所做的任何操作不会影响到原始仓库。

如果你需要将你的修改发送到主仓库中，那么你只需要向主仓库发送一个`拉取请求`即可。

### 什么是拉取请求（`pull request`）?

拉取请求是为团队项目或开源项目做贡献的一种方式。

例如，一个名为`张三`的用户 `fork` 了一个属于`李四`的仓库，然后对自己 `fork` 下来的仓库了一些变更，然后张三想把自己做的修改同步到李四仓库中怎么办呢？

此时张三可以向李四发起一个拉取请求(PR)，不过这个请求能否成功接受取决于接收请求一方是否同意，即李四或李四团队是否同意将张三修改后的文件合并到自己的仓库。

## 操作演示

本次以这个 `SummaryOfLoanSuspension` 仓库为例，演示如何通过发送一个 PR 向该仓库主提交信息。

**观前提醒：如果你还没有肉身翻墙，那么安全起见非必要不建议使用自己的 GitHub 大号来提交 PR，除非你认为被知道实名无所谓话。**

### 第一步 使用 fork 功能复制最新的仓库到自己的账户名下

**如果你之前 fork 过了，那么你每次编辑前最好先将最新的仓库拉取过来再开始编辑**
![图片](https://user-images.githubusercontent.com/108816528/179343700-25c6c1ad-4e17-4043-8d70-f61908325bce.png)

#### 进入该仓库，点击 `fork` 按钮

![图片](https://user-images.githubusercontent.com/108816528/179340181-eb447afe-2e00-43f7-b634-e5ca8cf46699.png)

#### 点击 `create fork` 按钮

![图片](https://user-images.githubusercontent.com/108816528/179340194-e1933546-7166-484d-bcc4-753a4bf5390f.png)

此时你的账号下就有一份对该仓库的完整的拷贝了，你将获得随意修改该仓库的权限

![图片](https://user-images.githubusercontent.com/108816528/179340226-c9c75602-9559-4fa1-81aa-49af9df6773a.png)

### 第二步 修改自己 `fork` 下来的仓库

#### 修改文字

以我这个为例，我想对仓库的主页文字进行修改，将自己知道的烂尾楼停贷通知添加到仓库中让更多人知道，那么你可以点击这里的铅笔按钮来开始你的编辑

![图片](https://user-images.githubusercontent.com/108816528/179340382-b60174bb-f4c1-46d9-9b12-f747465e1573.png)

按照下图说明编辑修改文件，请按照标准格式修改，不要乱改，否则你提交的PR很可能不会被仓库管理员接受

![图片](https://user-images.githubusercontent.com/108816528/179340979-7cc36aac-83d2-49cd-ba0e-6ffaf60a5fb8.png)

如果你需要提交图片又不太懂的话可以在提交PR的时候把图片拖到评论里，热心的管理员大概率会帮助把它你放上去的

#### 上传相关图片等文件

找到`images`文件夹下面的相关地区，点击`Upload files`即可

![图片](https://user-images.githubusercontent.com/108816528/179375562-3fc70969-a656-4db2-915a-a10af0316ffc.png)

### 第三步 创建 commit(提交)

编辑好后在最下方写上关于本次提交的概述

![图片](https://user-images.githubusercontent.com/108816528/179344029-9485ead1-9972-47f2-9ec8-14add58f88ea.png)

### 第四步 创建 PR 合并申请

#### 拉取最新的项目文件

**在创建一个PR之前请再次检查一下，确保此时你的仓库是否是最新的，如果比主仓库落后的话还是要再点击一下`Fetch upstream`按钮以从中央仓库拉取最新的项目文件来保证你的文件可以被正确地合并到中央仓库**

以我这次的操作演示为例，我刚刚对主页文档（`README.md`）做了一些修改，然后在你的仓库的最上方就可以看到提示说你的这个分支比主仓库提前一个提交，落后 3 个提交（`This branch is 1 commit ahead, 3 commits behind WeNeedHome:main.` ）

那么此时我们在创建 PR 之前应该 `Fetch upstream` 一下，（如果没有提示 `xxx commits behind` 的话就不用走这一步

![图片](https://user-images.githubusercontent.com/108816528/179344472-f3c6e0fb-2ca0-4acc-8ca4-ef4c8947daf5.png)

点击那个按钮后看到提示变为 `xxx commits ahead` 的时候就可以创建PR了。

#### 创建与提交PR申请

点击 `Pull requests` -> `New pull request`

![图片](https://user-images.githubusercontent.com/108816528/179344561-2d84c855-1a54-424a-9ba7-bf4f1d1bd9db.png)

点击 `Create pull request`

![图片](https://user-images.githubusercontent.com/108816528/179344578-9d1424e2-4283-4d0c-bd6d-63f9d01739bc.png)

然后写好关于这个 PR 拉取请求的说明，最好在这个评论中放上停贷相关的图片证明以提高可信度，最后点击提交就大功告成了，之后等待管理员审核通过后你提交的修改就可以呈现在中央仓库并让更多人看到了。

![图片](https://user-images.githubusercontent.com/108816528/179375623-fe3e909e-a3ea-4852-89f9-ecc55c1efe03.png)

## 其它可能的相关问题

### 我创建了错误的 commit，如何回滚？

如果你创建了并提交了错误的 commit 在你 fork 下来的仓库的话，一般情况下只能使用 git 命令行将项目克隆到本地然后 reset 并强制 push 来实现回滚了
不会命令行的话也不用着急，删除仓库重新来过也是一种办法。

点击你 fork 后的仓库的菜单栏上的 `Settings` 按钮，翻到最下面，找到 `Delete this repository`，按照提示删除然后照第一步再 fork 一遍即可。

![图片](https://user-images.githubusercontent.com/108816528/179344969-dce03117-f446-419c-9269-2342a854ccce.png)
![图片](https://user-images.githubusercontent.com/108816528/179344974-a361d9a1-3547-41e0-8dcd-daed3d72441d.png)
![图片](https://user-images.githubusercontent.com/108816528/179345019-0da503c7-4775-4478-89c0-7f0367f3514c.png)

## 还是看的不太懂，仍然不会操作，怎么办？

那么这里就再写上一个完全零门槛的为本仓库提交信息的方法：

虽然本项目因种种原因关闭了讨论区功能，但是普通用户仍然还是可以对`拉取请求`即`Pull requests`下面的`PR`发表评论的，可以通过这种方式给仓库管理员传达信息，将你所知道的仓库中没有的停贷信息和相关停贷证明图片发给管理员，管理员看到后大概率会热心地将你要传达的信息手动添加到仓库中。

![图片](https://user-images.githubusercontent.com/108816528/179375525-2d3144e0-46e1-4b06-a307-466159abfc2b.png)

**但是非必要不建议使用该方法提交，因为这样会给仓库管理员添麻烦。**

