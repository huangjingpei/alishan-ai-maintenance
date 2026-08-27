# Tests

这里用于逐步补充纯函数、IPC、数据库迁移和安装升级测试。

在自动化测试建立前，每次提交至少执行：

```powershell
npm run validate
npm run integrity:report
```

运行应用和安装测试必须使用隔离测试环境、测试账号和脱敏数据。
