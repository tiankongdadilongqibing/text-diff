<template>
  <div class="demo-container">
    <div class="demo-header">
      <h2>HTML Diff (基于 htmldiff.js)</h2>
      <p>
        使用 htmldiff.js 库进行 HTML 内容的差异对比。
        能够智能识别 HTML 结构，保留标签完整性，在两个 v-html 容器中展示对比效果。
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
      <button class="btn btn-secondary" @click="loadUltraComplexExample">加载超复杂示例</button>
      <button class="btn btn-secondary" @click="clearAll">清空</button>
    </div>

    <div v-if="diffResult" class="diff-result">
      <div class="diff-info">
        <strong>对比结果：</strong>
        HTML 差异已生成，使用 htmldiff.js 进行对比
      </div>
      <div class="diff-containers">
        <div class="diff-container">
          <div class="diff-label">原始 HTML（渲染效果）：</div>
          <div class="html-diff-output" v-html="oldHtml"></div>
        </div>
        <div class="diff-container">
          <div class="diff-label">新 HTML（渲染效果）：</div>
          <div class="html-diff-output" v-html="newHtml"></div>
        </div>
      </div>
      <div class="diff-merged">
        <div class="diff-label">差异对比结果（合并视图）：</div>
        <div class="html-diff-output" v-html="diffResult"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
// htmldiff 使用 CommonJS 导出，通过 Vite alias 配置导入
import htmldiff from 'htmldiff'

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
    <blockquote>
      <p>这是一个重要的更新。</p>
    </blockquote>
  </section>
</article>`

const complexNewHtml = `<article class="blog-post">
  <header>
    <h1>技术博客：Vue 3 组合式API深入解析</h1>
    <div class="meta">
      <span class="author">作者：张三</span>
      <span class="date">2024-01-15</span>
      <span class="tags">
        <a href="#vue">Vue</a>
        <a href="#frontend">前端</a>
      </span>
    </div>
  </header>
  <section>
    <h2>什么是组合式API？</h2>
    <p>组合式API是Vue 3引入的新特性，<em>特别适合大型项目</em>。</p>
    <blockquote>
      <p>这是一个<strong>重要的</strong>更新，改变了Vue的开发方式。</p>
    </blockquote>
    <h3>主要优势</h3>
    <ul>
      <li>更好的TypeScript支持</li>
      <li>逻辑复用更简单</li>
    </ul>
    <pre><code>const count = ref(0)</code></pre>
  </section>
</article>`

// 超复杂的HTML测试文本 - 包含多种HTML标签
const ultraComplexOldHtml = `<div class="document">
  <header>
    <h1>完整的技术文档示例</h1>
    <nav>
      <ul>
        <li><a href="#intro">介绍</a></li>
        <li><a href="#features">特性</a></li>
      </ul>
    </nav>
  </header>
  
  <main>
    <section id="intro">
      <h2>介绍</h2>
      <p>这是一个<strong>功能强大</strong>的编辑器，支持<em>多种格式</em>。</p>
      <p>你可以使用<mark>标记</mark>来<u>突出显示</u>重要内容。</p>
    </section>
    
    <section id="features">
      <h2>主要特性</h2>
      <ol>
        <li>文本格式化</li>
        <li>图片插入</li>
      </ol>
      
      <table border="1">
        <thead>
          <tr>
            <th>功能</th>
            <th>状态</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>文本编辑</td>
            <td>可用</td>
          </tr>
        </tbody>
      </table>
    </section>
    
    <section id="code">
      <h3>代码示例</h3>
      <pre><code>function hello() {
  console.log('Hello World');
}</code></pre>
    </section>
    
    <aside>
      <h4>相关链接</h4>
      <ul>
        <li><a href="https://example.com">示例网站</a></li>
      </ul>
    </aside>
  </main>
  
  <footer>
    <p>© 2024 版权所有</p>
  </footer>
</div>`

const ultraComplexNewHtml = `<div class="document">
  <header>
    <h1>完整的技术文档示例 - 更新版</h1>
    <nav>
      <ul>
        <li><a href="#intro">介绍</a></li>
        <li><a href="#features">特性</a></li>
        <li><a href="#advanced">高级功能</a></li>
        <li><a href="#api">API 参考</a></li>
      </ul>
    </nav>
  </header>
  
  <main>
    <section id="intro">
      <h2>介绍</h2>
      <p>这是一个<strong>功能强大</strong>的<em>富文本编辑器</em>，支持<em>多种格式</em>和<u>实时协作</u>。</p>
      <p>你可以使用<mark>标记</mark>来<u>突出显示</u>重要内容，还可以使用<small>小号字体</small>和<sub>下标</sub>、<sup>上标</sup>。</p>
      <hr>
      <p>新增了更多功能，包括表格编辑、代码高亮等。</p>
    </section>
    
    <section id="features">
      <h2>主要特性</h2>
      <ol>
        <li>文本格式化（<strong>加粗</strong>、<em>斜体</em>、<u>下划线</u>）</li>
        <li>图片插入和编辑</li>
        <li>表格编辑</li>
        <li>代码块高亮</li>
        <li>引用和列表</li>
      </ol>
      
      <table border="1" cellpadding="5" cellspacing="0">
        <thead>
          <tr>
            <th>功能</th>
            <th>状态</th>
            <th>版本</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>文本编辑</td>
            <td>可用</td>
            <td>v1.0</td>
          </tr>
          <tr>
            <td>图片上传</td>
            <td>可用</td>
            <td>v1.2</td>
          </tr>
          <tr>
            <td>表格编辑</td>
            <td>可用</td>
            <td>v1.5</td>
          </tr>
          <tr>
            <td>代码高亮</td>
            <td>测试中</td>
            <td>v2.0-beta</td>
          </tr>
        </tbody>
      </table>
    </section>
    
    <section id="advanced">
      <h2>高级功能</h2>
      <dl>
        <dt><strong>实时协作</strong></dt>
        <dd>多人同时编辑，实时同步更改</dd>
        <dt><strong>版本控制</strong></dt>
        <dd>自动保存历史版本，支持回退</dd>
      </dl>
    </section>
    
    <section id="code">
      <h3>代码示例</h3>
      <pre><code class="language-javascript">function hello(name) {
  const greeting = \`Hello, \${name}!\`;
  console.log(greeting);
  return greeting;
}

hello('World');</code></pre>
      
      <p>还可以使用行内代码，比如 <code>const x = 10</code>。</p>
    </section>
    
    <section id="api">
      <h2>API 参考</h2>
      <blockquote>
        <p>这是一个重要的API更新说明。</p>
        <footer>— 开发团队</footer>
      </blockquote>
    </section>
    
    <aside>
      <h4>相关链接</h4>
      <ul>
        <li><a href="https://example.com" target="_blank">示例网站</a></li>
        <li><a href="https://docs.example.com" target="_blank">文档中心</a></li>
        <li><a href="https://github.com/example" target="_blank">GitHub 仓库</a></li>
      </ul>
      
      <figure>
        <img src="https://via.placeholder.com/400x200" alt="示例图片" width="400" height="200">
        <figcaption>这是一个示例图片</figcaption>
      </figure>
    </aside>
  </main>
  
  <footer>
    <p>© 2024 版权所有 | <a href="#privacy">隐私政策</a> | <a href="#terms">使用条款</a></p>
    <address>
      联系地址：<a href="mailto:contact@example.com">contact@example.com</a>
    </address>
  </footer>
</div>`

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
    // 使用 htmldiff.js 进行 HTML 内容对比
    // htmldiff 会返回一个包含 <ins> 和 <del> 标签的 HTML 字符串
    diffResult.value = htmldiff(oldHtml.value, newHtml.value)
  } catch (error) {
    console.error('HTML diff error:', error)
    alert('HTML 对比失败，请检查输入的 HTML 内容是否有效')
    diffResult.value = ''
  }
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

const loadUltraComplexExample = () => {
  oldHtml.value = ultraComplexOldHtml
  newHtml.value = ultraComplexNewHtml
  compareHtml()
}

const clearAll = () => {
  oldHtml.value = ''
  newHtml.value = ''
  diffResult.value = ''
}
</script>

<style scoped>
.diff-containers {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 20px;
}

.diff-container {
  display: flex;
  flex-direction: column;
}

.diff-merged {
  margin-top: 20px;
}

.diff-label {
  font-weight: bold;
  margin-bottom: 10px;
  color: #333;
  font-size: 14px;
}

.html-diff-output {
  line-height: 1.8;
  font-size: 14px;
  padding: 15px;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  min-height: 100px;
  overflow-x: auto;
}

/* htmldiff.js 生成的标签样式 */
:deep(ins) {
  background: #d4edda;
  color: #155724;
  padding: 2px 4px;
  border-radius: 2px;
  text-decoration: none;
  display: inline-block;
}

:deep(del) {
  background: #f8d7da;
  color: #721c24;
  padding: 2px 4px;
  border-radius: 2px;
  text-decoration: line-through;
  display: inline-block;
}

/* 确保 HTML 内容正常渲染 */
:deep(.html-diff-output *) {
  margin: 0;
  padding: 0;
}

:deep(.html-diff-output h1),
:deep(.html-diff-output h2),
:deep(.html-diff-output h3),
:deep(.html-diff-output h4),
:deep(.html-diff-output h5),
:deep(.html-diff-output h6) {
  margin: 10px 0;
  font-weight: bold;
}

:deep(.html-diff-output h1) { font-size: 2em; }
:deep(.html-diff-output h2) { font-size: 1.5em; }
:deep(.html-diff-output h3) { font-size: 1.17em; }
:deep(.html-diff-output h4) { font-size: 1em; }

:deep(.html-diff-output p) {
  margin: 8px 0;
  line-height: 1.6;
}

:deep(.html-diff-output ul),
:deep(.html-diff-output ol) {
  margin: 8px 0;
  padding-left: 20px;
}

:deep(.html-diff-output li) {
  margin: 4px 0;
}

:deep(.html-diff-output table) {
  border-collapse: collapse;
  width: 100%;
  margin: 15px 0;
  border: 1px solid #ddd;
}

:deep(.html-diff-output th),
:deep(.html-diff-output td) {
  border: 1px solid #ddd;
  padding: 8px 12px;
  text-align: left;
}

:deep(.html-diff-output th) {
  background-color: #f2f2f2;
  font-weight: bold;
}

:deep(.html-diff-output blockquote) {
  margin: 15px 0;
  padding: 10px 20px;
  border-left: 4px solid #ccc;
  background-color: #f9f9f9;
  font-style: italic;
}

:deep(.html-diff-output pre) {
  background-color: #f4f4f4;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 12px;
  overflow-x: auto;
  margin: 15px 0;
  font-family: 'Courier New', monospace;
  font-size: 0.9em;
}

:deep(.html-diff-output code) {
  background-color: #f4f4f4;
  padding: 2px 6px;
  border-radius: 3px;
  font-family: 'Courier New', monospace;
  font-size: 0.9em;
}

:deep(.html-diff-output pre code) {
  background-color: transparent;
  padding: 0;
}

:deep(.html-diff-output img) {
  max-width: 100%;
  height: auto;
  margin: 10px 0;
  border-radius: 4px;
}

:deep(.html-diff-output figure) {
  margin: 15px 0;
  text-align: center;
}

:deep(.html-diff-output figcaption) {
  margin-top: 8px;
  font-size: 0.9em;
  color: #666;
  font-style: italic;
}

:deep(.html-diff-output hr) {
  border: none;
  border-top: 2px solid #ddd;
  margin: 20px 0;
}

:deep(.html-diff-output dl) {
  margin: 15px 0;
}

:deep(.html-diff-output dt) {
  font-weight: bold;
  margin-top: 10px;
}

:deep(.html-diff-output dd) {
  margin-left: 20px;
  margin-bottom: 10px;
  color: #555;
}

:deep(.html-diff-output address) {
  font-style: italic;
  margin: 10px 0;
}

:deep(.html-diff-output nav) {
  margin: 10px 0;
}

:deep(.html-diff-output nav ul) {
  list-style: none;
  padding-left: 0;
}

:deep(.html-diff-output nav li) {
  display: inline-block;
  margin-right: 15px;
}

:deep(.html-diff-output a) {
  color: #0066cc;
  text-decoration: none;
}

:deep(.html-diff-output a:hover) {
  text-decoration: underline;
}

:deep(.html-diff-output mark) {
  background-color: #ffeb3b;
  padding: 2px 4px;
}

:deep(.html-diff-output strong) {
  font-weight: bold;
}

:deep(.html-diff-output em) {
  font-style: italic;
}

:deep(.html-diff-output u) {
  text-decoration: underline;
}

:deep(.html-diff-output small) {
  font-size: 0.85em;
}

:deep(.html-diff-output sub) {
  font-size: 0.75em;
  vertical-align: sub;
}

:deep(.html-diff-output sup) {
  font-size: 0.75em;
  vertical-align: super;
}
</style>

