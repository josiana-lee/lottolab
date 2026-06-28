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
          <p>
            Lotto Lab(이하 "서비스")은 개인정보보호법 제30조에 따라 정보주체의 개인정보를 보호하고
            이와 관련한 고충을 신속하고 원활하게 처리할 수 있도록 하기 위하여 다음과 같이
            개인정보처리방침을 수립·공개합니다.
          </p>

          <Section title="제1조 (개인정보의 처리 목적)">
            <p>
              서비스는 다음의 목적을 위하여 개인정보를 처리합니다.
              처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며,
              이용 목적이 변경되는 경우에는 개인정보보호법 제18조에 따라 별도의 동의를 받는 등
              필요한 조치를 이행할 예정입니다.
            </p>
            <ul className="mt-3 list-disc space-y-1 pl-5">
              <li>로또 당첨번호 발표 푸시 알림 서비스 제공 (이용자 선택 동의 시에 한함)</li>
            </ul>
          </Section>

          <Section title="제2조 (처리하는 개인정보의 항목)">
            <p>서비스는 다음의 개인정보 항목을 처리하고 있습니다.</p>
            <div className="mt-3 space-y-4">
              <div>
                <p className="font-semibold text-primary">① 푸시 알림 서비스 (선택 동의)</p>
                <ul className="mt-1 list-disc space-y-1 pl-5">
                  <li>수집 항목: 웹 푸시 구독 정보(엔드포인트 URL, 암호화 키)</li>
                  <li>수집 방법: 이용자의 브라우저 알림 권한 허용 시 자동 수집</li>
                </ul>
              </div>
              <div>
                <p className="font-semibold text-primary">② 비수집 항목</p>
                <ul className="mt-1 list-disc space-y-1 pl-5">
                  <li>이름, 이메일, 전화번호 등 개인 식별 정보는 수집하지 않습니다.</li>
                  <li>생성된 번호 조합 및 저장 이력은 이용자 기기 내 로컬 저장소에만 보관되며 서버로 전송되지 않습니다.</li>
                  <li>서비스 이용 기록, 접속 로그, 쿠키 등은 수집하지 않습니다.</li>
                </ul>
              </div>
            </div>
          </Section>

          <Section title="제3조 (개인정보의 처리 및 보유 기간)">
            <p>
              서비스는 법령에 따른 개인정보 보유·이용 기간 또는 정보주체로부터 개인정보를 수집 시에
              동의받은 개인정보 보유·이용 기간 내에서 개인정보를 처리·보유합니다.
            </p>
            <ul className="mt-3 list-disc space-y-1 pl-5">
              <li>푸시 알림 구독 정보: 이용자가 알림 수신을 거부하거나 구독을 해제할 때까지 보유</li>
              <li>구독 해제 시 해당 정보는 즉시 파기됩니다.</li>
            </ul>
          </Section>

          <Section title="제4조 (개인정보의 제3자 제공)">
            <p>
              서비스는 정보주체의 개인정보를 제1조(개인정보의 처리 목적)에서 명시한 범위 내에서만
              처리하며, 정보주체의 동의, 법률의 특별한 규정 등 개인정보보호법 제17조 및 제18조에
              해당하는 경우에만 개인정보를 제3자에게 제공합니다.
            </p>
            <p className="mt-2">현재 서비스는 개인정보를 제3자에게 제공하지 않습니다.</p>
          </Section>

          <Section title="제5조 (개인정보처리 위탁)">
            <p>서비스는 원활한 서비스 제공을 위해 다음과 같이 개인정보 처리업무를 위탁하고 있습니다.</p>
            <div className="mt-3 overflow-x-auto">
              <table className="w-full border-collapse text-[14px]">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="py-2 pr-6 text-left font-semibold text-primary">수탁업체</th>
                    <th className="py-2 text-left font-semibold text-primary">위탁 업무</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-white/[0.05]">
                    <td className="py-2 pr-6">Supabase Inc.</td>
                    <td className="py-2">푸시 구독 정보 데이터베이스 보관</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-6">Google LLC</td>
                    <td className="py-2">웹 푸시 알림 전송 (Web Push Protocol)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Section>

          <Section title="제6조 (개인정보의 파기)">
            <p>
              서비스는 개인정보 보유기간의 경과, 처리목적 달성 등 개인정보가 불필요하게 되었을 때에는
              지체없이 해당 개인정보를 파기합니다.
            </p>
            <ul className="mt-3 list-disc space-y-1 pl-5">
              <li>파기 절차: 불필요한 개인정보는 개인정보보호책임자의 방침에 따라 데이터베이스에서 즉시 삭제합니다.</li>
              <li>파기 방법: 전자적 파일 형태로 기록·저장된 개인정보는 기록을 재생할 수 없도록 기술적 방법을 사용하여 삭제합니다.</li>
            </ul>
          </Section>

          <Section title="제7조 (정보주체의 권리·의무 및 행사 방법)">
            <p>정보주체는 서비스에 대해 언제든지 다음 각 호의 개인정보 보호 관련 권리를 행사할 수 있습니다.</p>
            <ul className="mt-3 list-disc space-y-1 pl-5">
              <li>개인정보 열람 요구</li>
              <li>오류 등이 있을 경우 정정 요구</li>
              <li>삭제 요구</li>
              <li>처리 정지 요구</li>
            </ul>
            <p className="mt-3">
              권리 행사는 개인정보보호법 시행령 제41조 제1항에 따라 서면, 전자우편 등을 통하여 하실 수 있으며,
              서비스는 이에 대해 지체없이 조치하겠습니다.
            </p>
          </Section>

          <Section title="제8조 (개인정보 자동 수집 장치의 설치·운영 및 거부)">
            <p>
              서비스는 이용자에게 개별적인 맞춤서비스를 제공하기 위해 이용정보를 저장하고 수시로
              불러오는 쿠키(cookie)를 사용하지 않습니다.
            </p>
            <p className="mt-2">
              번호 생성 이력 및 저장 조합 등은 이용자 기기의 로컬 저장소(localStorage)에만 보관되며
              서버로 전송되지 않습니다. 이용자는 브라우저 설정을 통해 언제든지 로컬 저장소를 직접 삭제할 수 있습니다.
            </p>
          </Section>

          <Section title="제9조 (개인정보 보호책임자)">
            <p>
              서비스는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 정보주체의 개인정보 관련
              불만처리 및 피해구제 등을 위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다.
            </p>
            <div className="mt-3 space-y-1">
              <p><span className="font-semibold text-primary">▶ 개인정보 보호책임자</span></p>
              <p>성명: 이승미</p>
              <p>이메일: <span className="text-cyan">shuringpp@gmail.com</span></p>
            </div>
            <p className="mt-3">
              정보주체는 서비스를 이용하시면서 발생한 모든 개인정보 보호 관련 문의, 불만처리,
              피해구제 등에 관한 사항을 개인정보 보호책임자에게 문의하실 수 있습니다.
            </p>
          </Section>

          <Section title="제10조 (개인정보처리방침 변경)">
            <p>
              이 개인정보처리방침은 시행일로부터 적용되며, 법령 및 방침에 따른 변경내용의 추가, 삭제 및
              정정이 있는 경우에는 변경사항의 시행 7일 전부터 서비스 내 공지를 통하여 고지할 것입니다.
            </p>
          </Section>

          <Section title="제11조 (권익침해 구제 방법)">
            <p>
              정보주체는 아래의 기관에 대해 개인정보 침해에 대한 피해구제, 상담 등을 문의할 수 있습니다.
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>개인정보 침해신고센터 (한국인터넷진흥원 운영): privacy.kisa.or.kr / ☎ 118</li>
              <li>개인정보 분쟁조정위원회: www.kopico.go.kr / ☎ 1833-6972</li>
              <li>대검찰청 사이버범죄수사단: ☎ 02-3480-3573</li>
              <li>경찰청 사이버안전국: ☎ 182</li>
            </ul>
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
