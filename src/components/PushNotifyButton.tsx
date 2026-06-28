'use client'

import { useEffect, useState } from 'react'

type Status = 'unsupported' | 'denied' | 'subscribed' | 'unsubscribed' | 'loading'

async function registerSW() {
  if (!('serviceWorker' in navigator)) return null
  const reg = await navigator.serviceWorker.register('/sw.js')
  await navigator.serviceWorker.ready
  return reg
}

async function subscribe(): Promise<boolean> {
  const reg = await registerSW()
  if (!reg) return false
  const sub = await reg.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
  })
  const res = await fetch('/api/push/subscribe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(sub),
  })
  return res.ok
}

async function unsubscribe(): Promise<boolean> {
  const reg = await navigator.serviceWorker.getRegistration('/sw.js')
  if (!reg) return false
  const sub = await reg.pushManager.getSubscription()
  if (!sub) return false
  await fetch('/api/push/unsubscribe', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ endpoint: sub.endpoint }),
  })
  await sub.unsubscribe()
  return true
}

export function PushNotifyButton() {
  const [status, setStatus] = useState<Status>('loading')
  const [testing, setTesting] = useState(false)

  useEffect(() => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      setStatus('unsupported')
      return
    }
    if (Notification.permission === 'denied') {
      setStatus('denied')
      return
    }
    navigator.serviceWorker.getRegistration('/sw.js').then(async reg => {
      if (!reg) { setStatus('unsubscribed'); return }
      const sub = await reg.pushManager.getSubscription()
      setStatus(sub ? 'subscribed' : 'unsubscribed')
    })
  }, [])

  async function handleClick() {
    if (status === 'subscribed') {
      setStatus('loading')
      await unsubscribe()
      setStatus('unsubscribed')
      return
    }
    setStatus('loading')
    const permission = await Notification.requestPermission()
    if (permission !== 'granted') { setStatus('denied'); return }
    const ok = await subscribe()
    setStatus(ok ? 'subscribed' : 'unsubscribed')
  }

  async function handleTest() {
    setTesting(true)
    const reg = await navigator.serviceWorker.getRegistration('/sw.js')
    if (!reg) { setTesting(false); return }
    const sub = await reg.pushManager.getSubscription()
    if (!sub) { setTesting(false); return }
    await fetch('/api/push/test', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sub),
    })
    setTesting(false)
  }

  if (status === 'unsupported') return null

  if (status === 'denied') {
    return (
      <p className="text-[11px] text-[#4A5A72]">
        알림 권한이 차단되어 있습니다. 브라우저 설정에서 허용해주세요.
      </p>
    )
  }

  return (
    <div className="flex flex-col items-end gap-2">
      <button
        type="button"
        onClick={handleClick}
        disabled={status === 'loading'}
        className="flex items-center gap-1.5 text-[12px] font-semibold disabled:opacity-50 transition-colors"
      >
        {status === 'subscribed' ? (
          <>
            <span className="flex h-[7px] w-[7px] rounded-full bg-cyan" />
            <span className="text-cyan">당첨번호 알림 ON</span>
          </>
        ) : status === 'loading' ? (
          <span className="text-[#4A5A72]">처리 중...</span>
        ) : (
          <>
            <BellIcon />
            <span className="text-[#6B7A96] hover:text-[#8A9BB0]">당첨번호 알림 받기</span>
          </>
        )}
      </button>
      {status === 'subscribed' && (
        <button
          type="button"
          onClick={handleTest}
          disabled={testing}
          className="text-[11px] text-[#3D4A5E] underline underline-offset-2 hover:text-[#5A6A82] disabled:opacity-50 transition-colors"
        >
          {testing ? '발송 중...' : '테스트 알림 보내기'}
        </button>
      )}
    </div>
  )
}

function BellIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#6B7A96]">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  )
}
