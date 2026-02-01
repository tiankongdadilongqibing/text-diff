<template>
  <div class="demo-container">
    <div class="demo-header">
      <h2>diff2html</h2>
      <p>
        一个强大的 diff 可视化库，可以将 Git diff 格式的文本转换为美观的 HTML 展示。
        支持行级和词级高亮，提供丰富的配置选项和主题样式。
        适合需要展示代码差异、文档变更等场景。
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
      <button class="btn btn-secondary" @click="loadExample">加载代码示例</button>
      <button class="btn btn-secondary" @click="loadHtmlExample">加载HTML示例</button>
      <button class="btn btn-secondary" @click="clearAll">清空</button>
    </div>

    <div v-if="htmlDiff" class="diff-result">
      <div v-html="htmlDiff"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const oldText = ref('')
const newText = ref('')
const htmlDiff = ref('')

// 默认测试文本
const defaultOldText = `function calculateSum(a, b) {
  return a + b;
}

function calculateProduct(a, b) {
  return a * b;
}

function greet(name) {
  return "Hello, " + name;
}`

const defaultNewText = `function calculateSum(a, b) {
  if (typeof a !== 'number' || typeof b !== 'number') {
    throw new Error('参数必须是数字');
  }
  return a + b;
}

function calculateProduct(a, b) {
  return a * b;
}

function calculateDivision(a, b) {
  if (b === 0) {
    throw new Error('除数不能为零');
  }
  return a / b;
}

function greet(name) {
  if (!name) {
    return "Hello, Guest!";
  }
  return "Hello, " + name + "!";
}`

// 富文本HTML测试文本
const htmlOldText = `<article>
  <header>
    <h1>项目文档</h1>
    <p class="meta">最后更新：2024-01-01</p>
  </header>
  <section>
    <h2>项目介绍</h2>
    <p>这是一个<strong>富文本编辑器</strong>项目。</p>
    <ul>
      <li>功能强大</li>
      <li>易于使用</li>
    </ul>
  </section>
</article>`

const htmlNewText = `<article>
  <header>
    <h1>项目文档</h1>
    <p class="meta">最后更新：2024-01-15</p>
    <p class="author">作者：开发团队</p>
  </header>
  <section>
    <h2>项目介绍</h2>
    <p>这是一个<strong>富文本编辑器</strong>项目，<em>支持实时协作</em>。</p>
    <ul>
      <li>功能强大</li>
      <li>易于使用</li>
      <li>支持多人协作</li>
      <li>版本控制</li>
    </ul>
    <h2>新功能</h2>
    <p>新增了<code>代码高亮</code>和<u>表格编辑</u>功能。</p>
  </section>
</article>`

// 组件挂载时自动加载示例
onMounted(() => {
  oldText.value = defaultOldText
  newText.value = defaultNewText
  compareText()
})

// 动态导入 diff2html（避免构建问题）
let Diff2Html = null
const loadDiff2Html = async () => {
  if (!Diff2Html) {
    try {
      const diff2htmlModule = await import('diff2html')
      Diff2Html = diff2htmlModule.default || diff2htmlModule
      await import('diff2html/bundles/css/diff2html.min.css')
    } catch (error) {
      console.error('Failed to load diff2html:', error)
      return false
    }
  }
  return true
}

const generateUnifiedDiff = (oldText, newText) => {
  const oldLines = oldText.split('\n')
  const newLines = newText.split('\n')
  
  let diff = '--- a/original.txt\n+++ b/modified.txt\n@@ -1,0 +1,0 @@\n'
  
  // 简单的行级差异生成
  const maxLen = Math.max(oldLines.length, newLines.length)
  for (let i = 0; i < maxLen; i++) {
    const oldLine = oldLines[i] || ''
    const newLine = newLines[i] || ''
    
    if (oldLine !== newLine) {
      if (oldLine) diff += `-${oldLine}\n`
      if (newLine) diff += `+${newLine}\n`
    } else {
      diff += ` ${oldLine}\n`
    }
  }
  
  return diff
}

const compareText = async () => {
  if (!oldText.value && !newText.value) {
    alert('请输入要对比的文本')
    return
  }

  const loaded = await loadDiff2Html()
  if (!loaded) {
    alert('加载 diff2html 库失败，请检查依赖安装')
    return
  }

  try {
    const unifiedDiff = generateUnifiedDiff(oldText.value, newText.value)
    // diff2html 的 API 可能是 parse 和 html，或者 Diff2Html.parse 和 Diff2Html.html
    const parse = Diff2Html.parse || (Diff2Html.Diff2Html && Diff2Html.Diff2Html.parse)
    const html = Diff2Html.html || (Diff2Html.Diff2Html && Diff2Html.Diff2Html.html)
    
    if (!parse || !html) {
      // 如果 API 不存在，使用备用方案
      htmlDiff.value = `<div class="code-block">${unifiedDiff.replace(/\n/g, '<br>').replace(/^\+/gm, '<span style="color:green">+').replace(/^\-/gm, '<span style="color:red">-').replace(/^ /gm, '<span style="color:#666"> ')}</div>`
      return
    }
    
    const diffJson = parse(unifiedDiff)
    htmlDiff.value = html(diffJson, {
      drawFileList: false,
      matching: 'lines',
      outputFormat: 'side-by-side',
      colorScheme: 'auto'
    })
  } catch (error) {
    console.error('Diff2Html error:', error)
    // 使用简单的备用方案
    const unifiedDiff = generateUnifiedDiff(oldText.value, newText.value)
    htmlDiff.value = `<div class="code-block"><pre>${unifiedDiff}</pre></div>`
  }
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
  htmlDiff.value = ''
}
</script>

<style scoped>
:deep(.d2h-wrapper) {
  border: 1px solid #ddd;
  border-radius: 4px;
}

:deep(.d2h-file-header) {
  background: #f8f9fa;
  padding: 10px;
  border-bottom: 1px solid #ddd;
}

:deep(.d2h-code-line) {
  font-family: 'Courier New', monospace;
  font-size: 13px;
}
</style>

