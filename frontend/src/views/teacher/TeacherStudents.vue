<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { getStudents, type Student } from '@/api/teacher'

const students = ref<Student[]>([])
const loading = ref(true)

onMounted(async () => {
  try {
    students.value = await getStudents()
  } finally {
    loading.value = false
  }
})

const searchQuery = ref('')

const filteredStudents = computed(() => {
  if (!searchQuery.value.trim()) return students.value
  const q = searchQuery.value.trim().toLowerCase()
  return students.value.filter(s =>
    s.id.toLowerCase().includes(q) || s.name.toLowerCase().includes(q),
  )
})
</script>

<template>
  <div class="students-page">
    <div class="page-header">
      <h1>学生数据</h1>
    </div>

    <div class="filter-bar">
      <el-input
        v-model="searchQuery"
        placeholder="搜索学号或姓名"
        size="default"
        style="width: 240px"
        clearable
      />
      <span class="filter-count">共 {{ filteredStudents.length }} 名学生</span>
    </div>

    <el-table :data="filteredStudents" stripe style="width: 100%">
      <el-table-column prop="id" label="学号" width="120" />
      <el-table-column prop="name" label="姓名" width="100" />
      <el-table-column prop="major" label="专业" width="140" />
      <el-table-column label="学习进度" min-width="160">
        <template #default="{ row }">
          <div class="progress-cell">
            <el-progress :percentage="row.progress" :stroke-width="6" :show-text="false"
                         color="var(--color-learn)" style="flex: 1" />
            <span class="progress-text">{{ row.progress }}%</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="exercises" label="练习题数" width="100" align="center" />
      <el-table-column label="正确率" width="100" align="center">
        <template #default="{ row }">
          <span :style="{ color: row.accuracy >= 80 ? '#10b981' : row.accuracy >= 70 ? '#f59e0b' : '#ef4444' }">
            {{ row.accuracy }}%
          </span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<style scoped>
.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-xl);
}

.page-header h1 {
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--color-text);
}

.filter-bar {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  margin-bottom: var(--space-lg);
}

.filter-count {
  font-size: 0.85rem;
  color: var(--color-text-muted);
}

.progress-cell {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
}

.progress-text {
  font-size: 0.8rem;
  color: var(--color-text-muted);
  min-width: 36px;
}
</style>
