# 学习笔记 Week 20 发布系统(二)

## 持续集成

### 发布前检查的相关知识

客户端工程 build 时间长，所以对 build 有一套测试体系

* 最终阶段集成
  * 前面各自开发，最终集成联调
* 持续集成
  * Daily Build
  * build verification test (BVT) 构建的验证测试
    * 冒烟测试
    * end to end test

前端 build 时间短，可以每次提交代码时 build 一次

本节课重点

1. 通过 GitHook 完场检查
2. ESLint
3. Puppeteer 无头浏览器检查

### Git Hook 基本用法

* .git\hooks 下有 bash 可执行文件，去掉 .sample 既启动
  * pre-commit.sample
    * 可改写成 nodejs
  * pre-push.sample

### ESLint 基本用法

* npm install --save-dev eslint
* npx init eslint
* npx eslint ./index.js

### ESLint API 及其高级用法

* 在提交前检查 lint
  * 检查 buffer 版本，而不是 local 版本
    * git stash push -k
    * git stash pop
* Web Hook (服务端)
  * GitLab, GitHub 自己提供的 Hook API

### 使用无头浏览器检查 DOM

* chrome --headless --disable-gpu --enable-logging --dump-dom https://www.google.com/
* chrome --headless --disable-gpu --enable-logging --dump-dom about:blank > tmp.txt

* puppeteer