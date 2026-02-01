<template>
  <div class="container">
    <div class="header">
      <h1>富文本对比技术演示</h1>
      <p>
        本演示项目展示了多种成熟的富文本对比前端技术方案，包括 diff-match-patch、diff2html、Monaco Editor 等。
        每种技术都有其特点和适用场景，可以根据项目需求选择合适的方案。
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

const tabs = [
  { id: 'diff-match-patch', name: 'diff-match-patch' },
  { id: 'diff2html', name: 'diff2html' },
  { id: 'monaco', name: 'Monaco Editor' },
  { id: 'custom', name: '自定义 HTML Diff' }
]

const activeTab = ref('diff-match-patch')

const components = {
  'diff-match-patch': DiffMatchPatchDemo,
  'diff2html': Diff2HtmlDemo,
  'monaco': MonacoDiffDemo,
  'custom': CustomHtmlDiffDemo
}

const currentComponent = computed(() => components[activeTab.value])
</script>

