import Link from 'next/link'
import { LottoHeader } from '@/components/LottoHeader'

export const metadata = {
  title: '이용약관 · Lotto Lab',
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-base text-primary">
      <LottoHeader />
      <main className="mx-auto max-w-[720px] px-6 py-9 pb-20">
        <div className="mb-8 flex items-center gap-4">
          <Link href="/" className="text-sm font-semibold text-muted hover:text-secondary">
            메인으로
          </Link>
          <h1 className="text-[22px] font-bold tracking-[-0.4px]">이용약관</h1>
        </div>

        <div className="space-y-8 text-[15px] leading-[1.8] text-[#8A9BB0]">
          <Section title="1. 서비스 목적">
            <p>
              Lotto Lab은 과거 로또 추첨 데이터의 통계적 분포를 시각화하고,
              한 번도 추첨된 적 없는 번호 조합을 탐색하는 <strong className="text-primary">재미로 즐기는 분석 대시보드</strong>입니다.
              본 서비스는 엔터테인먼트 및 통계 학습 목적으로 제공됩니다.
            </p>
          </Section>

          <Section title="2. 결과 보장 불가">
            <p>
              Lotto Lab이 제공하는 모든 번호 조합은 통계적 분석에 기반한 참고 정보입니다.
              로또 추첨은 독립적인 무작위 사건이며, <strong className="text-primary">모든 조합의 추첨 확률은 동일합니다 (1 / 8,145,060)</strong>.
              본 서비스는 당첨을 예측하거나 보장하지 않습니다.
            </p>
          </Section>

          <Section title="3. 책임 한계">
            <p>
              Lotto Lab은 서비스 이용으로 인해 발생하는 직간접적 손해에 대해 책임을 지지 않습니다.
              로또 구매 여부 및 금액은 사용자 본인이 판단하고 결정해야 합니다.
              과도한 복권 구매는 경제적 손실로 이어질 수 있습니다.
            </p>
          </Section>

          <Section title="4. 서비스와 동행복권의 관계">
            <p>
              Lotto Lab은 동행복권(나눔로또) 및 관련 기관과 무관한 독립 서비스입니다.
              공식 로또 구매는 동행복권 공식 채널을 이용해 주세요.
            </p>
          </Section>

          <Section title="5. 데이터 정확성">
            <p>
              추첨 이력 데이터는 공개 정보를 기반으로 하며, 최신 회차 동기화 이전에는
              최신 데이터가 반영되지 않을 수 있습니다.
              데이터의 정확성을 보장하지 않으며, 공식 추첨 결과는 동행복권 공식 사이트에서 확인하시기 바랍니다.
            </p>
          </Section>

          <Section title="6. 약관 변경">
            <p>
              본 약관이 변경될 경우 앱 내 공지를 통해 안내드립니다.
              변경 후 서비스를 계속 이용하시면 변경된 약관에 동의한 것으로 간주합니다.
            </p>
          </Section>

          <Section title="7. 문의">
            <p>
              서비스 관련 문의사항은 아래로 연락해 주세요.
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
