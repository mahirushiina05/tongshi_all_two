<script setup lang="ts">
import { computed } from 'vue'
import { resolveFileUrl } from '@/utils/url'

const props = defineProps<{
  visible: boolean
  title?: string
  url?: string
  fileId?: number
}>()

const emit = defineEmits<{ (e: 'update:visible', val: boolean): void }>()

const dialogVisible = computed({
  get: () => props.visible,
  set: (val) => emit('update:visible', val),
})

const previewUrl = computed(() => {
  if (props.fileId) return resolveFileUrl(`/api/files/${props.fileId}`)
  if (props.url) return resolveFileUrl(props.url)
  return ''
})

function openInNewWindow() {
  if (previewUrl.value) window.open(previewUrl.value, '_blank')
}
</script>

<template>
  <el-dialog
    v-model="dialogVisible"
    :title="title || '资料预览'"
    width="80%"
    top="5vh"
    destroy-on-close
  >
    <div v-if="previewUrl" class="preview-container">
      <iframe :src="previewUrl" class="pdf-iframe" />
    </div>
    <div v-else class="preview-empty">暂无可预览的文件。</div>
    <template #footer>
      <el-button @click="openInNewWindow">新窗口打开</el-button>
      <el-button @click="dialogVisible = false">关闭</el-button>
    </template>
  </el-dialog>
</template>

<style scoped>
.preview-container {
  width: 100%;
  height: 70vh;
}

.pdf-iframe {
  width: 100%;
  height: 100%;
  border: none;
}

.preview-empty {
  text-align: center;
  padding: 40px 0;
  color: #999;
}
</style>
