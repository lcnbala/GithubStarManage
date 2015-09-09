# GithubStarManage
在线地址：
http://gsm.lujq.me/

### 为什么写这个项目？

Github是星辰大海，无数项目汇集其中。我们常以Star来标记优秀的repo，而Star数量的增多以及Github自身Star功能的简易已经不能满足我们的需求。本项目调用Github API，管理你的Github Star。
写这个GithubStarManage的初衷就是为了弥补我在使用Github时，Star功能的不足。项目运行于我自己维护的CentOS主机上，后端由Node.js实现，服务器由Express开发，数据库采用NoSQL的代表MongoDB，前端采用的是Angularjs。在MEAN全栈下完全实现了MVC架构，从第一行代码到上线Alpha版本用时20天，也算是自己假期完成的一个小项目。

![][image-1]
![][image-2]
### 项目特性

GithubStarManage具有强大的可定制性，可以对repos进行多种操作如添加Tag、添加描述，当然也可以通过搜索或排序来筛选repos。更多功能仍在开发中，也欢迎各项功能建议，酌情纳入下一版本的开发中。

### 功能

#### 标签

GithubStarManage采用标签对repos进行管理，独有的双标签系统（用户级标签以及项目标签）更方便了对repos的操作。

#### 搜索

GithubStarManage拥有强大的搜索功能，因为前端架构完全采用Angularjs，所有的搜索操作瞬间完成。支持相应属性搜索以及全局搜索。模糊搜索正在开发中。

#### 排序

GithubStarManage支持对各项属性进行排序来筛选repos，所有排序操作均由前端实现，使得速度上取得提升。

#### 图表

GithubStarManage将各项属性以及操作深度整合，实现了一张表展示、操作所有的repos。

### 贡献

本项目代码在GPL协议下开源，项目代码托管在Github。欢迎贡献代码、提交Bug以及issue。如果觉得项目不错，请Star。

### 5分钟部署

+ .安装Nodejs，安装并运行MongoDB
+ .clone本项目，在根目录下运行npm install
+ .运行sudo npm install -g bower
+ .运行bower install
+ .在https://github.com/settings/developers 页面新建一个开发应用，记录key值，并参考本项目配置文件填写回调地址
+ .将key值填入development.js文件中
+ .node server.js

即可在浏览器中访问'http://127.0.0.1:3000' 打开本应用。

#### 本项目给出的线上地址供演示用，因自用需要，版本迭代迅速，不对其中数据保证可用性，数据的导入导出功能仍在开发中。


### 求职

求互联网公司技术岗位，接受全栈，倾向于后端，线上简历在 http://golmic.deercv.com 可以马上入职，欢迎HR联系面试。

[image-1]:	http://ww2.sinaimg.cn/large/a41f74cdjw1euof5qt7b6j211y0lcn01.jpg
[image-2]:	http://ww3.sinaimg.cn/large/a41f74cdjw1euof6bmn00j20xq0hin21.jpg
