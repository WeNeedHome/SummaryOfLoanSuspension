# PR 冲突修正

## 前提概要

首先说一下抱歉，为工作考虑，接下来可能就不会过多 focus 在这个项目上了，尽管我觉得还有很多事情可以给大家做，比如把开发商数据、楼盘数据都爬进一个 sql 文件，然后再分发成 markdown 与 csv，这将对大家更有帮助，也算是 SummaryOfLoanSuspension V2.0 了。基于此，还可以有 3.0，4.0……最终便是X.0，到那一天，也许大家想看到的日子终于会来临。

在此之前，由于很多人首先可能没有太多时间了解这个项目，其次可能对 git 也不是很熟悉，或是疏忽，在提交新的楼盘数据时，经常不符合我们的 PR 规范，最常见的就是全国总数没有更新，其次是省份没有更新，再其次就是条目写的有问题，比如中英文混杂或者是预停贷数据（目前我们是想把预停贷分到”其他曝光“章节下）但写在了停贷里。

我的想法是，对于已经提交了正确的图片位置的 pr（对于新手来说已经很不容易了），就不要再打回去让别人重改了，这很影响别人的积极性。我回想起很久以前和同事合作时我的第一个PR就因为多提了几个文件被要求改了很多次，最后我直接不玩了并且记恨了许久……

另外还有一种情况，就是当时用户提交的数据（包括省市国合计）都是正确的，但是我们的主分支之后又更新了，那么当时他提交的数据就 out-of-dated 了……

所以综合来看，无论是自己疏忽还是因为过时，当用户已经提交了较为符合规范的 PR 的时候，我们 Contributor 团队都有责任去手动帮他们修正，以下就附上详细的流程（其实并不难）。

如此，[新手PR指导](./PR-instruction.md)、[本项目PR规范](./CONTRIBUTING.md)、[PR冲突修正](./PR-resolving-conflicts.md) 三部曲已经 cover 了 PR 的绝大部分流程。

## PR冲突修正

以 [#855](https://github.com/WeNeedHome/SummaryOfLoanSuspension/pull/855) 为例：

![picture 2](.imgs/PR-resolving-conflicts-1658144405419-380c19079c39404c63b5cb21a07522e702005879181743c0e9d2390c938863a8.png)  

由于我们的 PR 主要是查看提交的文件变动（而不需要怎么关心别人的代码是如何实现的），因此只需要点击第四个选项 `Files Changed`就行。

在 `Files Change` 页面我们可以看到用户提交的文件与记录整体没有啥毛病，图片已经按要求存放在合适的目录下（即使不太合适，也不要紧），然后链接指向也正确，就是省份和全国合计没跟上。

![picture 3](.imgs/PR-resolving-conflicts-1658144584743-9b7917925b85b1fe8681cfaa26f8c4f34eff6d0df2a42e3089185bf18b88f4c0.png)  

一般来说有两种办法，第一种是点击 ⑦，反馈 `Request Changed`，即需要修正后才能合并，但如果这招有效，我也就不会费脑细胞写这篇指引了。

首先，我们不能直接合并，不然主分支就乱了，主分支每次的合并，我的建议是，一定是数据正确的合并（即能通过我们的 CI 校验，满屏绿！）

![picture 4](.imgs/PR-resolving-conflicts-1658144823145-7e6ec463c801126f3d974ea50dddefc2767c356f3da5c7afecb4341505875888.png)  

所以，我们的办法，就是在分支上面合并，然后拉到本地修改，改好后再与主分支合并，确认无误后再推给主分支。

### 步骤一：合并 PR 到副分支

因此我们要用到 ⑧，点击 ⑧ 的 `Edit` 按钮，然后注意，点击那个 `base:main` 的下拉菜单，然后选择 `branch-for-unqualified-pr`。顾名思义，就是专门解决 pr 冲突的分支。

![picture 5](.imgs/PR-resolving-conflicts-1658144953968-28986ebbf7530e853d2d6ff989b2fdfa1d941ff8f5ad099099d2c8dffbe5116f.png)  

选择确认：

![picture 6](.imgs/PR-resolving-conflicts-1658145078029-ab530f221b56ee75cf807f30711160771489415f1315e078cad710c22de663b2.png)  

成功后会提示已经将分支改成 `branch-for-unqualified-pr` 了。

![picture 7](.imgs/PR-resolving-conflicts-1658145100612-5fad58818042f07858e3edeedb87ef3c56874fc62a68545aac2cbe89ac218848.png)  

这个时候，再 merge 这个 pr，就不会合并到主分支了。

于是，选择 `squash and merge`，意思就是把用户的 commits 压缩成一条然后合并。毕竟很多朋友的 commits 比较乱，压缩后 git 树就会比较干净。

![picture 8](.imgs/PR-resolving-conflicts-1658145193225-2f4d5543939f2c6880f95de256105e53f91af21d155c52a2865e69d9fd0a2fa0.png)  

确保已经没有太大问题了，就可以合并了：

![picture 9](.imgs/PR-resolving-conflicts-1658145371369-f98ef41ead57d6ad2b0c2076a43160a2f0555842f3d6b7edd205a8a4a5cbe9cc.png)  

### 步骤二：设置副分支环境（仅在首次需要）

接着我们就要拉取副分支。

平常我们的开发，应该首先至少有一个 `remotes/origin/main`，就是所谓的 `forked repo`。（我们都是 `fork` 主仓库后再修改，再提交，然后发起合并的）

但为了和主分支交互，我们还需要有一个 `upstream`，也就是我们的 `WeNeedHome/SummaryOfLoanSuspension`。

办法很简单，一行命令搞定，就是把 `upstream` 添加进 `remote` 列表内（已添加过就不用了）

```sh
git remote add upstream https://github.com/WeNeedHome/SummaryOfLoanSuspension
```

检测副分支是否已加入本地 remotes 列表：

```sh
git branch -a
```

![picture 11](.imgs/PR-resolving-conflicts-1658145922458-408f53f203c8b536ba6e0b682be47a34954df20a5f248acbe510c450d5db8510.png)  

:smile:，那个 `update-generated-data` 不用管，是我们的 CI，它的出现一般表示有文件冲突了。由于`branch-for-resolving-unqualified-pr`分支只在修正其他人的PR时才用，所以经常与主分支不同步，从而产生冲突，这个问题不大，改完推上去让它不定时同步好就行了。

添加完成之后，就是和远程同步一下了：

```sh
git fetch upstream
```

你应该会看到类似如下的输出：

![picture 10](.imgs/PR-resolving-conflicts-1658145732722-f0bee80f4c88f50d236d8672b8bbd924838bda992f1567067747086b53bb44a2.png)  

这时候我们应该就有远程最新的 commits 记录了，可以用 `glola`（`glola`是个 alias，建议写入 bash）验证一下：

```sh
# 每个人的 glola 可能具体写法都不一样，这是我定制的效果
git log --graph --pretty='%Cred%h%Creset -%C(auto)%d%Creset %s %Cgreen(%ar) %C(bold blue)<%an>%Creset' --all
```

可以看到第一个就是我们待合并的分支记录了：

![picture 12](.imgs/PR-resolving-conflicts-1658146134870-77111ebc07b23c37a14c9d9b0e331de0d13634c9ffe7a976a03002d57116f830.png)  

### 步骤三：拉取副分支以解决冲突

提示：如果你懒得打这么长的名字（不好意思，我倾向于可读性好的名字，而非短的名字），也可以在输入完 `git pull upstream b` 之后按一下 TAB 键，一般就会自动补全了（前提是 upstream 已经同步好了）。

```sh
git pull upstream branch-for-resolving-unqualified-pr
```

拉完之后可以看到 README.md 有冲突（这是正常的，我们正是要解决这个：

![picture 13](.imgs/PR-resolving-conflicts-1658146515313-8a5669436fe2f2356cf52ac792b33e207565b72e791796f08fe15cbb760c929d.png)  

解决冲突的办法有很多种，每个人都有自己的习惯，我倾向于使用 jetbrains 家的 UI 操作，偶尔也会用纯文本编辑器检查那些杠杠（有冲突的文件一般都是红色， vscode中也是如此）：

![picture 14](.imgs/PR-resolving-conflicts-1658146622111-9405d5e5932e94006cec88685bab590d80ab62d0d8a36c63540bafb36749fd2b.png)  

然后选择“合并”按钮：

![picture 15](.imgs/PR-resolving-conflicts-1658146674968-82d6c9954c8b387f342c05fe499d718fc66d0672fa606fc7f21461cff88f5410.png)  

接着就是来到梦幻冰工厂的时刻：

![picture 16](.imgs/PR-resolving-conflicts-1658146936888-25042f232480d4cce0b574e6ff9a4e6e71e5595054e43512f4241c04abff9ef3.png)  

蓝色的冲突就还好，随便选哪边都差不多，重要的是红色部分的修改，也是我们的目标冲突处：

![picture 17](.imgs/PR-resolving-conflicts-1658147105521-27559124e293d42508f6e5f3e51aa1cdd5a9eb3d4ff82e6e040b704031a5218b.png)  

接收任意一边之后会发现，总数都不对，所以我们在中间那一栏手动加个一：

![picture 18](.imgs/PR-resolving-conflicts-1658147222445-82b5422d561712b29fb115935de7912effbe9d34849998ea70afd295108a26d4.png)  

同时，（显然地），我们要把这个加一也加到全国合计处：

![picture 19](.imgs/PR-resolving-conflicts-1658147321325-46dcdfe0da068d7621268dd5cdc160c30f581c6a590ab4de70aca851bfcc082d.png)  

至此，我们的冲突就已经全部解决好了。

### 步骤四（可选）：程序化验证计数

```sh
cd development/backend
# 没有安装ts-node前要， npm i && npm i -g ts-node
ts-node src/genProperties.ts
```

程序输出结果表示，有三个错误，并且是和上海有关的：

![picture 20](.imgs/PR-resolving-conflicts-1658147508020-38288c0eb76402248d6a30c5b53439e9eb95fcaecbc8f96d213c2ef563c2fef3.png)  

我们回头看一下，原来是因为楼盘之间的分隔符不对（目前程序约定是用`, `英文逗号+空格，而这里是` ,`，所以分隔错误，之所以这么约定有一定的苦衷，是为了能更好的支持在楼盘信息里写入中文逗号相关的内容，这样的约定不一定是未来的标准，但对于我个人格式化与检查文档很有帮助，至少能保证我每次提交的readme都是标准化后的结果）：

![picture 21](.imgs/PR-resolving-conflicts-1658147567640-a8ba18f6f78dba60c105278a68ba377166a85f073e5a83740596f4131b9c98cf.png)  

我们修正后再次运行：

![picture 22](.imgs/PR-resolving-conflicts-1658147726574-35619e9d254e8436e8d970a42aed08b6c70d66c369ef4161eed4f9e7bc6c03b8.png)  

TADA !

### 步骤五（可选）：本地运行一整套 CI 检查

我们云端的 CI 实际要检查的东西可不止 readme 文档的计数，它比如说还包括自动生成按行排布的 readme，以及检查本地图片的索引，我们试着在本地运行一下：

```sh
cd src
ts-node genProperties.ts  # 生成停贷数据（同时生成tree与flat）
ts-node validateLocalImages.ts      # 验证本地图片索引
ts-node genMarkdown.ts  # tree --> 新的readme
```

看吧，竟然还藏着错误呢！原来还有一张图没链接上！

![picture 23](.imgs/PR-resolving-conflicts-1658147946812-cb1cbfb57321e005aaa3a8e0270816d502fa8c3b91b1716b3081752290f644f9.png)  

搜索一下，原来是 `.jpeg` 和 `.jpg`（此处应该还有`狗头.gif`）

![picture 24](.imgs/PR-resolving-conflicts-1658147977094-b1ff2733af6aca336545f35dd359d02be5b5cc62b2a16e0c668703cfe2cb6721.png)  

这点问题，划划水啦~

文档里改成 `.jpg` 就好。

再次运行

```sh
ts-node genProperties.ts  # 生成停贷数据（同时生成tree与flat）
ts-node validateLocalImages.ts      # 验证本地图片索引
ts-node genMarkdown.ts  # tree --> 新的readme
```

![picture 25](.imgs/PR-resolving-conflicts-1658148159185-b8e33bd1e8e0e1774995fcb0835f43ff4fb51720a607d40b10bf6458598ed6e1.png)  

TADA !

### 步骤六：提交并合入

首先先推到自己的仓库：

```
git add -A
git commit
git push origin main
```

如下，冇问题啊：

![picture 26](.imgs/PR-resolving-conflicts-1658148285425-1471334fb7e9464da747b0b40689fc5d9a1960d71a3bec1bf1b4e4b31f479a39.png)  

这个时候就要和主仓库开始交互了，我们先拉取一下最新的，因为主仓库在我们改动本地文件时期，可能已经有人动过了：

```sh
git pull upstream main
```

不过幸运的是，在我们写这篇文章时没有：

![picture 27](.imgs/PR-resolving-conflicts-1658148630231-588abf60f5c164ddad286e2d5a10f16fd2d32001d413efc884e40cf3f2dfa079.png)  

那就，so easy 啦：

```sh
git push upstream main
```

![picture 28](.imgs/PR-resolving-conflicts-1658148658719-a11972919aab4ad6a711f3caf3b8631be22d1c117c532ecaf970ead7b7c60f52.png)  

至此，所有冲突都已经，并且可以保证有效，不放心的还可以去 [Action Page](https://github.com/WeNeedHome/SummaryOfLoanSuspension/actions) 看一看：

![picture 29](.imgs/PR-resolving-conflicts-1658148705693-cb1c721160fd4f423ed8974e1f2fc50a890b0d8d98d03bc34e8cbe4bdfee3516.png)  


## At Last

感谢阅读到最后，不容易！

祝全体早日有房！（其实我自己并没有房，但作为坚定的无产阶级，我必须挺你们，尽管这并不能帮助我降低自己的租金，lol）

（by the way，明天正好是我生日啦，回想起来这两天与 WeNeedHome 的点点滴滴，还是会心潮澎湃，尽管接下来我可能会逐步降低维护的频率了。）

我相信很多人都像最近爆火的那对年轻小夫妻一样，也是曾经心里有海，眼里有光。

所以，快乐是如何消失了的呢。
