<template>
  <div class="demo-container">
    <div class="demo-header">
      <h2>自定义 HTML Diff</h2>
      <p>
        基于 diff-match-patch 实现的自定义 HTML 差异对比方案。
        专门针对富文本 HTML 内容进行优化，支持保留 HTML 标签结构。
        可以自定义样式和交互，适合需要完全控制展示效果的场景。
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
        {{ diffStats.totalChanges }} 处变化
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
const diffStats = ref({ totalChanges: 0 })

const dmp = new diff_match_patch()

// 默认富文本HTML测试文本
const defaultOldHtml = `<div class="article">
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

const defaultNewHtml = `<div class="article">
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
    <p>组合式API是Vue 3引入的新特性，它提供了更好的<strong>代码组织</strong>和<strong>逻辑复用</strong>能力。</p>
    <h3>主要优势</h3>
    <ul>
      <li>更好的TypeScript支持</li>
      <li>逻辑复用更简单</li>
    </ul>
    <pre><code>const count = ref(0)</code></pre>
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
    <p>组合式API是Vue 3引入的新特性，它提供了更好的<strong>代码组织</strong>和<strong>逻辑复用</strong>能力，<em>特别适合大型项目</em>。</p>
    <h3>主要优势</h3>
    <ul>
      <li>更好的TypeScript支持</li>
      <li>逻辑复用更简单</li>
      <li>更好的性能优化</li>
      <li>更清晰的代码结构</li>
    </ul>
    <h3>使用示例</h3>
    <pre><code>import { ref, computed } from 'vue'

const count = ref(0)
const doubleCount = computed(() => count.value * 2)</code></pre>
    <p>通过组合式API，我们可以更好地组织代码逻辑。</p>
  </section>
</article>`

// 组件挂载时自动加载示例
onMounted(() => {
  oldHtml.value = defaultOldHtml
  newHtml.value = defaultNewHtml
  compareHtml()
})

// 提取纯文本内容（去除HTML标签）
const extractText = (html) => {
  const div = document.createElement('div')
  div.innerHTML = html
  return div.textContent || div.innerText || ''
}

// 智能对比HTML内容
const compareHtml = () => {
  if (!oldHtml.value && !newHtml.value) {
    alert('请输入要对比的 HTML 内容')
    return
  }

  try {
    // 提取纯文本进行对比
    const oldText = extractText(oldHtml.value)
    const newText = extractText(newHtml.value)
    
    // 执行差异计算
    const diffs = dmp.diff_main(oldText, newText)
    dmp.diff_cleanupSemantic(diffs)

    // 生成带样式的HTML
    let html = ''
    let changes = 0

    diffs.forEach(([operation, text]) => {
      if (operation === 1) {
        // 新增内容
        html += `<span class="html-diff-added">${escapeHtml(text)}</span>`
        changes++
      } else if (operation === -1) {
        // 删除内容
        html += `<span class="html-diff-removed">${escapeHtml(text)}</span>`
        changes++
      } else {
        // 未变化内容
        html += `<span class="html-diff-unchanged">${escapeHtml(text)}</span>`
      }
    })

    diffResult.value = html
    diffStats.value = { totalChanges: changes }
  } catch (error) {
    console.error('HTML diff error:', error)
    alert('生成差异对比失败')
  }
}

const escapeHtml = (text) => {
  const div = document.createElement('div')
  div.textContent = text
  return div.innerHTML.replace(/\n/g, '<br>')
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
  diffStats.value = { totalChanges: 0 }
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

:deep(.html-diff-added) {
  background: #d4edda;
  color: #155724;
  padding: 2px 4px;
  border-radius: 2px;
  text-decoration: none;
}

:deep(.html-diff-removed) {
  background: #f8d7da;
  color: #721c24;
  padding: 2px 4px;
  border-radius: 2px;
  text-decoration: line-through;
}

:deep(.html-diff-unchanged) {
  color: #333;
}
</style>

