import http from './http'

export interface Chapter {
  id: number
  num: string
  title: string
  desc: string
  topics: string[]
  status: string
  videos: number
  docs: number
  progress: number
  types: { name: string; icon: string; count: number }[]
  total: number
  done: number
  accuracy: number
}

export function getChapters() {
  return http.get<any, Chapter[]>('/chapters')
}

export function getChapterContents(chapterId: number) {
  return http.get<any, any[]>(`/chapters/${chapterId}/contents`)
}
