<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { getCourses, type Course } from '@/api/course'
import { getAnnouncements, type Announcement } from '@/api/announcement'

const router = useRouter()
const courses = ref<Course[]>([])
const announcements = ref<Announcement[]>([])
const loading = ref(true)
const selectedCourseId = ref<number | ''>('')
const selectedAnnouncementId = ref<number | ''>('')

async function loadData() {
  loading.value = true
  try {
    const [c, a] = await Promise.all([
      getCourses(),
      getAnnouncements(),
    ])
    courses.value = c
    announcements.value = a
  } finally {
    loading.value = false
  }
}

onMounted(loadData)

const filteredAnnouncements = computed(() => {
  let list = announcements.value
  if (selectedCourseId.value) {
    list = list.filter(a => a.course_id === selectedCourseId.value)
  }
  return list
})

// 思页面只显示已加入的课程（非公共课程），不显示未加入的公共课程
const enrolledCourses = computed(() => courses.value.filter(c => !c.is_public))

const courseGroups = computed(() => {
  const map = new Map<number, { course: Course; items: Announcement[] }>()
  for (const course of enrolledCourses.value) {
    map.set(course.id, { course, items: [] })
  }
  for (const a of announcements.value) {
    const group = map.get(a.course_id)
    if (group) {
      group.items.push(a)
    } else {
      map.set(a.course_id, {
        course: { id: a.course_id, name: a.course_name } as Course,
        items: [a],
      })
    }
  }
  return [...map.values()]
})

const filteredGroups = computed(() => {
  let groups = courseGroups.value
  if (selectedCourseId.value) {
    groups = groups.filter(g => g.course.id === selectedCourseId.value)
  }
  if (selectedAnnouncementId.value) {
    groups = groups.map(g => ({
      ...g,
      items: g.items.filter(a => a.id === selectedAnnouncementId.value),
    })).filter(g => g.items.length > 0)
  }
  return groups
})

function onCourseChange() {
  selectedAnnouncementId.value = ''
}

function getStatus(item: Announcement): { text: string; cls: string } {
  if (item.is_completed) return { text: '已完成', cls: 'done' }
  if (item.end_time && new Date(item.end_time) < new Date()) return { text: '已过期', cls: 'expired' }
  return { text: '未完成', cls: 'pending' }
}

function goToQuiz(item: Announcement) {
  if (item.question_ids.length === 0) return
  router.push(
    `/practice/quiz/${item.course_id}?question_ids=${item.question_ids.join(',')}&announcement_id=${item.id}`,
  )
}
</script>

<template>
  <div class="practice-page">
    <section class="page-hero">
      <div class="container">
        <div class="hero-inner">
          <div class="hero-icon">思</div>
          <h1>思 · 深化理解</h1>
          <p>选择题库作业，即时作答查看解析。</p>
        </div>
      </div>
    </section>

    <section class="content-section">
      <div class="container">
        <div class="filter-bar">
          <el-select
            v-model="selectedCourseId"
            placeholder="全部课程"
            clearable
            size="default"
            style="width: 220px"
            @change="onCourseChange"
          >
            <el-option
              v-for="c in enrolledCourses"
              :key="c.id"
              :label="c.name"
              :value="c.id"
            />
          </el-select>
          <el-select
            v-model="selectedAnnouncementId"
            placeholder="全部作业"
            clearable
            size="default"
            style="width: 260px"
          >
            <el-option
              v-for="a in filteredAnnouncements"
              :key="a.id"
              :label="`${a.title}（${getStatus(a).text}）`"
              :value="a.id"
            />
          </el-select>
        </div>

        <div v-if="loading" class="empty-state">加载中...</div>

        <template v-else>
          <div
            v-for="group in filteredGroups"
            :key="group.course.id"
            class="course-block"
          >
            <div class="course-header" @click="router.push(`/learn/course/${group.course.id}`)">
              <h2>{{ group.course.name }}</h2>
              <span class="course-meta">{{ group.items.length }} 份作业</span>
            </div>

            <div v-if="group.items.length > 0" class="assignment-list">
              <div
                v-for="item in group.items"
                :key="item.id"
                class="assignment-row"
              >
                <div class="assignment-info">
                  <span class="assignment-title">{{ item.title }}</span>
                  <span class="assignment-status" :class="getStatus(item).cls">
                    {{ getStatus(item).text }}
                  </span>
                </div>
                <button
                  class="go-btn"
                  @click="goToQuiz(item)"
                >去练习</button>
              </div>
            </div>
          </div>

          <div v-if="filteredGroups.length === 0" class="empty-state">
            暂无作业，请等待教师发布。
          </div>
        </template>
      </div>
    </section>
  </div>
</template>

<style scoped>
.practice-page {
  padding-top: 60px;
}

.page-hero {
  padding: var(--space-3xl) 0 var(--space-2xl);
  background: var(--color-practice-bg);
  border-bottom: 1px solid var(--color-border-light);
}

.hero-inner {
  text-align: center;
}

.hero-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  background: var(--color-practice);
  border-radius: var(--radius-md);
  color: white;
  font-family: var(--font-serif);
  font-size: 1.3rem;
  font-weight: 900;
  margin-bottom: var(--space-lg);
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.15);
}

.hero-inner h1 {
  font-family: var(--font-serif);
  font-size: 1.8rem;
  font-weight: 900;
  color: var(--color-text);
  margin-bottom: var(--space-sm);
  letter-spacing: 0.05em;
}

.hero-inner p {
  font-size: 0.92rem;
  color: var(--color-text-secondary);
}

.content-section {
  padding: var(--space-2xl) 0 var(--space-3xl);
  max-width: 800px;
  margin: 0 auto;
}

.filter-bar {
  display: flex;
  gap: var(--space-md);
  margin-bottom: var(--space-xl);
}

.course-block {
  margin-bottom: var(--space-xl);
}

.course-header {
  display: flex;
  align-items: baseline;
  gap: var(--space-md);
  padding-bottom: var(--space-sm);
  margin-bottom: var(--space-sm);
  border-bottom: 2px solid var(--color-practice);
  cursor: pointer;
}

.course-header h2 {
  font-family: var(--font-serif);
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--color-text);
  letter-spacing: 0.03em;
}

.course-meta {
  font-size: 0.8rem;
  color: var(--color-text-muted);
}

.assignment-list {
  display: flex;
  flex-direction: column;
}

.assignment-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-md) var(--space-lg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  margin-bottom: var(--space-xs);
  background: var(--color-bg-card);
  transition: background var(--duration-fast);
}

.assignment-row:hover {
  background: var(--color-bg-alt);
}

.assignment-info {
  display: flex;
  align-items: center;
  gap: var(--space-md);
}

.assignment-title {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--color-text);
}

.assignment-status {
  font-size: 0.75rem;
  font-weight: 600;
  padding: 2px 10px;
  border-radius: var(--radius-full);
}

.assignment-status.done {
  color: #10b981;
  background: rgba(16, 185, 129, 0.1);
}

.assignment-status.pending {
  color: #f59e0b;
  background: rgba(245, 158, 11, 0.1);
}

.assignment-status.expired {
  color: #ef4444;
  background: rgba(239, 68, 68, 0.1);
}

.go-btn {
  padding: 6px 20px;
  font-size: 0.85rem;
  font-weight: 600;
  color: white;
  background: var(--color-practice);
  border-radius: var(--radius-full);
  transition: all var(--duration-fast);
}

.go-btn:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

.empty-state {
  text-align: center;
  padding: var(--space-4xl) 0;
  color: var(--color-text-muted);
  font-size: 0.9rem;
}
</style>
