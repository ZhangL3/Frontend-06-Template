# 学习笔记 Week 17 工具链

## 初始化与构建

### 初始化工具 Yeoman (一)

* Getting started

### 初始化工具 Yeoman (二)

* User Interactions - prompt
* Interacting with the file system - template
* Managing Dependencies - pkgJson

### 初始化工具 Yeoman (三)

* 初始化包，通过 prompt 获取用户信息
* 编辑要传给目标的 package.json 文件
* 利用 fs.extendJSON 复制 package.json 文件
* 利用 npmInstall 安装 dependency
* 利用 fs.copyTpl 拷贝静态文件到目标

### Webpack 基本知识

* 作用：把 js 文件集结成一个文件，因为最初为 Node.js 设计，所以不能依据 HTML 进行打包，因此打包后的 js 文件要手动引入到 HTML 里
* webpack.config.js
  * entry: 入口文件
  * rules.loader: 对特定文件格式用响应 loader 进行解析
  * plugins: 独立的功能

### Babel 基本知识

* 作用：把 js 转成 ES5 方法
* 配置文件: .babelrc
  * preset： 配置预设集
* 更多的用作 babel-loader
  * 要在 Webpack 里配置 babel