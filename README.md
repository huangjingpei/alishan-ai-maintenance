# 抖多客维护仓库

这是从公司现有 2.9.89 安装包恢复并整理出的可开发仓库。日常开发以本目录为唯一工作基线，不再直接修改 `.reverse_analysis` 下的分析中间文件。

## 当前状态

- Electron 固定为 24.8.8；
- 267 个业务 JavaScript 文件已反混淆并通过语法解析；
- `main.x64.jsc`、`main.arm64.jsc` 和 `main.jsc` 必须保留；
- 当前仍是恢复版发行代码，不是原始 TypeScript/Vite 工程；
- 正式 `appId`、公司图标和代码签名尚未配置；
- `protection-manifest.json` 的运行时强制校验行为仍需在隔离环境确认。
- `npm audit` 当前报告 3 个高危项，其中生产依赖包含 `adm-zip`，Electron 24 本身也已进入高风险旧版本范围；详见安全说明。

## 新员工快速开始

要求：Windows x64、PowerShell 7、Git、Node.js 22.16.0。

```powershell
cd E:\zhibodou-ai\alishan-ai-maintenance
npm install
npm run validate
npm run integrity:report

# 使用隔离数据和 localhost 服务启动开发模式
npm run dev:local
```

`npm install` 会让 electron-builder 为 Electron 24.8.8 准备原生依赖。若 `better-sqlite3` 构建失败，不要随意升级 Electron；先检查 Visual Studio Build Tools、Python 和公司 npm 镜像。

## 命令

```powershell
# 仅做静态校验，不启动程序
npm run validate

# 比较可读代码与原发行 protection-manifest
npm run integrity:report

# 在隔离测试环境启动应用
npm run dev

# 推荐：以 localhost 服务和独立 userData 启动
npm run dev:local

# 运行本地接口契约测试
npm test

# 生成未安装的 Windows 目录，输出到 release/win-unpacked
npm run pack:dir

# 生成 Windows x64 NSIS 安装包
npm run dist:win
```

首次执行 `npm run dev` 必须在测试虚拟机或公司批准的隔离环境中完成，使用测试账号和脱敏数据。

## 修改入口

| 目录 | 内容 |
|---|---|
| `dist-protected/main` | 数据库、网络、任务、消息、更新等主进程业务模块 |
| `dist-protected/shared` | 自动化规则、页面解析、筛选和通用逻辑 |
| `dist-protected/automation-preload.js` | 页面注入和 IPC 桥接 |
| `dist-protected/renderer` | 应用 UI 的 HTML、CSS 和 ES Module bundle |
| `electron-builder.yml` | electron-builder/NSIS 主配置 |
| `packaging` | 正式图标和其他发布资源 |
| `scripts` | 静态校验和完整性差异报告 |
| `local-services` | 仅供未打包开发态使用的 localhost 接口、兼容运行配置与校验器 |
| `docs` | 构建、维护和新员工文档 |
| `baseline` | 原始恢复报告和不可变基线信息 |

## 重要限制

1. 不要删除或编辑三个 `.jsc` 文件。
2. 不要把 Electron 从 24.8.8 升到其他版本后直接运行现有 `.jsc`。
3. renderer 中带哈希的文件名暂时保持不变。
4. IPC channel 的主进程、preload 和 renderer 调用必须同步。
5. 数据库修改必须使用幂等迁移并先备份测试数据。
6. 认证、完整性机制、代码签名和安装器身份不得由新人单独修改。
7. 正式发布前必须替换根目录 `electron-builder.yml` 中的占位 `appId`。

## 文档阅读顺序

1. [`baseline/RECOVERY_REPORT.md`](baseline/RECOVERY_REPORT.md)
2. [`docs/JSC文件影响与进一步逆向方案.md`](docs/JSC文件影响与进一步逆向方案.md)
3. [`docs/01_恢复版编译与打包指南.md`](docs/01_恢复版编译与打包指南.md)
4. [`docs/02_新员工维护与二次开发手册.md`](docs/02_新员工维护与二次开发手册.md)
5. [`docs/安全风险与版本升级约束.md`](docs/安全风险与版本升级约束.md)
6. [`docs/03_本地开发模式与接口契约.md`](docs/03_本地开发模式与接口契约.md)

## 正式发布前阻塞项

- 确认原产品正式 `appId`/升级标识；
- 把公司 `.ico` 放入 `packaging/build/icon.ico` 并启用配置；
- 配置 Windows 代码签名证书；
- 在隔离环境验证 `.jsc`、完整性清单和所有关键功能；
- 完成全新安装、覆盖升级、数据库迁移、卸载和回滚测试；
- 保存安装包 SHA-256、Git commit、签名和审批记录。
