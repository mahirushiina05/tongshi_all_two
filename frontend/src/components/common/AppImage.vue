<script setup lang="ts">
import { ref } from 'vue'

defineProps<{
  src: string
  alt?: string
  fit?: 'cover' | 'contain' | 'fill'
}>()

const failed = ref(false)
</script>

<template>
  <div class="app-image-wrapper">
    <img
      v-if="!failed && src"
      :src="src"
      :alt="alt || ''"
      :style="{ objectFit: fit || 'cover' }"
      @error="failed = true"
    />
    <div v-else class="image-fallback">
      <span>图片加载失败</span>
    </div>
  </div>
</template>

<style scoped>
.app-image-wrapper {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.app-image-wrapper img {
  width: 100%;
  height: 100%;
  display: block;
}

.image-fallback {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  min-height: 80px;
  background: var(--color-bg-card, #f5f5f5);
  color: var(--color-text-muted, #999);
  font-size: 0.85rem;
}
</style>
