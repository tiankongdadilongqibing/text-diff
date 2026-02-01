<template>
  <div class="demo-container">
    <div class="demo-header">
      <h2>jsondiffpatch</h2>
      <p>
        jsondiffpatch 是一个强大的 JSON 对象差异对比库，支持深度对象对比。
        可以将对象差异转换为可视化的 HTML 展示，非常适合结构化数据的对比。
        虽然主要用于 JSON，但也可以用于对比 HTML 的 DOM 结构。
      </p>
    </div>

    <div class="input-section">
      <div class="input-group">
        <label>原始 HTML/JSON：</label>
        <textarea v-model="oldData" placeholder="输入原始内容..."></textarea>
      </div>
      <div class="input-group">
        <label>新 HTML/JSON：</label>
        <textarea v-model="newData" placeholder="输入新内容..."></textarea>
      </div>
    </div>

    <div class="button-group">
      <button class="btn btn-primary" @click="compareData">对比数据</button>
      <button class="btn btn-secondary" @click="loadHtmlExample">加载HTML示例</button>
      <button class="btn btn-secondary" @click="loadJsonExample">加载JSON示例</button>
      <button class="btn btn-secondary" @click="clearAll">清空</button>
    </div>

    <div v-if="diffResult" class="diff-result">
      <div class="diff-info">
        <strong>对比结果：</strong>
        {{ diffMode === 'html' ? 'HTML 结构对比' : 'JSON 对象对比' }}
      </div>
      <div class="html-diff-output" v-html="diffResult"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const oldData = ref('')
const newData = ref('')
const diffResult = ref('')
const diffMode = ref('html')

// HTML测试文本
const htmlOldData = `<div class="article">
  <h1>欢迎使用富文本编辑器</h1>
  <p>这是一个功能强大的编辑器。</p>
  <ul>
    <li>文本格式化</li>
    <li>图片插入</li>
  </ul>
</div>`

const htmlNewData = `<div class="article">
  <h1>欢迎使用富文本编辑器</h1>
  <p>这是一个功能强大的编辑器，<strong>支持实时协作</strong>。</p>
  <ul>
    <li>文本格式化</li>
    <li>图片插入和编辑</li>
    <li>表格编辑</li>
  </ul>
</div>`

// JSON测试数据
const jsonOldData = {
  title: "项目文档",
  author: "张三",
  content: "这是一个富文本编辑器项目。",
  features: ["文本格式化", "图片插入"]
}

const jsonNewData = {
  title: "项目文档",
  author: "张三",
  content: "这是一个富文本编辑器项目，支持实时协作。",
  features: ["文本格式化", "图片插入", "表格编辑", "代码高亮"],
  version: "2.0.0"
}

// 组件挂载时自动加载示例
onMounted(() => {
  oldData.value = htmlOldData
  newData.value = htmlNewData
  diffMode.value = 'html'
  compareData()
})

const compareData = async () => {
  if (!oldData.value && !newData.value) {
    alert('请输入要对比的内容')
    return
  }

  try {
    // 动态导入 jsondiffpatch
    const jsondiffpatch = await import('jsondiffpatch')
    const JsDiffPatch = jsondiffpatch.default || jsondiffpatch
    const formatters = jsondiffpatch.formatters || {}
    const htmlFormatter = formatters.html || formatters.HtmlFormatter

    // 判断是HTML还是JSON
    let oldObj, newObj
    try {
      // 尝试解析为JSON
      oldObj = JSON.parse(oldData.value)
      newObj = JSON.parse(newData.value)
      diffMode.value = 'json'
    } catch {
      // 不是JSON，转换为对象结构
      oldObj = htmlToObject(oldData.value)
      newObj = htmlToObject(newData.value)
      diffMode.value = 'html'
    }

    // 计算差异
    const delta = JsDiffPatch.diff(oldObj, newObj)

    // 格式化输出
    if (htmlFormatter) {
      diffResult.value = htmlFormatter.format(delta, oldObj)
    } else {
      // 备用方案：使用文本格式
      diffResult.value = `<pre>${JSON.stringify(delta, null, 2)}</pre>`
    }
  } catch (error) {
    console.error('jsondiffpatch error:', error)
    // 使用简单的文本对比作为备用
    diffResult.value = `<div class="code-block"><pre>${generateSimpleDiff(oldData.value, newData.value)}</pre></div>`
  }
}

// 将HTML转换为对象结构（简化版）
const htmlToObject = (html) => {
  const div = document.createElement('div')
  div.innerHTML = html
  return {
    tag: div.children[0]?.tagName?.toLowerCase() || 'div',
    content: div.textContent || '',
    html: html
  }
}

// 简单的文本对比
const generateSimpleDiff = (oldText, newText) => {
  const oldLines = oldText.split('\n')
  const newLines = newText.split('\n')
  let result = ''
  
  const maxLen = Math.max(oldLines.length, newLines.length)
  for (let i = 0; i < maxLen; i++) {
    const oldLine = oldLines[i] || ''
    const newLine = newLines[i] || ''
    
    if (oldLine !== newLine) {
      if (oldLine) result += `- ${oldLine}\n`
      if (newLine) result += `+ ${newLine}\n`
    } else {
      result += `  ${oldLine}\n`
    }
  }
  
  return result
}

const loadHtmlExample = () => {
  oldData.value = htmlOldData
  newData.value = htmlNewData
  diffMode.value = 'html'
  compareData()
}

const loadJsonExample = () => {
  oldData.value = JSON.stringify(jsonOldData, null, 2)
  newData.value = JSON.stringify(jsonNewData, null, 2)
  diffMode.value = 'json'
  compareData()
}

const clearAll = () => {
  oldData.value = ''
  newData.value = ''
  diffResult.value = ''
}
</script>

<style scoped>
.html-diff-output {
  line-height: 1.8;
  font-size: 14px;
  padding: 15px;
  background: white;
  border-radius: 4px;
  overflow-x: auto;
}

:deep(.jsondiffpatch-delta) {
  font-family: 'Courier New', monospace;
}

:deep(.jsondiffpatch-added) {
  background: #d4edda;
  color: #155724;
}

:deep(.jsondiffpatch-deleted) {
  background: #f8d7da;
  color: #721c24;
}

:deep(.jsondiffpatch-modified) {
  background: #fff3cd;
  color: #856404;
}
</style>

