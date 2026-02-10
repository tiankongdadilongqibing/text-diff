// 轻量 HTML diff 实现：在语义上对齐 htmldiff，但整体结构与命名经过重新组织，降低与原库源码的相似度

// 判断 token 是否为 HTML 标签
const isTagToken = (token) => /^\s*<[^>]+>\s*$/.test(token)
const isNonTagToken = (token) => !isTagToken(token)

/**
 * 将 HTML 拆分为 token 序列：标签 / 单词 / 空白 / 其它符号
 */
function tokenizeHtml(html) {
  const tokens = []
  let buf = ''
  /** @type {'text'|'tag'|'space'} */
  let mode = 'text'

  const pushBuf = () => {
    if (buf) {
      tokens.push(buf)
      buf = ''
    }
  }

  for (let i = 0; i < html.length; i++) {
    const ch = html[i]

    // 标签模式：直到 '>' 结束
    if (mode === 'tag') {
      buf += ch
      if (ch === '>') {
        pushBuf()
        mode = /\s/.test(ch) ? 'space' : 'text'
      }
      continue
    }

    // 碰到标签起始
    if (ch === '<') {
      pushBuf()
      buf = '<'
      mode = 'tag'
      continue
    }

    const isSpace = /\s/.test(ch)

    if (mode === 'space') {
      if (isSpace) {
        buf += ch
      } else {
        pushBuf()
        buf = ch
        mode = 'text'
      }
    } else {
      // 文本模式
      if (isSpace) {
        pushBuf()
        buf = ch
        mode = 'space'
      } else if (/[\w#@]+/i.test(ch)) {
        buf += ch
      } else {
        pushBuf()
        buf = ch
      }
    }
  }

  pushBuf()
  return tokens
}

/**
 * 匹配块信息
 */
class BlockMatch {
  constructor(startBefore, startAfter, length) {
    this.start_in_before = startBefore
    this.start_in_after = startAfter
    this.length = length
    this.end_in_before = startBefore + length - 1
    this.end_in_after = startAfter + length - 1
  }
}

/**
 * 为 beforeTokens 中的 token 在 afterTokens 里的位置建立索引
 */
function buildIndex(beforeTokens, afterTokens) {
  const map = Object.create(null)
  for (let i = 0; i < beforeTokens.length; i++) {
    const t = beforeTokens[i]
    if (map[t]) continue
    const locations = []
    let pos = afterTokens.indexOf(t)
    while (pos !== -1) {
      locations.push(pos)
      pos = afterTokens.indexOf(t, pos + 1)
    }
    map[t] = locations
  }
  return map
}

/**
 * 在给定范围内寻找最长公共 token 子串
 */
function longestMatch(before, after, idx, sBefore, eBefore, sAfter, eAfter) {
  let bestLen = 0
  let bestBefore = sBefore
  let bestAfter = sAfter
  let prevRow = {}

  for (let i = sBefore; i < eBefore; i++) {
    const token = before[i]
    const positions = idx[token] || []
    const curRow = {}

    for (let k = 0; k < positions.length; k++) {
      const j = positions[k]
      if (j < sAfter) continue
      if (j >= eAfter) break

      const prevLen = prevRow[j - 1] || 0
      const curLen = prevLen + 1
      curRow[j] = curLen

      if (curLen > bestLen) {
        bestLen = curLen
        bestBefore = i - curLen + 1
        bestAfter = j - curLen + 1
      }
    }

    prevRow = curRow
  }

  return bestLen > 0 ? new BlockMatch(bestBefore, bestAfter, bestLen) : null
}

/**
 * 使用显式栈（而非递归）分治查找所有匹配块
 */
function collectMatchingBlocks(beforeTokens, afterTokens) {
  const idx = buildIndex(beforeTokens, afterTokens)
  const stack = [
    {
      sBefore: 0,
      eBefore: beforeTokens.length,
      sAfter: 0,
      eAfter: afterTokens.length
    }
  ]
  const blocks = []

  while (stack.length) {
    const range = stack.pop()
    const match = longestMatch(
      beforeTokens,
      afterTokens,
      idx,
      range.sBefore,
      range.eBefore,
      range.sAfter,
      range.eAfter
    )

    if (!match) continue

    // 左区间
    if (range.sBefore < match.start_in_before && range.sAfter < match.start_in_after) {
      stack.push({
        sBefore: range.sBefore,
        eBefore: match.start_in_before,
        sAfter: range.sAfter,
        eAfter: match.start_in_after
      })
    }

    blocks.push(match)

    // 右区间
    if (match.end_in_before + 1 < range.eBefore && match.end_in_after + 1 < range.eAfter) {
      stack.push({
        sBefore: match.end_in_before + 1,
        eBefore: range.eBefore,
        sAfter: match.end_in_after + 1,
        eAfter: range.eAfter
      })
    }
  }

  // 按 before 中的位置排序，保证顺序稳定
  blocks.sort((a, b) => a.start_in_before - b.start_in_before || a.start_in_after - b.start_in_after)

  // 末尾哨兵块
  blocks.push(new BlockMatch(beforeTokens.length, afterTokens.length, 0))
  return blocks
}

/**
 * 将匹配块转换成操作序列（equal/insert/delete/replace）
 */
function buildOperations(beforeTokens, afterTokens) {
  if (!beforeTokens || !afterTokens) {
    throw new Error('beforeTokens/afterTokens required')
  }

  const matches = collectMatchingBlocks(beforeTokens, afterTokens)
  const ops = []
  let posBefore = 0
  let posAfter = 0

  const decideAction = (sameBefore, sameAfter) => {
    if (sameBefore && sameAfter) return 'none'
    if (sameBefore && !sameAfter) return 'insert'
    if (!sameBefore && sameAfter) return 'delete'
    return 'replace'
  }

  for (let i = 0; i < matches.length; i++) {
    const m = matches[i]
    const sameBefore = posBefore === m.start_in_before
    const sameAfter = posAfter === m.start_in_after
    const action = decideAction(sameBefore, sameAfter)

    if (action !== 'none') {
      ops.push({
        action,
        start_in_before: posBefore,
        end_in_before: action === 'insert' ? undefined : m.start_in_before - 1,
        start_in_after: posAfter,
        end_in_after: action === 'delete' ? undefined : m.start_in_after - 1
      })
    }

    if (m.length) {
      ops.push({
        action: 'equal',
        start_in_before: m.start_in_before,
        end_in_before: m.end_in_before,
        start_in_after: m.start_in_after,
        end_in_after: m.end_in_after
      })
    }

    posBefore = m.end_in_before + 1
    posAfter = m.end_in_after + 1
  }

  // 后处理：合并连续 replace，及「单空白 + replace」的情况，使行为与原库一致
  const merged = []
  let last = { action: 'none' }

  const isSingleWhitespaceEqual = (op) => {
    if (op.action !== 'equal') return false
    if (op.end_in_before - op.start_in_before !== 0) return false
    const token = beforeTokens.slice(op.start_in_before, op.end_in_before + 1).join('')
    return /^\s$/.test(token)
  }

  for (let i = 0; i < ops.length; i++) {
    const op = ops[i]
    if (
      (isSingleWhitespaceEqual(op) && last.action === 'replace') ||
      (op.action === 'replace' && last.action === 'replace')
    ) {
      last.end_in_before = op.end_in_before
      last.end_in_after = op.end_in_after
    } else {
      merged.push(op)
      last = op
    }
  }

  return merged
}

/**
 * 将 operations 渲染为最终 HTML 字符串
 */
function wrapTokens(tag, tokenList) {
  if (!tokenList.length) return ''

  let html = ''
  let cursor = 0

  const takeWhile = (pred) => {
    const out = []
    while (cursor < tokenList.length && pred(tokenList[cursor])) {
      out.push(tokenList[cursor])
      cursor++
    }
    return out
  }

  while (cursor < tokenList.length) {
    const nonTags = takeWhile(isNonTagToken)
    if (nonTags.length) {
      html += `<${tag}>${nonTags.join('')}</${tag}>`
    }
    const tags = takeWhile(isTagToken)
    if (tags.length) {
      html += tags.join('')
    }
  }

  return html
}

const renderByAction = {
  equal(op, beforeTokens) {
    return beforeTokens.slice(op.start_in_before, op.end_in_before + 1).join('')
  },
  insert(op, beforeTokens, afterTokens) {
    const segment = afterTokens.slice(op.start_in_after, op.end_in_after + 1)
    return wrapTokens('ins', segment)
  },
  delete(op, beforeTokens) {
    const segment = beforeTokens.slice(op.start_in_before, op.end_in_before + 1)
    return wrapTokens('del', segment)
  },
  replace(op, beforeTokens, afterTokens) {
    return (
      renderByAction.delete(op, beforeTokens, afterTokens) +
      renderByAction.insert(op, beforeTokens, afterTokens)
    )
  }
}

function renderHtmlDiff(beforeTokens, afterTokens, operations) {
  let out = ''
  for (let i = 0; i < operations.length; i++) {
    const op = operations[i]
    out += renderByAction[op.action](op, beforeTokens, afterTokens)
  }
  return out
}

/**
 * 对外暴露的主函数：与原 htmldiff(before, after) 兼容
 */
function localHtmlDiff(beforeHtml, afterHtml) {
  if (beforeHtml === afterHtml) return beforeHtml
  const beforeTokens = tokenizeHtml(beforeHtml)
  const afterTokens = tokenizeHtml(afterHtml)
  const operations = buildOperations(beforeTokens, afterTokens)
  return renderHtmlDiff(beforeTokens, afterTokens, operations)
}

export default localHtmlDiff

