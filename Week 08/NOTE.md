# 学习笔记 Week 8

## 浏览器显示 HTML 过程

URL =HTML=> HTML =parse=> DOM =css computin=> DOM with CSS =layout=> DOM with position =render=> Bitmap

## 有限状态机(finite-state machine)

* 每一个状态都是一个机器
  * 在每一个机器里，我们可以做计算，储存，输出。。。
  * 所有的这些机器接收的输入是一致的。要是 Number 就都是 Number
  * 状态机的每个机器本身没有状态，如果我们用函数来表示的话，他应该是纯函数（无副作用）
* 每一个机器知道下一个状态
  * 每个机器都有确定的下一个状态（Moore）
  * 每个状态机格局输入决定下一个状态（Mealy）

## HTTP 协议

### ISO-OSI 七层网络模型

||||
|-|-|-|
|应用|HTTP|require('http')|
|表示|||
|会话|||
|传输|TCP||
|网络|Internet||
|数据链路|4G/5G/Wi-Fi|require('net')|
|物理层|||

## TCP 与 IP 基础知识

* 流 (没有单位，只保证前后顺序是正确的)
* 端口 (网卡根据端口，把接到的数据包分给各个应用)
* require('net); (node.js)
* 包
* IP 地址
* libnet(构造 IP 包并且发送) / libpcap(从网卡抓 IP 包) (node.js c++底层库)

## HTTP Protocol

* Request
  * POST/HTTP/0.1 (Request line: Method/path/http version)
  * Host:126.0.0.1 (headers 多行，到空行前)
  * Content-Type: application/x-www-form-urlencoded
  * 空行
  * field0=aaa&code=x%3D1 (body, \r\n 换行符)
* Response (一对一关系)
  * HTTP/1.1 200 OK (statusl line: Version/status code/ status text)
  * Content-Type: text/html (headers 多行，到空行前)
  * Date: Mon, 23 Dec 2019 06:46:19 GMT
  * Connection: keep-alive
  * Transfer-Encoding: chunked (node.js 默认格式)
  * 空行
  * 26 (16进制数字)
  * \<html>\<body> Hello World </body></html>
  * 0 (标志内容的结束)

### 实现一个 HTTP 请求

#### 第一步 HTTP 请求总结

* 设计一个 HTTP 请求的类
* content type 是一个必要字段，要有默认值
* body 是 kv 格式
* 不同的 content-type 影响 body 的格式
* 最后根据 bodyText 给出 content-length 字段

#### 第二步 send 函数总结

* 在 Request 的构造器中收集必要的信息
* 设计一个 send 函数， 把请求真实发送到服务器
* send 函数应该是异步的，所以返回 Promise

#### 第三步 发送请求

* 设计支持已有的 connection 或者自己新建 connection
* 收到数据传给 parser
* 根据 parser 的状态 resove Promise

#### 第四步 ResponseParser 总结

* Response 必须分段构造，所以我们要用一个 ResponseParser 来“装配“
* ResponseParser 分段处理 ResponseText，我们用状态机来分析文本结构

