<template>
  <div class="container">
    <div class="header">
      <h1>富文本对比技术演示</h1>
      <p>
        本演示项目展示了多种成熟的富文本对比前端技术方案，包括 diff-match-patch、diff2html、Monaco Editor、htmldiff.js 等。
        每种技术都有其特点和适用场景，可以根据项目需求选择合适的方案。htmldiff.js 特别适合在两个 v-html 容器中实现 HTML 内容的对比效果。
      </p>
    </div>

    <div class="tabs">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        :class="['tab-button', { active: activeTab === tab.id }]"
        @click="activeTab = tab.id"
      >
        {{ tab.name }}
      </button>
    </div>

    <component :is="currentComponent" />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import DiffMatchPatchDemo from './components/DiffMatchPatchDemo.vue'
import Diff2HtmlDemo from './components/Diff2HtmlDemo.vue'
import MonacoDiffDemo from './components/MonacoDiffDemo.vue'
import CustomHtmlDiffDemo from './components/CustomHtmlDiffDemo.vue'
import JsDiffDemo from './components/JsDiffDemo.vue'
import FastDiffDemo from './components/FastDiffDemo.vue'
import HtmlDiffJsDemo from './components/HtmlDiffJsDemo.vue'
import JsonDiffPatchDemo from './components/JsonDiffPatchDemo.vue'
import DomRecursiveDiffDemo from './components/DomRecursiveDiffDemo.vue'
import RichEditorDiffDemo from './components/RichEditorDiffDemo.vue'

const tabs = [
  { id: 'diff-match-patch', name: 'diff-match-patch' },
  { id: 'diff2html', name: 'diff2html' },
  { id: 'monaco', name: 'Monaco Editor' },
  { id: 'custom', name: '自定义 HTML Diff' },
  { id: 'jsdiff', name: 'diff' },
  { id: 'fast-diff', name: 'fast-diff' },
  { id: 'htmldiff-js', name: 'htmldiff.js (v-html 对比)' },
  { id: 'jsondiffpatch', name: 'jsondiffpatch' },
  { id: 'dom-recursive', name: 'DOM 递归对比' },
  { id: 'rich-editor', name: 'Quill 编辑器对比' }
]

const activeTab = ref('diff-match-patch')

const components = {
  'diff-match-patch': DiffMatchPatchDemo,
  'diff2html': Diff2HtmlDemo,
  'monaco': MonacoDiffDemo,
  'custom': CustomHtmlDiffDemo,
  'jsdiff': JsDiffDemo,
  'fast-diff': FastDiffDemo,
  'htmldiff-js': HtmlDiffJsDemo,
  'jsondiffpatch': JsonDiffPatchDemo,
  'dom-recursive': DomRecursiveDiffDemo,
  'rich-editor': RichEditorDiffDemo
}

const currentComponent = computed(() => components[activeTab.value])
</script>

