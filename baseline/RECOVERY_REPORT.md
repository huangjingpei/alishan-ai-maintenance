# `111.exe` 恢复性逆向报告

分析日期：2026-08-27

## 结论

- 原文件是 NSIS 3.04 Unicode 安装包，不是业务程序本体。
- 安装载荷是 Electron 应用，Electron 版本为 24.8.8，Chromium 版本为 112.0.5615.204。
- 应用标识为 `huoke-radar-app`，版本为 2.9.89，入口为 `dist-protected/main.js`。
- `app.asar` 已完整解包，共恢复 1,940 个文件。
- `dist-protected` 中的 267 个 JavaScript 文件已全部生成反混淆版本，并按 CommonJS/ES Module 类型通过静态语法校验。
- 未执行 `111.exe`、解出的安装程序或 Electron 主程序；本次均为静态分析与解包。

## 样本信息

- 文件：`C:\Users\Administrator\Downloads\111.exe`
- 大小：71,848,015 字节
- SHA-256：`A4A38F3C0CBA1FA2C61A9DB42DE42326BFEABC1343AD136AC0E7AB52E25EE633`
- 产品名称：阿里山AI获客
- 文件版本：2.9.89
- 数字签名：无
- 安装包内部载荷：`$PLUGINSDIR\app-64.7z`

## 输出目录

- `outer`：NSIS 外层解包结果。
- `payload`：`app-64.7z` 解出的完整 Electron 运行目录。
- `recovered`：从 `resources/app.asar` 解出的原始文件，保留原始混淆状态。
- `readable-source`：在 `recovered` 基础上生成的可读版本；后续修改优先从这里开始。
- `webcrack-work`：每个 JavaScript 文件的反混淆中间结果。
- `tools`：分析时使用的独立 7-Zip 工具，不是应用依赖。

## 代码结构

- `dist-protected/main.js`：很小的 Bytenode 加载器，会按 CPU 架构加载 `main.x64.jsc`、`main.arm64.jsc` 或 `main.jsc`。
- `dist-protected/main/*.js`：主进程业务模块，包括认证、数据库、任务、消息中心、更新、代理、监控和自动化运行器。
- `dist-protected/shared/*.js`：主进程与 preload 共用的抖音页面解析、自动化控制、筛选和数据规范化逻辑。
- `dist-protected/automation-preload.js`：浏览器页面注入与 IPC 逻辑，已经成功展开字符串表并格式化。
- `dist-protected/renderer`：前端 HTML、CSS、图片和 ES Module bundle。
- `node_modules/better-sqlite3`：包含与原应用匹配的原生 SQLite 模块，可用于保持数据库兼容性。

## 尚未完全恢复的部分

- 三个 `main*.jsc` 是 V8/Bytenode 字节码，不能像普通 JavaScript 一样直接还原为原始源码。
- 原始变量名、注释、项目目录划分和一方代码的 sourcemap 不在发行包中，自动恢复无法重建这些信息。
- 反混淆已展开字符串并恢复格式，但部分局部变量仍保留 `_0x...` 名称，需要在实际修改涉及的模块内按语义重命名。
- 尚未动态启动样本，因此数据库迁移、网络接口和窗口生命周期还没有做运行时验证。

## 推荐接手方式

1. 先明确要修改的具体功能，根据功能定位到 `main`、`shared` 或 `renderer` 模块。
2. 对涉及模块做进一步语义重命名，并补充最小测试。
3. 如果改动依赖 `main*.jsc` 内的入口逻辑，再针对 Electron 24.8.8 环境做隔离动态分析或重建新的主进程入口。
4. 修改完成后重新打包 `app.asar`，先在隔离测试环境验证，再制作新的安装包。

