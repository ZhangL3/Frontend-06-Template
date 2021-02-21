# 学习笔记 Week 19

## 工具链

### 单元测试工具 Mocha （一)

* 添加 Mocha 测试 （只能用 commonJS 模块）
* mache test.js

### 单元测试工具 Mocha （二)

* 引入 @bBabel/register 实现 ES6 模块测试
* npm install @babel/core @babel/register
* ./node_modules/.bin/mocha --require @babel/register
* 配置 .babelrc
* npm install @babel/preset-evn
* 加入到 package.json scripts
  * scripts 里默认调用 local 包，所以不用加 ./node_modules/.bin

### code coverage

* npm install nyc
* ./node_modules/.bin/nyc ./node_modules/.bin/mocha --require @babel/register