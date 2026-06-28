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

          <Section title="제1조 (목적)">
            <p>
              이 약관은 Lotto Lab(이하 "서비스")이 제공하는 로또 추첨 데이터 분석 서비스의 이용과 관련하여
              서비스와 이용자 간의 권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.
            </p>
          </Section>

          <Section title="제2조 (정의)">
            <p>이 약관에서 사용하는 용어의 정의는 다음과 같습니다.</p>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>"서비스"란 Lotto Lab이 제공하는 로또 추첨 데이터 분석 웹 애플리케이션을 의미합니다.</li>
              <li>"이용자"란 이 약관에 따라 서비스가 제공하는 서비스를 받는 자를 의미합니다.</li>
              <li>"콘텐츠"란 서비스 내에서 이용자에게 제공되는 번호 조합, 통계 데이터, 차트 등 일체의 정보를 의미합니다.</li>
            </ul>
          </Section>

          <Section title="제3조 (약관의 효력 및 변경)">
            <ul className="list-disc space-y-2 pl-5">
              <li>이 약관은 서비스를 이용하고자 하는 모든 이용자에게 적용됩니다.</li>
              <li>서비스는 필요한 경우 관련 법령을 위배하지 않는 범위 내에서 이 약관을 변경할 수 있습니다.</li>
              <li>약관이 변경되는 경우 서비스는 변경사항을 시행일 7일 전부터 서비스 내 공지합니다.</li>
              <li>이용자가 변경된 약관에 동의하지 않는 경우 서비스 이용을 중단할 수 있습니다.</li>
              <li>변경된 약관의 시행일 이후에도 서비스를 계속 이용하는 경우 변경된 약관에 동의한 것으로 간주합니다.</li>
            </ul>
          </Section>

          <Section title="제4조 (서비스의 제공 및 내용)">
            <p>서비스는 다음과 같은 기능을 제공합니다.</p>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>로또 과거 추첨 이력 데이터 조회 및 통계 분석</li>
              <li>과거 미출현 번호 조합 탐색 및 생성</li>
              <li>번호 출현 빈도, 번호쌍 동반 출현 등 통계 시각화</li>
              <li>이용자 기기 내 번호 조합 저장 기능 (최대 10개)</li>
              <li>매주 로또 당첨번호 갱신 및 푸시 알림 (선택 동의 시)</li>
            </ul>
            <p className="mt-3">
              서비스는 운영상·기술상의 필요에 따라 제공하는 서비스의 전부 또는 일부를
              변경할 수 있으며, 이에 대해 이용자에게 사전 공지합니다.
            </p>
          </Section>

          <Section title="제5조 (서비스의 중단)">
            <ul className="list-disc space-y-2 pl-5">
              <li>서비스는 컴퓨터 등 정보통신설비의 보수점검, 교체 및 고장, 통신두절 등의 사유가 발생한 경우 서비스의 제공을 일시적으로 중단할 수 있습니다.</li>
              <li>서비스는 천재지변 또는 이에 준하는 불가항력으로 인하여 서비스를 제공할 수 없는 경우에는 서비스 제공을 제한하거나 일시 중단할 수 있습니다.</li>
              <li>서비스의 중단으로 인하여 이용자 또는 제3자가 입은 손해에 대하여는 서비스의 고의 또는 중과실이 없는 한 책임을 지지 않습니다.</li>
            </ul>
          </Section>

          <Section title="제6조 (이용자의 의무)">
            <p>이용자는 다음 각 호의 행위를 하여서는 안 됩니다.</p>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>서비스에서 얻은 정보를 서비스의 사전 승낙 없이 이용자의 이용 이외의 목적으로 복제하거나 제3자에게 제공하는 행위</li>
              <li>서비스의 저작권, 제3자의 저작권 등 기타 권리를 침해하는 행위</li>
              <li>서비스의 운영을 고의로 방해하거나 서비스의 안정적 운영을 방해할 수 있는 정보 또는 수신자의 의사에 반하여 광고성 정보를 전송하는 행위</li>
              <li>기타 관련 법령에 위반되는 행위</li>
            </ul>
          </Section>

          <Section title="제7조 (서비스의 성격 및 면책)">
            <ul className="list-disc space-y-2 pl-5">
              <li>
                서비스는 로또 추첨 데이터를 기반으로 한 <strong className="text-primary">통계 분석 및 엔터테인먼트 목적의 정보 서비스</strong>입니다.
                서비스는 당첨을 예측하거나 보장하지 않습니다.
              </li>
              <li>로또 추첨은 독립적인 무작위 사건이며, 모든 조합의 추첨 확률은 동일합니다 (1/8,145,060).</li>
              <li>서비스는 이용자가 서비스를 이용하여 기대하는 손익이 발생하지 않은 것에 대하여 책임을 지지 않습니다.</li>
              <li>서비스는 이용자가 게재한 정보, 자료, 사실의 신뢰도, 정확성 등의 내용에 관하여는 책임을 지지 않습니다.</li>
              <li>본 서비스는 동행복권(나눔로또) 및 관련 기관과 무관한 독립 서비스입니다. 공식 복권 구매는 동행복권 공식 채널을 이용하십시오.</li>
            </ul>
          </Section>

          <Section title="제8조 (저작권의 귀속 및 이용 제한)">
            <ul className="list-disc space-y-2 pl-5">
              <li>서비스가 제공하는 콘텐츠에 대한 저작권 및 지적재산권은 서비스에 귀속됩니다.</li>
              <li>이용자는 서비스를 이용함으로써 얻은 정보를 서비스의 사전 승낙 없이 복제, 송신, 출판, 배포, 방송 등의 방법에 의하여 영리 목적으로 이용하거나 제3자에게 이용하게 하여서는 안 됩니다.</li>
              <li>서비스는 공개된 로또 추첨 결과 데이터를 기반으로 하며, 해당 데이터의 원본 저작권은 동행복권(나눔로또)에 귀속됩니다.</li>
            </ul>
          </Section>

          <Section title="제9조 (분쟁 해결)">
            <ul className="list-disc space-y-2 pl-5">
              <li>서비스는 이용자가 제기하는 정당한 의견이나 불만을 반영하고 그 피해를 보상하기 위하여 노력합니다.</li>
              <li>서비스와 이용자 간에 발생한 전자상거래 분쟁에 관한 소송은 제소 당시의 이용자의 주소에 의하고, 주소가 없는 경우에는 거소를 관할하는 지방법원의 전속관할로 합니다. 다만, 제소 당시 이용자의 주소 또는 거소가 분명하지 않거나 외국 거주자의 경우에는 민사소송법상의 관할법원에 제기합니다.</li>
            </ul>
          </Section>

          <Section title="제10조 (문의)">
            <p>
              이용약관에 관한 문의사항은 아래 연락처로 문의하시기 바랍니다.
            </p>
            <div className="mt-2">
              <p>이메일: <span className="text-cyan">shuringpp@gmail.com</span></p>
            </div>
          </Section>

          <p className="pt-4 text-xs text-[#3D4A5E]">시행일: 2026년 06월 28일</p>
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
