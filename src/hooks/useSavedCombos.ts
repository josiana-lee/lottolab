'use client'

import { useCallback, useEffect, useState } from 'react'
import { createComboKey } from '@/lib/combo'
import { MAX_SAVED_COMBOS } from '@/lib/constants'
import { SavedComboRecord } from '@/types/lotto'

const STORAGE_KEY = 'lotto-lab.saved-combos'
const CHANGE_EVENT = 'lotto-lab:saved-combos'

export function loadSavedCombos(): SavedComboRecord[] {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]') as SavedComboRecord[]
  } catch {
    return []
  }
}

function persist(combos: SavedComboRecord[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(combos))
  window.dispatchEvent(new Event(CHANGE_EVENT))
}

export function useSavedCombos() {
  const [savedCombos, setSavedCombos] = useState<SavedComboRecord[]>([])

  useEffect(() => {
    setSavedCombos(loadSavedCombos())
    const sync = () => setSavedCombos(loadSavedCombos())
    window.addEventListener(CHANGE_EVENT, sync)
    return () => window.removeEventListener(CHANGE_EVENT, sync)
  }, [])

  return { data: { savedCombos } }
}

export function useSaveCombo() {
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const mutate = useCallback(
    async (
      { numbers, score }: { numbers: number[]; score?: number },
      callbacks?: { onError?: (e: Error) => void },
    ) => {
      setIsPending(true)
      setError(null)
      try {
        const sorted = [...numbers].sort((a, b) => a - b)
        const comboKey = createComboKey(sorted)
        const current = loadSavedCombos()

        if (current.some(c => c.comboKey === comboKey)) {
          throw new Error('이미 저장한 조합입니다.')
        }

        let list = current
        if (current.length >= MAX_SAVED_COMBOS) {
          const ok = window.confirm('가장 오래된 번호를 삭제하고 저장할까요?')
          if (!ok) return
          list = current.slice(0, -1)
        }

        let matchedRound: number | null = null
        try {
          const res = await fetch(`/api/draws/match?comboKey=${encodeURIComponent(comboKey)}`)
          if (res.ok) {
            const body = (await res.json()) as { matchedRound: number | null }
            matchedRound = body.matchedRound
          }
        } catch {}

        const record: SavedComboRecord = {
          id: Date.now(),
          numbers: sorted,
          comboKey,
          score: score ?? null,
          matchedRound,
          createdAt: new Date().toISOString(),
        }

        persist([record, ...list])
      } catch (e) {
        const err = e instanceof Error ? e : new Error('저장 실패')
        setError(err)
        callbacks?.onError?.(err)
      } finally {
        setIsPending(false)
      }
    },
    [],
  )

  return { mutate, isPending, error }
}

export function useDeleteCombo() {
  const mutate = useCallback((id: number) => {
    persist(loadSavedCombos().filter(c => c.id !== id))
  }, [])

  return { mutate, isPending: false }
}
