<template>
  <div class="demo-container">
    <div class="demo-header">
      <h2>diff-match-patch</h2>
      <p>
        Google 开源的文本差异算法库，提供强大的文本对比功能。
        支持字符级、词级、行级对比，可以生成详细的差异信息。
        适合纯文本对比场景，性能优秀，算法成熟稳定。
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
        共 {{ diffStats.totalChanges }} 处变化，新增 {{ diffStats.additions }} 行，删除 {{ diffStats.deletions }} 行
      </div>
      <div v-for="(line, index) in diffResult" :key="index" :class="['diff-line', getLineClass(line[0])]">
        <span class="diff-prefix">{{ line[0] }}</span>
        <span v-html="escapeHtml(line[1])"></span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { diff_match_patch } from 'diff-match-patch'

const oldText = ref('')
const newText = ref('')
const diffResult = ref(null)
const diffStats = ref({ totalChanges: 0, additions: 0, deletions: 0 })

const dmp = new diff_match_patch()

// 默认测试文本
const defaultOldText = `富文本编辑器是一种所见即所得的编辑器。
它允许用户直接编辑格式化的文本。
支持加粗、斜体、下划线等格式。
可以插入图片、链接、表格等元素。
使用简单，功能强大。`

const defaultNewText = `富文本编辑器是一种所见即所得的编辑器。
它允许用户直接编辑格式化的文本内容。
支持加粗、斜体、下划线、删除线等格式。
可以插入图片、链接、表格、代码块等元素。
还支持实时协作编辑功能。
使用简单，功能强大，适合团队协作。`

// 富文本HTML测试文本
const htmlOldText = `<div class="article">
  <h1>欢迎使用富文本编辑器</h1>
  <p>这是一个功能强大的<strong>富文本编辑器</strong>，支持多种格式。</p>
  <p>主要特性包括：</p>
  <ul>
    <li><em>文本格式化</em> - 支持加粗、斜体、下划线</li>
    <li>图片插入 - 支持本地和网络图片</li>
    <li>链接插入 - 支持超链接</li>
  </ul>
  <p>使用简单，适合各种场景。</p>
</div>`

const htmlNewText = `<div class="article">
  <h1>欢迎使用富文本编辑器</h1>
  <p>这是一个功能强大的<strong>富文本编辑器</strong>，支持多种格式和<u>实时协作</u>。</p>
  <p>主要特性包括：</p>
  <ul>
    <li><em>文本格式化</em> - 支持加粗、斜体、下划线、删除线</li>
    <li>图片插入和编辑 - 支持本地和网络图片，可调整大小</li>
    <li>链接插入 - 支持超链接和锚点</li>
    <li>表格编辑 - 支持创建和编辑表格</li>
    <li>代码块高亮 - 支持多种编程语言</li>
  </ul>
  <p>使用简单，适合各种场景，<strong>特别适合团队协作</strong>。</p>
  <blockquote>现在支持更多高级功能！</blockquote>
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

  // 执行差异计算
  const diffs = dmp.diff_main(oldText.value, newText.value)
  dmp.diff_cleanupSemantic(diffs) // 清理语义化差异

  diffResult.value = diffs

  // 统计信息
  let additions = 0
  let deletions = 0
  diffs.forEach(([operation, text]) => {
    if (operation === 1) additions += text.split('\n').length - 1
    if (operation === -1) deletions += text.split('\n').length - 1
  })

  diffStats.value = {
    totalChanges: diffs.filter(([op]) => op !== 0).length,
    additions,
    deletions
  }
}

const getLineClass = (operation) => {
  if (operation === 1) return 'diff-added'
  if (operation === -1) return 'diff-removed'
  return 'diff-unchanged'
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
  diffResult.value = null
  diffStats.value = { totalChanges: 0, additions: 0, deletions: 0 }
}
</script>

<style scoped>
.diff-prefix {
  font-weight: bold;
  margin-right: 8px;
  display: inline-block;
  min-width: 20px;
}
</style>

