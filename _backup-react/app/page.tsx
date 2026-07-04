import { Prototype } from '@/components/prototype'

export default function Page() {
  return (
    <>
      {/* ── PC: 헤더 + 폰 목업 레이아웃 ── */}
      <main className="hidden min-h-screen flex-col items-center bg-[#f5f5f7] px-6 py-12 md:flex">
        <header className="mb-10 max-w-2xl text-center">
          <p className="mb-2 text-sm font-medium text-violet">
            삼성증권 mPOP · AI 상담사
          </p>
          <h1 className="text-balance text-2xl font-bold leading-relaxed text-ink">
            AI상담사 인터랙티브 프로토타입
          </h1>
          <p className="mt-2 text-pretty text-sm leading-relaxed text-ink-sub">
            진입 → 대화(답변 스트리밍) → 전체메뉴(드래그)까지 실제로 조작해 볼 수
            있는 모바일 시안
          </p>
        </header>
        <Prototype />
      </main>

      {/* ── 모바일: 풀스크린 (Prototype 내부 fixed div가 담당) ── */}
      <div className="md:hidden">
        <Prototype />
      </div>
    </>
  )
}
