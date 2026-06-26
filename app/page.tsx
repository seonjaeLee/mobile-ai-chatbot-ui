import { PhoneFrame } from '@/components/phone-frame'
import { ScreenHome } from '@/components/screen-home'
import { ScreenChat } from '@/components/screen-chat'
import { ScreenMenu } from '@/components/screen-menu'

export default function Page() {
  return (
    <main className="min-h-screen bg-[#f5f5f7] px-6 py-12">
      <header className="mx-auto mb-12 max-w-3xl text-center">
        <p className="mb-2 text-sm font-medium text-violet">
          삼성증권 mPOP · AI 상담사
        </p>
        <h1 className="text-balance text-2xl font-bold leading-relaxed text-ink">
          삼성증권mPOP AI상담사 화면 시안
        </h1>
        <p className="mt-2 text-pretty text-sm leading-relaxed text-ink-sub">
          mPOP(MTS) 앱 내 오버레이 풀스크린 · 모바일 세로(390px) · 라이트 모드
        </p>
      </header>

      <div className="flex flex-wrap items-start justify-center gap-10">
        <PhoneFrame label="① 첫화면 (진입)">
          <ScreenHome />
        </PhoneFrame>
        <PhoneFrame label="② 대화 화면">
          <ScreenChat />
        </PhoneFrame>
        <PhoneFrame label="③ 전체메뉴 (바텀시트)">
          <ScreenMenu />
        </PhoneFrame>
      </div>
    </main>
  )
}
