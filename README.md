# todo-mvp

纯前端 TODO 单页应用：Vite + React 18 + TypeScript，数据保存在浏览器 localStorage（键 `todo-mvp:items`），无后端。

## 功能
新增、完成/取消完成、双击编辑（Enter/失焦保存，Esc 取消，保存为空则删除）、删除、筛选（URL hash：`#/all`、`#/active`、`#/completed`）、全部标记完成/未完成、清除已完成、剩余计数、空状态提示。

## 命令
```sh
npm ci            # 安装（依赖版本已锁定）
npm run dev       # 开发服务器
npm run lint      # 类型检查（tsc --noEmit）
npm test          # 运行测试（vitest run，一次性）
npm run build     # 生产构建，产物在 dist/（相对路径）
npm run preview   # 预览构建产物
.loopforge/verify # 依次执行 npm ci / lint / test / build
```
