import { useMutation, useQueryClient } from '@tanstack/react-query'
import { SyncResult } from '@/types/lotto'

export function useSync() {
  const queryClient = useQueryClient()

  return useMutation<SyncResult, Error>({
    mutationFn: async () => {
      const res = await fetch('/api/draws/sync')
      const body = await res.json()
      if (!res.ok) throw new Error(body.error ?? '동기화 실패')
      return body
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stats'] })
      queryClient.invalidateQueries({ queryKey: ['saved-combos'] })
    },
  })
}
