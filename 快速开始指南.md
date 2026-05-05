# 快速开始指南

## 安装步骤

1. **安装依赖**
   ```bash
   npm install
   ```

2. **启动开发服务器**
   ```bash
   npm run dev
   ```

3. **访问应用**
   浏览器会自动打开 `http://localhost:3000`

## 技术演示说明

项目包含4种富文本对比技术的演示：

### 1. diff-match-patch
- 点击"加载示例"查看演示
- 支持实时文本对比
- 显示详细的差异统计

### 2. diff2html
- 美观的并排对比视图
- 支持代码高亮
- Git diff 格式展示

### 3. Monaco Editor
- 专业的代码编辑器体验
- 支持语法高亮
- 滚动同步功能

### 4. 自定义 HTML Diff
- 专门针对 HTML 内容优化
- 可自定义样式
- 保留 HTML 结构

## 常见问题

### Monaco Editor 加载慢
Monaco Editor 体积较大，首次加载可能需要几秒钟，这是正常现象。

### diff2html 样式不显示
确保已安装 `diff2html` 依赖，如果样式未加载，检查浏览器控制台错误信息。

### 构建错误
如果遇到构建错误，尝试：
```bash
rm -rf node_modules
npm install
```

## 下一步

- 查看 `README.md` 了解详细的技术说明
- 修改组件代码进行自定义
- 添加更多对比算法和功能

