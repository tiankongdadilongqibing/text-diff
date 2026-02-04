<template>
  <div class="demo-container">
    <div class="demo-header">
      <h2>DOM 递归结构对比</h2>
      <p>
        通过递归解析 HTML DOM 结构，逐层对比节点标签、属性和文本内容，适合做结构化的富文本对比分析。
      </p>
    </div>

    <div class="input-section">
      <div class="input-group">
        <label>原始 HTML：</label>
        <textarea v-model="oldHtml" placeholder="输入原始 HTML..."></textarea>
      </div>
      <div class="input-group">
        <label>新 HTML：</label>
        <textarea v-model="newHtml" placeholder="输入新 HTML..."></textarea>
      </div>
    </div>

    <div class="button-group">
      <button class="btn btn-primary" @click="compareDom">递归对比 DOM</button>
      <button class="btn btn-secondary" @click="loadExample">加载示例</button>
      <button class="btn btn-secondary" @click="clearAll">清空</button>
    </div>

    <div v-if="diffItems.length" class="diff-result">
      <div class="diff-info">
        <strong>统计：</strong>
        节点变更 {{ stats.nodeChanges }} 个，属性变更 {{ stats.attrChanges }} 个，文本变更
        {{ stats.textChanges }} 个
      </div>
      <div class="code-block">
        <div
          v-for="(item, index) in diffItems"
          :key="index"
          :class="['diff-line', getTypeClass(item.type)]"
        >
          <strong>[{{ item.type }}]</strong>
          <span> {{ item.path }} </span>
          <span v-if="item.detail"> - {{ item.detail }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const oldHtml = ref('')
const newHtml = ref('')

const diffItems = ref(
  /** @type {{ type: string; path: string; detail: string }[] } */ ([]),
)

const stats = ref({
  nodeChanges: 0,
  attrChanges: 0,
  textChanges: 0,
})

const isIgnorableText = (node) =>
  node &&
  node.nodeType === Node.TEXT_NODE &&
  (!node.textContent || !node.textContent.trim())

const normalizeNode = (node) => {
  if (isIgnorableText(node)) return null
  return node
}

const parseRoot = (html) => {
  const wrapper = document.createElement('div')
  wrapper.innerHTML = html
  return wrapper
}

const walk = (oldNode, newNode, path, summary) => {
  oldNode = normalizeNode(oldNode)
  newNode = normalizeNode(newNode)

  if (!oldNode && !newNode) return

  // 新增节点
  if (!oldNode && newNode) {
    summary.nodeChanges++
    diffItems.value.push({
      type: 'added',
      path,
      detail: `<${newNode.nodeName.toLowerCase()}> 节点新增`,
    })
    return
  }

  // 删除节点
  if (oldNode && !newNode) {
    summary.nodeChanges++
    diffItems.value.push({
      type: 'removed',
      path,
      detail: `<${oldNode.nodeName.toLowerCase()}> 节点删除`,
    })
    return
  }

  // 文本节点对比
  if (oldNode.nodeType === Node.TEXT_NODE && newNode.nodeType === Node.TEXT_NODE) {
    const oldText = (oldNode.textContent || '').trim()
    const newText = (newNode.textContent || '').trim()
    if (oldText !== newText) {
      summary.textChanges++
      diffItems.value.push({
        type: 'text-changed',
        path,
        detail: `"${oldText}" → "${newText}"`,
      })
    }
    return
  }

  // 标签不同
  if (oldNode.nodeName !== newNode.nodeName) {
    summary.nodeChanges++
    diffItems.value.push({
      type: 'node-changed',
      path,
      detail: `<${oldNode.nodeName.toLowerCase()}> → <${newNode.nodeName.toLowerCase()}>`,
    })
    return
  }

  // 对比属性
  if (oldNode.attributes || newNode.attributes) {
    const oldAttrs = Array.from(oldNode.attributes || [])
    const newAttrs = Array.from(newNode.attributes || [])
    const names = new Set([
      ...oldAttrs.map((a) => a.name),
      ...newAttrs.map((a) => a.name),
    ])

    names.forEach((name) => {
      const oldVal = oldNode.getAttribute(name)
      const newVal = newNode.getAttribute(name)
      if (oldVal !== newVal) {
        summary.attrChanges++
        diffItems.value.push({
          type: 'attr-changed',
          path,
          detail: `${name}: "${oldVal ?? '无'}" → "${newVal ?? '无'}"`,
        })
      }
    })
  }

  // 递归子节点
  const oldChildren = Array.from(oldNode.childNodes || [])
  const newChildren = Array.from(newNode.childNodes || [])
  const maxLen = Math.max(oldChildren.length, newChildren.length)
  const tag = oldNode.nodeName.toLowerCase()

  for (let i = 0; i < maxLen; i++) {
    const childPath = `${path}/${tag}[${i}]`
    walk(oldChildren[i] || null, newChildren[i] || null, childPath, summary)
  }
}

const compareDom = () => {
  if (!oldHtml.value || !newHtml.value) {
    alert('请先输入两段 HTML')
    return
  }

  diffItems.value = []
  const summary = {
    nodeChanges: 0,
    attrChanges: 0,
    textChanges: 0,
  }

  const oldRoot = parseRoot(oldHtml.value)
  const newRoot = parseRoot(newHtml.value)

  walk(oldRoot, newRoot, 'root', summary)
  stats.value = summary
}

const loadExample = () => {
  oldHtml.value = `<div class="article">
  <h1>标题</h1>
  <p class="intro">这是原始的介绍文本。</p>
  <ul>
    <li>功能 A</li>
    <li>功能 B</li>
  </ul>
</div>`

  newHtml.value = `<div class="article highlight">
  <h1>标题（更新版）</h1>
  <p class="intro">这是更新后的介绍文本，包含 <strong>加粗</strong> 内容。</p>
  <ul>
    <li>功能 A</li>
    <li>功能 B（增强）</li>
    <li>功能 C（新增）</li>
  </ul>
</div>`

  compareDom()
}

const clearAll = () => {
  oldHtml.value = ''
  newHtml.value = ''
  diffItems.value = []
  stats.value = { nodeChanges: 0, attrChanges: 0, textChanges: 0 }
}

const getTypeClass = (type) => {
  if (type === 'added') return 'diff-added'
  if (type === 'removed') return 'diff-removed'
  if (type === 'attr-changed' || type === 'text-changed' || type === 'node-changed')
    return 'diff-info'
  return 'diff-unchanged'
}
</script>

