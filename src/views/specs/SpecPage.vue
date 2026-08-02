<template>
  <div class="spec-page">
    <div class="spec-card">
      <header class="doc-header">
        <div class="banner-accent"></div>
        <div class="doc-title-wrap">
          <div class="doc-icon" :style="iconStyle">
            <el-icon><component :is="icon" /></el-icon>
          </div>
          <div class="doc-title">
            <h1>{{ currentSpec?.title }}</h1>
            <p class="doc-sub">
              研发规范文档库 · <span class="meta-file">{{ currentSpec?.file }}.md</span>
            </p>
          </div>
        </div>

        <div class="doc-actions">
          <div v-if="meta" class="doc-meta">
            <span v-if="meta.version" class="meta-item">
              <el-icon><Clock /></el-icon>{{ meta.version }}
            </span>
            <span v-if="meta.date" class="meta-item">
              <el-icon><Calendar /></el-icon>{{ meta.date }}
            </span>
            <el-tag
              v-if="meta.status"
              size="small"
              :type="statusType"
              effect="dark"
              class="status-tag"
            >
              <el-icon class="status-icon"><component :is="statusIcon" /></el-icon>
              {{ meta.status }}
            </el-tag>
          </div>
          <el-button :icon="copyDone ? Check : CopyDocument" :type="copyDone ? 'success' : 'primary'" @click="copyContent">
            {{ copyDone ? '已复制' : '复制纯正文' }}
          </el-button>
        </div>
      </header>

      <div class="doc-body" v-html="html" @click="onDocClick"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { CopyDocument, Clock, Calendar, CircleCheck, WarningFilled, Check } from '@element-plus/icons-vue'
import MarkdownIt from 'markdown-it'
import { getSpecByKey, specList, specIcon } from './specs'

const route = useRoute()

const currentKey = computed(() => (route.params.key as string) || specList[0]?.key)
const currentSpec = computed(() => getSpecByKey(currentKey.value))
const meta = computed(() => currentSpec.value?.meta)

const icon = computed(() => specIcon(currentKey.value))

const isPublished = computed(() => meta.value?.status?.includes('正式') ?? true)
const statusType = computed<'success' | 'warning' | 'info'>(() =>
  isPublished.value ? 'success' : meta.value?.status?.includes('草稿') ? 'warning' : 'info'
)
const statusIcon = computed(() => (isPublished.value ? CircleCheck : WarningFilled))

const iconStyle = computed(() => {
  const map: Record<string, string> = {
    logging: 'linear-gradient(135deg,#4facfe,#00f2fe)',
    'error-handling': 'linear-gradient(135deg,#fa709a,#fee140)',
    'database-design': 'linear-gradient(135deg,#43e97b,#38f9d7)',
    'api-design': 'linear-gradient(135deg,#5ee7df,#b490ca)',
    metrics: 'linear-gradient(135deg,#a18cd1,#fbc2eb)',
    signing: 'linear-gradient(135deg,#f6d365,#fda085)',
    'inter-service': 'linear-gradient(135deg,#30cfd0,#330867)',
    'message-queue': 'linear-gradient(135deg,#fc5c7d,#6a82fb)'
  }
  return { background: map[currentKey.value] || 'linear-gradient(135deg,#4facfe,#00f2fe)' }
})

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: false
})

/** 生成与目录锚点一致的 heading id（去标点、转小写、空格转中划线） */
function slugifyId(text: string): string {
  return text
    .toLowerCase()
    .replace(/[、。·，,：:；;！!？?\.#"'()（）【】[]%&*]+/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

/** 给标题补充 id，让目录链接可锚定 */
const defaultHeadingOpen = md.renderer.rules.heading_open
md.renderer.rules.heading_open = (tokens: any[], idx: number, options: any, env: any, self: any) => {
  const contentIdx = idx + 1
  const inline = tokens[contentIdx]
  const rawText = inline ? inline.content : ''
  const id = slugifyId(rawText)
  tokens[idx].attrSet('id', id)
  return defaultHeadingOpen
    ? defaultHeadingOpen(tokens, idx, options, env, self)
    : self.renderToken(tokens, idx, options)
}

/** 给代码块包裹工具条 + 复制按钮 */
const defaultFence = md.renderer.rules.fence
md.renderer.rules.fence = (tokens: any[], idx: number, options: any, env: any, self: any) => {
  const token = tokens[idx]
  const code = token.content ?? ''
  const lang = token.info ? token.info.trim().split(/\s+/)[0] : ''
  const encoded = window.btoa(unescape(encodeURIComponent(code)))
  const langLabel = lang ? `<span class="code-lang">${lang}</span>` : ''
  const copyBtn = `<button type="button" class="copy-code" data-code="${encoded}"><span>复制代码</span></button>`
  const codeBlock = defaultFence
    ? defaultFence(tokens, idx, options, env, self)
    : self.renderToken(tokens, idx, options)
  return `<div class="code-block"><div class="code-head">${langLabel}${copyBtn}</div>${codeBlock}</div>`
}

const html = computed(() => (currentSpec.value ? md.render(currentSpec.value.body) : ''))

/** 文档内交互：目录锚点滚动 + 代码复制 */
function onDocClick(e: MouseEvent) {
  const target = e.target as HTMLElement
  if (!target) return
  if (target.closest('.copy-code')) {
    const btn = target.closest('.copy-code') as HTMLButtonElement
    const code = decodeURIComponent(escape(atob(btn.dataset.code || '')))
    navigator.clipboard
      .writeText(code)
      .then(() => {
        btn.textContent = '已复制'
        btn.classList.add('copied')
        setTimeout(() => {
          btn.textContent = '复制代码'
          btn.classList.remove('copied')
        }, 1500)
      })
      .catch(() => ElMessage.warning('复制失败'))
    return
  }

  const link = target.closest('a[href^="#"]') as HTMLAnchorElement | null
  if (link) {
    e.preventDefault()
    const id = decodeURIComponent(link.getAttribute('href')!.slice(1))
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    else ElMessage.info('未找到对应章节')
  }
}

const copyDone = ref(false)
const copyContent = () => {
  if (!currentSpec.value) return
  navigator.clipboard
    .writeText(currentSpec.value.body)
    .then(() => {
      copyDone.value = true
      ElMessage.success('已复制纯正文')
      setTimeout(() => (copyDone.value = false), 2000)
    })
    .catch(() => ElMessage.warning('复制失败，请手动复制'))
}
</script>

<style scoped lang="scss">
.spec-page {
  flex: 1;
  min-width: 0;
  overflow: auto;
}

.spec-card {
  position: relative;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(31, 45, 61, 0.06);
  border: 1px solid #ebeef5;
  min-height: 100%;
  overflow: hidden;
}

/* ============ 顶部标题区 ============ */
.doc-header {
  position: relative;
  overflow: hidden;
  padding: 26px 30px 22px;
  border-bottom: 1px solid #f0f2f5;
  background:
    radial-gradient(600px 120px at -10% -40%, rgba(64, 158, 255, 0.12), transparent 60%),
    radial-gradient(500px 120px at 110% -60%, rgba(103, 194, 58, 0.08), transparent 60%),
    linear-gradient(180deg, #fbfcff, #fff);

  .banner-accent {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 6px;
    background: linear-gradient(180deg, #409eff, #67c23a, #e6a23c);
    border-radius: 0 4px 4px 0;
  }

  .doc-title-wrap {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .doc-icon {
    flex-shrink: 0;
    width: 56px;
    height: 56px;
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28px;
    color: #fff;
    box-shadow: 0 8px 20px rgba(64, 158, 255, 0.28);
  }

  .doc-title {
    h1 {
      margin: 0;
      font-size: 24px;
      font-weight: 700;
      color: #1f2d3d;
      letter-spacing: 0.5px;
    }

    .doc-sub {
      margin: 6px 0 0;
      font-size: 13px;
      color: #909399;

      .meta-file {
        font-family: 'SF Mono', 'JetBrains Mono', Menlo, Consolas, monospace;
        color: #409eff;
      }
    }
  }

  .doc-actions {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    flex-wrap: wrap;
    margin-top: 20px;
    padding-top: 18px;
    border-top: 1px dashed #e9eef5;
  }

  .doc-meta {
    display: flex;
    align-items: center;
    gap: 20px;
    flex-wrap: wrap;

    .meta-item {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 13px;
      color: #606266;

      .el-icon {
        color: #409eff;
      }
    }

    .status-tag {
      font-weight: 500;
      letter-spacing: 0.5px;

      .meta-icon {
        margin-right: 3px;
      }
    }
  }
}

/* ============ Markdown 排版 ============ */
.doc-body {
  padding: 12px 28px 52px;
  font-size: 14px;
  line-height: 1.8;
  color: #303133;

  :deep(h1) {
    font-size: 24px;
    font-weight: 700;
    color: #0b3d91;
    margin: 28px 0 16px;
    padding-bottom: 12px;
    border-bottom: 2px solid #eef1f6;
  }

  :deep(h2) {
    font-size: 19px;
    font-weight: 700;
    color: #1f3c70;
    margin: 26px 0 12px;
    padding-left: 12px;
    border-left: 4px solid #409eff;
  }

  :deep(h3) {
    font-size: 16px;
    font-weight: 600;
    color: #303133;
    margin: 20px 0 10px;
  }

  :deep(h4) {
    font-size: 15px;
    font-weight: 600;
    color: #303133;
    margin: 16px 0 8px;
  }

  :deep(p) {
    margin: 10px 0;
  }

  :deep(a) {
    color: #409eff;
    text-decoration: none;
  }

  :deep(ul),
  :deep(ol) {
    padding-left: 22px;
    margin: 10px 0;
  }

  :deep(li) {
    margin: 4px 0;
  }

  :deep(strong) {
    color: #1f3c70;
  }

  :deep(code) {
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 13px;
    background: #f2f5fb;
    color: #c7254e;
  }

  /* 代码块容器 + 工具条 */
  :deep(.code-block) {
    margin: 16px 0;
    border-radius: 10px;
    overflow: hidden;
    border: 1px solid #1e293b;
    background: #0f172a;

    .code-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      padding: 8px 14px;
      background: #1e293b;
      border-bottom: 1px solid #334155;

      .code-lang {
        font-size: 12px;
        color: #94a3b8;
        letter-spacing: 0.5px;
        font-family: 'SF Mono', 'JetBrains Mono', Menlo, Consolas, monospace;
        text-transform: uppercase;
      }

      .copy-code {
        display: inline-flex;
        align-items: center;
        gap: 5px;
        padding: 3px 12px;
        font-size: 12px;
        color: #cbd5e1;
        background: #334155;
        border: 1px solid #475569;
        border-radius: 6px;
        cursor: pointer;
        transition: 0.2s;

        &:hover {
          background: #475569;
          color: #fff;
        }

        &.copied {
          color: #67c23a;
          border-color: #67c23a;
          background: rgba(103, 194, 58, 0.12);
        }
      }
    }

    pre {
      margin: 0;
      padding: 14px 16px;
      overflow: auto;
      border: none;
      border-radius: 0;
      background: transparent;
    }
  }

  :deep(pre) {
    background: #0f172a;
    color: #e2e8f0;
    border-radius: 10px;
    padding: 16px 18px;
    overflow: auto;
    margin: 14px 0;

    code {
      display: block;
      background: transparent;
      color: inherit;
      padding: 0;
      font-size: 13px;
      line-height: 1.6;
      white-space: pre;
    }
  }

  :deep(h1),
  :deep(h2),
  :deep(h3),
  :deep(h4) {
    scroll-margin-top: 24px;
  }

  :deep(blockquote) {
    margin: 14px 0;
    padding: 10px 16px;
    border-left: 4px solid #409eff;
    background: #f0f6ff;
    border-radius: 0 8px 8px 0;
    color: #33466e;

    p {
      margin: 4px 0;
    }
  }

  /* 表格 */
  :deep(table) {
    width: 100%;
    border-collapse: collapse;
    margin: 14px 0;
    font-size: 13px;
    display: block;
    overflow-x: auto;
  }

  :deep(th),
  :deep(td) {
    border: 1px solid #e4e7ed;
    padding: 9px 12px;
    text-align: left;
    white-space: nowrap;
  }

  :deep(th) {
    background: #f5f7fa;
    color: #303133;
    font-weight: 600;
  }

  :deep(tbody tr) {
    &:hover {
      background: #fafbfc;
    }
  }

  :deep(hr) {
    border: none;
    border-top: 1px solid #e4e7ed;
    margin: 22px 0;
  }

  :deep(strong) {
    color: #1f3c70;
  }

  :deep(em) {
    color: #909399;
  }
}
</style>