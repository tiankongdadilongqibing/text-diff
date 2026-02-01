<template>
  <div class="demo-container">
    <div class="demo-header">
      <h2>diff (文本差异库)</h2>
      <p>
        diff 是一个功能强大的 JavaScript 文本差异库，支持多种对比模式。
        可以对比字符、词、行、句子等不同粒度，支持 HTML 内容对比。
        提供丰富的 API 和配置选项，适合各种文本对比场景。
        注意：这是 npm 上的 diff 包，不是 jsdiff 包。
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
      <button class="btn btn-primary" @click="compareText">对比文本</button>
      <button class="btn btn-secondary" @click="loadExample">加载纯文本示例</button>
      <button class="btn btn-secondary" @click="loadHtmlExample">加载HTML示例</button>
      <button class="btn btn-secondary" @click="clearAll">清空</button>
    </div>

    <div v-if="diffResult" class="diff-result">
      <div class="diff-info">
        <strong>对比结果：</strong>
        使用 {{ diffMode }} 模式
      </div>
      <div class="html-diff-output" v-html="diffResult"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { diffWords, diffChars, diffLines, diffWordsWithSpace } from 'diff'

const oldText = ref('')
const newText = ref('')
const diffResult = ref('')
const diffMode = ref('words')

// 默认测试文本
const defaultOldText = `富文本编辑器是一种所见即所得的编辑器。
它允许用户直接编辑格式化的文本。
支持加粗、斜体、下划线等格式。
可以插入图片、链接、表格等元素。`

const defaultNewText = `富文本编辑器是一种所见即所得的编辑器。
它允许用户直接编辑格式化的文本内容。
支持加粗、斜体、下划线、删除线等格式。
可以插入图片、链接、表格、代码块等元素。
还支持实时协作编辑功能。`

// 富文本HTML测试文本
const htmlOldText = `<div class="article">
  <h1>欢迎使用富文本编辑器</h1>
  <p>这是一个功能强大的<strong>富文本编辑器</strong>，支持多种格式。</p>
  <ul>
    <li>文本格式化</li>
    <li>图片插入</li>
  </ul>
</div>`

const htmlNewText = `<div class="article">
  <h1>欢迎使用富文本编辑器</h1>
  <p>这是一个功能强大的<strong>富文本编辑器</strong>，支持多种格式和<u>实时协作</u>。</p>
  <ul>
    <li>文本格式化（加粗、斜体等）</li>
    <li>图片插入和编辑</li>
    <li>表格编辑</li>
  </ul>
</div>`

// 组件挂载时自动加载示例
onMounted(() => {
  oldText.value = defaultOldText
  newText.value = defaultNewText
  compareText()
})

const compareText = () => {
  if (!oldText.value && !newText.value) {
    alert('请输入要对比的文本')
    return
  }

  try {
    // 检测是否为HTML内容
    const isHtml = oldText.value.includes('<') && oldText.value.includes('>')
    
    let diffs
    if (isHtml) {
      // HTML内容使用字符级对比
      diffs = diffChars(oldText.value, newText.value)
      diffMode.value = 'chars'
    } else {
      // 普通文本使用词级对比
      diffs = diffWordsWithSpace(oldText.value, newText.value)
      diffMode.value = 'words'
    }

    // 生成HTML
    let html = ''
    diffs.forEach((part) => {
      const escaped = escapeHtml(part.value)
      if (part.added) {
        html += `<span class="jsdiff-added">${escaped}</span>`
      } else if (part.removed) {
        html += `<span class="jsdiff-removed">${escaped}</span>`
      } else {
        html += `<span class="jsdiff-unchanged">${escaped}</span>`
      }
    })

    diffResult.value = html
  } catch (error) {
    console.error('jsdiff error:', error)
    alert('生成差异对比失败')
  }
}

const escapeHtml = (text) => {
  const div = document.createElement('div')
  div.textContent = text
  return div.innerHTML.replace(/\n/g, '<br>')
}

const loadExample = () => {
  oldText.value = defaultOldText
  newText.value = defaultNewText
  compareText()
}

const loadHtmlExample = () => {
  oldText.value = htmlOldText
  newText.value = htmlNewText
  compareText()
}

const clearAll = () => {
  oldText.value = ''
  newText.value = ''
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
  font-family: 'Courier New', monospace;
}

:deep(.jsdiff-added) {
  background: #d4edda;
  color: #155724;
  padding: 2px 4px;
  border-radius: 2px;
}

:deep(.jsdiff-removed) {
  background: #f8d7da;
  color: #721c24;
  padding: 2px 4px;
  border-radius: 2px;
  text-decoration: line-through;
}

:deep(.jsdiff-unchanged) {
  color: #333;
}
</style>
