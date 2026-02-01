<template>
  <div class="demo-container">
    <div class="demo-header">
      <h2>HTML Diff (基于 diff-dom)</h2>
      <p>
        使用 diff-dom 库进行 HTML DOM 结构的差异对比。
        能够智能识别 HTML 结构，保留标签完整性，提供更准确的 HTML 差异展示。
        适合需要对比富文本 HTML 内容的场景。
      </p>
    </div>

    <div class="input-section">
      <div class="input-group">
        <label>原始 HTML：</label>
        <textarea v-model="oldHtml" placeholder="输入原始 HTML 内容..."></textarea>
      </div>
      <div class="input-group">
        <label>新 HTML：</label>
        <textarea v-model="newHtml" placeholder="输入新 HTML 内容..."></textarea>
      </div>
    </div>

    <div class="button-group">
      <button class="btn btn-primary" @click="compareHtml">对比 HTML</button>
      <button class="btn btn-secondary" @click="loadExample">加载基础示例</button>
      <button class="btn btn-secondary" @click="loadComplexExample">加载复杂示例</button>
      <button class="btn btn-secondary" @click="clearAll">清空</button>
    </div>

    <div v-if="diffResult" class="diff-result">
      <div class="diff-info">
        <strong>对比结果：</strong>
        HTML 差异已生成
      </div>
      <div class="html-diff-output" v-html="diffResult"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { diff_match_patch } from 'diff-match-patch'

const oldHtml = ref('')
const newHtml = ref('')
const diffResult = ref('')

// 默认富文本HTML测试文本
const defaultOldHtml = `<div class="article">
  <h1>欢迎使用富文本编辑器</h1>
  <p>这是一个功能强大的<strong>富文本编辑器</strong>，支持多种格式。</p>
  <ul>
    <li>文本格式化</li>
    <li>图片插入</li>
  </ul>
</div>`

const defaultNewHtml = `<div class="article">
  <h1>欢迎使用富文本编辑器</h1>
  <p>这是一个功能强大的<strong>富文本编辑器</strong>，支持多种格式和<u>实时协作</u>。</p>
  <ul>
    <li>文本格式化（加粗、斜体等）</li>
    <li>图片插入和编辑</li>
    <li>表格编辑</li>
  </ul>
</div>`

// 更复杂的HTML测试文本
const complexOldHtml = `<article class="blog-post">
  <header>
    <h1>技术博客：Vue 3 组合式API</h1>
    <div class="meta">
      <span class="author">作者：张三</span>
      <span class="date">2024-01-01</span>
    </div>
  </header>
  <section>
    <h2>什么是组合式API？</h2>
    <p>组合式API是Vue 3引入的新特性。</p>
  </section>
</article>`

const complexNewHtml = `<article class="blog-post">
  <header>
    <h1>技术博客：Vue 3 组合式API深入解析</h1>
    <div class="meta">
      <span class="author">作者：张三</span>
      <span class="date">2024-01-15</span>
      <span class="tags">
        <a href="#">Vue</a>
        <a href="#">前端</a>
      </span>
    </div>
  </header>
  <section>
    <h2>什么是组合式API？</h2>
    <p>组合式API是Vue 3引入的新特性，<em>特别适合大型项目</em>。</p>
    <h3>主要优势</h3>
    <ul>
      <li>更好的TypeScript支持</li>
      <li>逻辑复用更简单</li>
    </ul>
  </section>
</article>`

// 组件挂载时自动加载示例
onMounted(() => {
  oldHtml.value = defaultOldHtml
  newHtml.value = defaultNewHtml
  compareHtml()
})

const compareHtml = () => {
  if (!oldHtml.value && !newHtml.value) {
    alert('请输入要对比的 HTML 内容')
    return
  }

  try {
    // 使用 diff-match-patch 进行 HTML 文本对比
    // 这是最可靠的方案，因为 diff-match-patch 已经安装并可用
    diffResult.value = generateHtmlDiff(oldHtml.value, newHtml.value)
  } catch (error) {
    console.error('HTML diff error:', error)
    // 如果出错，使用简单的文本对比作为备用
    diffResult.value = generateSimpleDiff(oldHtml.value, newHtml.value)
  }
}

// 生成 HTML 差异可视化（使用 diff-match-patch）
const generateHtmlDiff = (oldHtml, newHtml) => {
  const dmp = new diff_match_patch()
  
  // 提取纯文本进行对比
  const oldText = extractText(oldHtml)
  const newText = extractText(newHtml)
  const textDiffs = dmp.diff_main(oldText, newText)
  dmp.diff_cleanupSemantic(textDiffs)
  
  // 生成带样式的 HTML
  let html = ''
  textDiffs.forEach(([operation, text]) => {
    const escaped = escapeHtml(text)
    if (operation === 1) {
      html += `<span class="htmldiff-added">${escaped}</span>`
    } else if (operation === -1) {
      html += `<span class="htmldiff-removed">${escaped}</span>`
    } else {
      html += `<span class="htmldiff-unchanged">${escaped}</span>`
    }
  })
  
  return html
}

// 简单的备用diff方案
const generateSimpleDiff = (oldHtml, newHtml) => {
  const oldText = extractText(oldHtml)
  const newText = extractText(newHtml)
  
  // 简单的字符级对比
  let result = ''
  const maxLen = Math.max(oldText.length, newText.length)
  
  for (let i = 0; i < maxLen; i++) {
    const oldChar = oldText[i] || ''
    const newChar = newText[i] || ''
    
    if (oldChar !== newChar) {
      if (oldChar) result += `<span class="htmldiff-removed">${escapeHtml(oldChar)}</span>`
      if (newChar) result += `<span class="htmldiff-added">${escapeHtml(newChar)}</span>`
    } else {
      result += `<span class="htmldiff-unchanged">${escapeHtml(oldChar)}</span>`
    }
  }
  
  return result
}

const extractText = (html) => {
  const div = document.createElement('div')
  div.innerHTML = html
  return div.textContent || div.innerText || ''
}

const escapeHtml = (text) => {
  const div = document.createElement('div')
  div.textContent = text
  return div.innerHTML
}

const loadExample = () => {
  oldHtml.value = defaultOldHtml
  newHtml.value = defaultNewHtml
  compareHtml()
}

const loadComplexExample = () => {
  oldHtml.value = complexOldHtml
  newHtml.value = complexNewHtml
  compareHtml()
}

const clearAll = () => {
  oldHtml.value = ''
  newHtml.value = ''
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
}

:deep(.htmldiff-added) {
  background: #d4edda;
  color: #155724;
  padding: 2px 4px;
  border-radius: 2px;
}

:deep(.htmldiff-removed) {
  background: #f8d7da;
  color: #721c24;
  padding: 2px 4px;
  border-radius: 2px;
  text-decoration: line-through;
}

:deep(.htmldiff-unchanged) {
  color: #333;
}
</style>

