import Link from 'next/link'
import { LottoHeader } from '@/components/LottoHeader'

export const metadata = {
  title: '개인정보처리방침 · Lotto Lab',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-base text-primary">
      <LottoHeader />
      <main className="mx-auto max-w-[720px] px-6 py-9 pb-20">
        <div className="mb-8 flex items-center gap-4">
          <Link href="/" className="text-sm font-semibold text-muted hover:text-secondary">
            메인으로
          </Link>
          <h1 className="text-[22px] font-bold tracking-[-0.4px]">개인정보처리방침</h1>
        </div>

        <div className="space-y-8 text-[15px] leading-[1.8] text-[#8A9BB0]">
          <Section title="1. 개인정보 수집 여부">
            <p>
              Lotto Lab은 회원가입, 로그인 등 어떠한 개인정보도 수집하지 않습니다.
              서비스 이용을 위해 이름, 이메일, 전화번호 등 개인 식별 정보를 요구하지 않습니다.
            </p>
          </Section>

          <Section title="2. 데이터 저장 방식">
            <p>
              사용자가 저장한 번호 조합 및 생성 이력은 <strong className="text-primary">기기 내부(로컬 스토리지)</strong>에만 저장됩니다.
              해당 데이터는 외부 서버로 전송되거나 공유되지 않으며,
              앱을 삭제하면 모든 데이터가 함께 삭제됩니다.
            </p>
          </Section>

          <Section title="3. 서버에서 제공하는 데이터">
            <p>
              Lotto Lab 서버는 로또 추첨 이력 통계 데이터만을 제공합니다.
              이 데이터는 공개된 추첨 결과를 기반으로 하며, 사용자를 식별하는 어떠한 정보도 포함하지 않습니다.
            </p>
          </Section>

          <Section title="4. 광고 및 분석 도구">
            <p>
              현재 Lotto Lab은 광고 네트워크, 행동 분석 도구(Google Analytics 등),
              제3자 트래킹 SDK를 사용하지 않습니다.
            </p>
          </Section>

          <Section title="5. 쿠키">
            <p>
              Lotto Lab은 별도의 쿠키를 사용하지 않습니다.
            </p>
          </Section>

          <Section title="6. 개인정보처리방침 변경">
            <p>
              본 방침이 변경될 경우 앱 내 공지를 통해 안내드립니다.
            </p>
          </Section>

          <Section title="7. 문의">
            <p>
              개인정보 관련 문의사항은 아래로 연락해 주세요.
              <br />
              이메일: <span className="text-cyan">shuringpp@gmail.com</span>
            </p>
          </Section>

          <p className="pt-4 text-xs text-[#3D4A5E]">최종 수정일: 2026-06-28</p>
        </div>
      </main>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="mb-3 text-[16px] font-bold tracking-[-0.3px] text-primary">{title}</h2>
      {children}
    </section>
  )
}
