# 富文本对比技术演示项目

这是一个基于 Vue 3 + Vite 的富文本对比技术演示项目，展示了多种成熟的富文本对比前端技术方案。

## 技术栈

- **Vue 3** - 使用 Composition API 和 `<script setup>` 语法糖
- **Vite** - 快速的前端构建工具
- **diff-match-patch** - Google 开源的文本差异算法库
- **diff2html** - 强大的 diff 可视化库
- **Monaco Editor** - VS Code 编辑器核心，支持 diff 模式
- **jsdiff** - 功能强大的 JavaScript 文本差异库
- **fast-diff** - 高性能的文本差异算法库
- **htmldiff-js** - 专门为 HTML 内容设计的差异对比库
- **jsondiffpatch** - JSON 对象深度差异对比库

## 项目结构

```
rich-text-diff-demo/
├── src/
│   ├── components/
│   │   ├── DiffMatchPatchDemo.vue    # diff-match-patch 演示
│   │   ├── Diff2HtmlDemo.vue         # diff2html 演示
│   │   ├── MonacoDiffDemo.vue        # Monaco Editor diff 演示
│   │   ├── CustomHtmlDiffDemo.vue    # 自定义 HTML diff 演示
│   │   ├── JsDiffDemo.vue            # jsdiff 演示
│   │   ├── FastDiffDemo.vue          # fast-diff 演示
│   │   ├── HtmlDiffJsDemo.vue        # htmldiff-js 演示
│   │   └── JsonDiffPatchDemo.vue     # jsondiffpatch 演示
│   ├── App.vue                       # 主应用组件
│   ├── main.js                       # 入口文件
│   └── style.css                     # 全局样式
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## 安装与运行

### 安装依赖

```bash
npm install
# 或
pnpm install
# 或
yarn install
```

### 启动开发服务器

```bash
npm run dev
```

项目将在 `http://localhost:3000` 启动。

### 构建生产版本

```bash
npm run build
```

### 预览生产构建

```bash
npm run preview
```

## 技术方案说明

### 1. diff-match-patch

**特点：**
- Google 开源的成熟算法库
- 支持字符级、词级、行级对比
- 性能优秀，算法稳定
- 适合纯文本对比场景

**适用场景：**
- 纯文本内容对比
- 需要精确的差异定位
- 对性能要求较高的场景

**使用示例：**
```javascript
import { diff_match_patch } from 'diff-match-patch'

const dmp = new diff_match_patch()
const diffs = dmp.diff_main(text1, text2)
dmp.diff_cleanupSemantic(diffs)
```

### 2. diff2html

**特点：**
- 将 Git diff 格式转换为美观的 HTML
- 支持行级和词级高亮
- 提供丰富的配置选项和主题
- 支持并排和统一视图

**适用场景：**
- 代码差异展示
- 文档变更对比
- 需要美观的可视化效果

**使用示例：**
```javascript
import { Diff2Html } from 'diff2html'
import 'diff2html/bundles/css/diff2html.min.css'

const diffJson = Diff2Html.parse(unifiedDiff)
const html = Diff2Html.html(diffJson, {
  outputFormat: 'side-by-side'
})
```

### 3. Monaco Editor Diff

**特点：**
- VS Code 使用的编辑器核心
- 内置强大的 diff 功能
- 支持语法高亮、行号、滚动同步
- 提供专业的编辑器体验

**适用场景：**
- 代码对比
- 需要专业编辑器体验的场景
- 大型文件对比

**使用示例：**
```javascript
import * as monaco from 'monaco-editor'

const diffEditor = monaco.editor.createDiffEditor(container, {
  renderSideBySide: true
})

diffEditor.setModel({
  original: monaco.editor.createModel(oldText, 'text/plain'),
  modified: monaco.editor.createModel(newText, 'text/plain')
})
```

### 4. 自定义 HTML Diff

**特点：**
- 基于 diff-match-patch 实现
- 专门针对 HTML 内容优化
- 可完全自定义样式和交互
- 适合需要完全控制的场景

**适用场景：**
- 富文本 HTML 内容对比
- 需要自定义展示效果
- 特殊业务需求

### 5. jsdiff

**特点：**
- 功能强大的 JavaScript 文本差异库
- 支持多种对比模式（字符、词、行、句子）
- 提供丰富的 API 和配置选项
- 可以处理 HTML 内容对比

**适用场景：**
- 需要多种对比粒度的场景
- 文本和代码对比
- HTML 内容对比

**使用示例：**
```javascript
import { diffWords, diffChars, diffLines } from 'diff'

const diffs = diffWords(text1, text2)
```

### 6. fast-diff

**特点：**
- 高性能的文本差异算法库
- 专注于速度和效率
- 适合处理大量文本对比
- 支持字符级和词级对比

**适用场景：**
- 大量文本对比场景
- 对性能要求较高的应用
- 实时文本对比

**使用示例：**
```javascript
import diff from 'fast-diff'

const diffs = diff(text1, text2)
```

### 7. htmldiff-js

**特点：**
- 专门为 HTML 内容设计的差异对比库
- 能够智能识别 HTML 结构
- 保留标签完整性
- 提供更准确的 HTML 差异展示

**适用场景：**
- 富文本 HTML 内容对比
- 需要保留 HTML 结构的场景
- 文档版本对比

**使用示例：**
```javascript
import htmldiff from 'htmldiff-js'

const diff = htmldiff(html1, html2)
```

### 8. jsondiffpatch

**特点：**
- 强大的 JSON 对象差异对比库
- 支持深度对象对比
- 可以将差异转换为可视化 HTML
- 适合结构化数据对比

**适用场景：**
- JSON 对象对比
- 结构化数据对比
- HTML DOM 结构对比
- 配置文件和数据结构对比

**使用示例：**
```javascript
import jsondiffpatch from 'jsondiffpatch'

const delta = jsondiffpatch.diff(obj1, obj2)
const html = jsondiffpatch.formatters.html.format(delta, obj1)
```

## 技术对比

| 特性 | diff-match-patch | diff2html | Monaco Editor | 自定义 HTML Diff | jsdiff | fast-diff | htmldiff-js | jsondiffpatch |
|------|-----------------|-----------|--------------|-----------------|--------|-----------|-------------|---------------|
| 纯文本对比 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ⚠️ | ⚠️ |
| HTML 对比 | ⚠️ | ⚠️ | ⚠️ | ✅ | ✅ | ✅ | ✅ | ✅ |
| JSON/对象对比 | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| 可视化效果 | 基础 | 优秀 | 专业 | 可定制 | 良好 | 基础 | 良好 | 优秀 |
| 性能 | 优秀 | 良好 | 良好 | 优秀 | 良好 | 优秀 | 良好 | 良好 |
| 代码体积 | 小 | 中等 | 大 | 小 | 小 | 很小 | 小 | 中等 |
| 学习成本 | 低 | 中 | 中 | 中 | 低 | 低 | 低 | 中 |
| 定制性 | 中 | 中 | 低 | 高 | 高 | 中 | 中 | 中 |
| HTML结构保留 | ❌ | ❌ | ❌ | ⚠️ | ❌ | ❌ | ✅ | ✅ |

## 开发说明

### 组件结构

所有演示组件都使用 Vue 3 的 Composition API 和 `<script setup>` 语法糖：

```vue
<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const text = ref('')

onMounted(() => {
  // 初始化逻辑
})

onBeforeUnmount(() => {
  // 清理逻辑
})
</script>
```

### 样式说明

- 使用全局样式文件 `style.css` 定义通用样式
- 组件内使用 `<style scoped>` 定义组件特定样式
- 支持响应式布局，适配移动端

## 注意事项

1. **Monaco Editor** 体积较大，首次加载可能较慢
2. **diff2html** 需要 Git diff 格式的输入，需要转换
3. **HTML 对比** 需要特殊处理，纯文本算法可能无法完美处理 HTML 结构
4. 对于大型文件，建议使用虚拟滚动或分页加载

## 扩展建议

1. 可以添加更多对比算法（如 Myers 算法）
2. 可以集成更多编辑器（如 CodeMirror）
3. 可以添加实时协作对比功能
4. 可以添加差异导出功能（PDF、图片等）

## 许可证

MIT

## 贡献

欢迎提交 Issue 和 Pull Request！

