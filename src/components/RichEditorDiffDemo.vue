<template>
  <div class="demo-container">
    <div class="demo-header">
      <h2>富文本编辑器（Quill）对比</h2>
      <p>
        使用 Quill 富文本编辑器的 Delta 格式，对比两份富文本文档的内容与格式变化。
        适合从编辑器视角分析富文本差异。
      </p>
    </div>

    <div class="input-section">
      <div class="input-group">
        <label>原始富文本：</label>
        <div ref="leftEditor" class="quill-editor"></div>
      </div>
      <div class="input-group">
        <label>新富文本：</label>
        <div ref="rightEditor" class="quill-editor"></div>
      </div>
    </div>

    <div class="button-group">
      <button class="btn btn-primary" @click="compareDelta">对比编辑器内容</button>
      <button class="btn btn-secondary" @click="loadExample">加载示例</button>
      <button class="btn btn-secondary" @click="clearAll">清空</button>
    </div>

    <div v-if="changes.length" class="diff-result">
      <div class="diff-info">
        <strong>统计：</strong>
        插入 {{ stats.inserts }} 段，删除 {{ stats.deletes }} 段，修改 {{ stats.modifies }} 段
      </div>
      <div class="code-block">
        <div
          v-for="(c, index) in changes"
          :key="index"
          :class="['diff-line', getChangeClass(c.type)]"
        >
          <strong>[{{ c.type }}]</strong>
          <span v-if="c.preview"> {{ c.preview }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import Quill from 'quill'
import 'quill/dist/quill.snow.css'

const leftEditor = ref(null)
const rightEditor = ref(null)

let quillLeft = /** @type {Quill | null} */ (null)
let quillRight = /** @type {Quill | null} */ (null)

const changes = ref(
  /** @type {{ type: 'insert' | 'delete' | 'modify' | 'same'; preview: string }[]} */ ([]),
)

const stats = ref({
  inserts: 0,
  deletes: 0,
  modifies: 0,
})

const initEditors = () => {
  const toolbar = [
    ['bold', 'italic', 'underline', 'strike'],
    [{ header: 1 }, { header: 2 }],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['blockquote', 'code-block'],
  ]

  if (leftEditor.value && !quillLeft) {
    quillLeft = new Quill(leftEditor.value, {
      theme: 'snow',
      modules: { toolbar },
    })
  }

  if (rightEditor.value && !quillRight) {
    quillRight = new Quill(rightEditor.value, {
      theme: 'snow',
      modules: { toolbar },
    })
  }
}

onMounted(() => {
  initEditors()
  // 初始加载一个示例
  setTimeout(() => loadExample(), 200)
})

onBeforeUnmount(() => {
  // Quill 没有 destroy API，这里只置空引用，交给 GC
  quillLeft = null
  quillRight = null
})

const opTextPreview = (op) => {
  if (!op) return ''
  if (typeof op.insert === 'string') {
    const s = op.insert.replace(/\n/g, '\\n')
    return s.length > 40 ? s.slice(0, 40) + '…' : s
  }
  if (op.insert && typeof op.insert === 'object') {
    return JSON.stringify(op.insert)
  }
  if (op.delete) return `删除 ${op.delete} 字符`
  if (op.retain) return `保留 ${op.retain} 字符`
  return '操作'
}

const compareDelta = () => {
  if (!quillLeft || !quillRight) {
    alert('编辑器尚未初始化')
    return
  }

  const leftDelta = quillLeft.getContents()
  const rightDelta = quillRight.getContents()
  const leftOps = leftDelta.ops || []
  const rightOps = rightDelta.ops || []

  const maxLen = Math.max(leftOps.length, rightOps.length)
  const result = []
  let inserts = 0
  let deletes = 0
  let modifies = 0

  for (let i = 0; i < maxLen; i++) {
    const a = leftOps[i]
    const b = rightOps[i]

    if (!a && b) {
      inserts++
      result.push({
        type: 'insert',
        preview: opTextPreview(b),
      })
    } else if (a && !b) {
      deletes++
      result.push({
        type: 'delete',
        preview: opTextPreview(a),
      })
    } else if (a && b) {
      if (JSON.stringify(a) === JSON.stringify(b)) {
        // 保留一部分相同信息，方便理解上下文
        result.push({
          type: 'same',
          preview: opTextPreview(a),
        })
      } else {
        modifies++
        result.push({
          type: 'modify',
          preview: `${opTextPreview(a)} → ${opTextPreview(b)}`,
        })
      }
    }
  }

  changes.value = result
  stats.value = { inserts, deletes, modifies }
}

const loadExample = () => {
  if (!quillLeft || !quillRight) return

  quillLeft.setContents({
    ops: [
      { insert: '富文本编辑器示例\n', attributes: { header: 1 } },
      { insert: '这是原始文档，包含简单的格式。\n\n' },
      { insert: '功能列表：\n', attributes: { bold: true } },
      { insert: '加粗\n斜体\n下划线\n', attributes: { list: 'bullet' } },
    ],
  })

  quillRight.setContents({
    ops: [
      { insert: '富文本编辑器示例（更新版）\n', attributes: { header: 1 } },
      { insert: '这是更新后的文档，包含更多内容和格式。\n\n' },
      { insert: '功能列表：\n', attributes: { bold: true } },
      { insert: '加粗\n', attributes: { list: 'bullet' } },
      { insert: '斜体\n', attributes: { list: 'bullet', italic: true } },
      { insert: '下划线\n', attributes: { list: 'bullet', underline: true } },
      { insert: '删除线\n', attributes: { list: 'bullet', strike: true } },
    ],
  })

  compareDelta()
}

const clearAll = () => {
  if (quillLeft) quillLeft.setContents({ ops: [] })
  if (quillRight) quillRight.setContents({ ops: [] })
  changes.value = []
  stats.value = { inserts: 0, deletes: 0, modifies: 0 }
}

const getChangeClass = (type) => {
  if (type === 'insert') return 'diff-added'
  if (type === 'delete') return 'diff-removed'
  if (type === 'modify') return 'diff-info'
  return 'diff-unchanged'
}
</script>

<style scoped>
.quill-editor {
  border: 1px solid #ddd;
  border-radius: 4px;
  background: #fff;
  min-height: 220px;
}

:deep(.ql-toolbar) {
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
}

:deep(.ql-container) {
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
  min-height: 180px;
}
</style>

