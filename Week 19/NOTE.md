# 学习笔记 Week 19

## 实现一个线上 Web 服务

### 初始化 server

* 发布系统
  * 线上服务系统：给真正的用户去用
  * 程序员向线上服务系统发布的系统: 可同机部署，可集群
  * 发布工具

### 利用 Express， 编写服务器(一)

* npx express-generator

### 利用 Express， 编写服务器(二)

* 部署到 Ubuntu
  * 启动 SSH (service ssh start; ps -aux | grep ssh)
  * 拷贝开发机上的资源到服务器
    * scp -P 22 -r ./* lz@lz-server:/home/lz/server

### 用 node 启动一个简单的 server

* 利用 publish-server 向真是服务器发布文件

### 编写简单的发送请求功能

* Request 和 Response 都是流

### 简单了解 Node.js 的流

### 改造 server

### 实现多文件发布

* pipe
* Archiver
* unzipper

### 用 GitHub oAuth 做一个登陆实例