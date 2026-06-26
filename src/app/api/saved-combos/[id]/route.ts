import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { hasDatabaseConfig } from '@/lib/env'

export const dynamic = 'force-dynamic'

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    if (!hasDatabaseConfig()) {
      return NextResponse.json({ error: 'DATABASE_URL 설정이 필요합니다.' }, { status: 503 })
    }

    const id = Number(params.id)
    if (!Number.isInteger(id)) {
      return NextResponse.json({ error: '잘못된 ID입니다.' }, { status: 400 })
    }

    await prisma.savedCombo.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    if (typeof error === 'object' && error !== null && 'code' in error && error.code === 'P2025') {
      return NextResponse.json({ error: '존재하지 않는 조합입니다.' }, { status: 404 })
    }
    return NextResponse.json({ error: '삭제 실패' }, { status: 500 })
  }
}
