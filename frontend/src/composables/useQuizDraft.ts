/** 答题进度草稿本地保存与恢复。 */
export interface QuizDraft {
  courseId: number
  currentQuestionId: number | null
  answeredQuestionIds: number[]
  answers: Record<number, string>
  results?: Record<number, boolean>
  updatedAt: number
}

const key = (courseId: number) => `quiz-draft:${courseId}`

export function loadQuizDraft(courseId: number): QuizDraft | null {
  const raw = localStorage.getItem(key(courseId))
  if (!raw) return null
  try {
    return JSON.parse(raw) as QuizDraft
  } catch {
    localStorage.removeItem(key(courseId))
    return null
  }
}

export function saveQuizDraft(draft: QuizDraft) {
  localStorage.setItem(key(draft.courseId), JSON.stringify({ ...draft, updatedAt: Date.now() }))
}

export function clearQuizDraft(courseId: number) {
  localStorage.removeItem(key(courseId))
}
