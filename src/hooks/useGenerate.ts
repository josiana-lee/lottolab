import { useMutation } from '@tanstack/react-query'
import { GeneratedCombo } from '@/types/lotto'

export function useGenerate() {
  return useMutation<{ combos: GeneratedCombo[] }, Error>({
    mutationFn: async () => {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ count: 5 }),
      })
      const body = await res.json()
      if (!res.ok) throw new Error(body.error ?? '생성 실패')
      return body
    },
  })
}
