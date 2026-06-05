export interface QuestionSelectionRow {
  id: number
}

export function syncVisibleSelectedQuestionIds(
  currentIds: number[],
  visibleRows: QuestionSelectionRow[],
  selectedRows: QuestionSelectionRow[],
) {
  const visibleIds = new Set(visibleRows.map(item => item.id))
  const selectedVisibleIds = new Set(selectedRows.map(item => item.id))
  const next = currentIds.filter(id => !visibleIds.has(id) || selectedVisibleIds.has(id))

  selectedRows.forEach(item => {
    if (!next.includes(item.id)) {
      next.push(item.id)
    }
  })

  return next
}

export function appendSelectedQuestionIds(currentIds: number[], ids: number[]) {
  const next = new Set(currentIds)
  ids.forEach(id => next.add(id))
  return Array.from(next)
}

export function removeSelectedQuestionId(currentIds: number[], id: number) {
  return currentIds.filter(item => item !== id)
}
