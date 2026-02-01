<template>
  <div class="demo-container">
    <div class="demo-header">
      <h2>Monaco Editor Diff</h2>
      <p>
        Monaco Editor 是 VS Code 使用的编辑器核心，内置强大的 diff 功能。
        支持语法高亮、行号、滚动同步、内联差异显示等高级特性。
        适合代码对比、文档对比等需要专业编辑器体验的场景。
      </p>
    </div>

    <div class="input-section">
      <div class="input-group">
        <label>原始文本：</label>
        <textarea v-model="oldText" placeholder="输入原始文本..."></textarea>
      </div>
      <div class="input-group">
        <label>新文本：</label>
        <textarea v-model="newText" placeholder="输入新文本..."></textarea>
      </div>
    </div>

    <div class="button-group">
      <button class="btn btn-primary" @click="updateDiff">更新对比</button>
      <button class="btn btn-secondary" @click="loadExample">加载Markdown示例</button>
      <button class="btn btn-secondary" @click="loadHtmlExample">加载HTML示例</button>
      <button class="btn btn-secondary" @click="clearAll">清空</button>
    </div>

    <div ref="editorContainer" class="monaco-editor-container"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import * as monaco from 'monaco-editor'

const oldText = ref('')
const newText = ref('')
const editorContainer = ref(null)
let diffEditor = null

// 默认测试文本
const defaultOldText = `# 项目说明

这是一个富文本编辑器项目。

## 功能特性

1. 支持文本格式化
2. 支持图片插入
3. 支持表格编辑

## 技术栈

- Vue 3
- Vite
- TypeScript`

const defaultNewText = `# 项目说明

这是一个富文本编辑器项目，用于文档编辑和协作。

## 功能特性

1. 支持文本格式化（加粗、斜体、下划线等）
2. 支持图片插入和编辑
3. 支持表格编辑
4. 支持代码块高亮
5. 支持实时协作编辑

## 技术栈

- Vue 3 (Composition API)
- Vite (构建工具)
- TypeScript (类型支持)
- Monaco Editor (代码编辑)`

// 富文本HTML测试文本
const htmlOldText = `<!DOCTYPE html>
<html>
<head>
  <title>项目文档</title>
</head>
<body>
  <article>
    <h1>欢迎使用富文本编辑器</h1>
    <p>这是一个<strong>功能强大</strong>的编辑器。</p>
    <ul>
      <li>文本格式化</li>
      <li>图片插入</li>
    </ul>
  </article>
</body>
</html>`

const htmlNewText = `<!DOCTYPE html>
<html>
<head>
  <title>项目文档</title>
  <meta charset="UTF-8">
</head>
<body>
  <article>
    <h1>欢迎使用富文本编辑器</h1>
    <p>这是一个<strong>功能强大</strong>的编辑器，<em>支持实时协作</em>。</p>
    <ul>
      <li>文本格式化（加粗、斜体、下划线）</li>
      <li>图片插入和编辑</li>
      <li>表格编辑</li>
      <li>代码块高亮</li>
    </ul>
    <section>
      <h2>新功能</h2>
      <p>新增了<code>版本控制</code>功能。</p>
    </section>
  </article>
</body>
</html>`

onMounted(() => {
  if (editorContainer.value) {
    diffEditor = monaco.editor.createDiffEditor(editorContainer.value, {
      theme: 'vs',
      readOnly: false,
      renderSideBySide: true,
      enableSplitViewResizing: true,
      automaticLayout: true,
      fontSize: 14,
      minimap: {
        enabled: true
      }
    })

    // 设置初始内容
    oldText.value = defaultOldText
    newText.value = defaultNewText
    updateDiff()
  }
})

onBeforeUnmount(() => {
  if (diffEditor) {
    diffEditor.dispose()
  }
})

const updateDiff = () => {
  if (!diffEditor) return

  const originalModel = monaco.editor.createModel(oldText.value || '', 'text/plain')
  const modifiedModel = monaco.editor.createModel(newText.value || '', 'text/plain')

  diffEditor.setModel({
    original: originalModel,
    modified: modifiedModel
  })
}

const loadExample = () => {
  oldText.value = defaultOldText
  newText.value = defaultNewText
  updateDiff()
}

const loadHtmlExample = () => {
  oldText.value = htmlOldText
  newText.value = htmlNewText
  updateDiff()
}

const clearAll = () => {
  oldText.value = ''
  newText.value = ''
  updateDiff()
}

// 监听文本变化，自动更新（可选）
watch([oldText, newText], () => {
  if (diffEditor) {
    updateDiff()
  }
})
</script>

<style scoped>
.monaco-editor-container {
  height: 600px;
  border: 1px solid #ddd;
  border-radius: 4px;
  overflow: hidden;
}
</style>

