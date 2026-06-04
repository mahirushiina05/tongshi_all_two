import http from './http'
import type { AxiosProgressEvent } from 'axios'

export interface UploadResult {
  file_id: number
  url: string
  filename: string
  size: number
  content_type: string
  storage_provider: string
}

export function uploadFile(
  file: File,
  bizType: string = 'upload',
  onProgress?: (percent: number) => void,
) {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('biz_type', bizType)
  return http.post<any, UploadResult>('/upload', formData, {
    onUploadProgress: onProgress
      ? (e: AxiosProgressEvent) => {
          if (e.total) {
            onProgress(Math.round((e.loaded / e.total) * 100))
          }
        }
      : undefined,
  })
}
