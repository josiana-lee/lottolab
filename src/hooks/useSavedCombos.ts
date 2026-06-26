import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { SavedComboRecord } from '@/types/lotto'

const QK = ['saved-combos'] as const

export function useSavedCombos() {
  return useQuery<{ savedCombos: SavedComboRecord[] }>({
    queryKey: QK,
    queryFn: async () => {
      const res = await fetch('/api/saved-combos')
      const body = await res.json()
      if (!res.ok) throw new Error(body.error ?? '조회 실패')
      return body
    },
  })
}

export function useSaveCombo() {
  const queryClient = useQueryClient()

  return useMutation<{ savedCombo: SavedComboRecord }, Error, { numbers: number[]; score?: number }>({
    mutationFn: async data => {
      const res = await fetch('/api/saved-combos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const body = await res.json()
      if (!res.ok) throw new Error(body.error ?? '저장 실패')
      return body
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QK }),
  })
}

export function useDeleteCombo() {
  const queryClient = useQueryClient()

  return useMutation<void, Error, number>({
    mutationFn: async id => {
      const res = await fetch(`/api/saved-combos/${id}`, { method: 'DELETE' })
      const body = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(body.error ?? '삭제 실패')
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QK }),
  })
}
