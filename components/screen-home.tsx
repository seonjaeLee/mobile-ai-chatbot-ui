import { ArrowLeft, LayoutGrid, Mic, ArrowUp, ChevronUp } from 'lucide-react'
import { AuroraBg } from './aurora-bg'

const QUICK_CHIPS = ['원/달러 환율', '내 수익률', '내 계좌', '오늘 코스피 브리핑']

export function ScreenHome() {
  return (
    <div className="relative flex h-[calc(844px-54px)] flex-col">
      <AuroraBg />

      {/* 상단 바 */}
      <header className="relative flex h-14 items-center justify-center px-4">
        <button
          type="button"
          aria-label="나가기"
          className="absolute left-3 flex h-10 w-10 items-center justify-center rounded-full text-ink transition-colors hover:bg-black/5"
        >
          <ArrowLeft className="h-[22px] w-[22px]" strokeWidth={2} />
        </button>
        <h1 className="text-[15px] font-medium text-ink">삼성증권mPOP AI상담사</h1>
      </header>

      {/* 중앙 영역 */}
      <div className="relative flex flex-1 flex-col items-center justify-center px-6 pb-6">
        <p className="mb-3 text-sm text-ink-sub">좋은 아침이에요</p>
        <h2 className="mb-9 text-balance text-center text-[26px] font-bold leading-relaxed text-ink">
          오늘은 어떤 하루가
          <br />
          기다리고 있을까요?
        </h2>

        {/* 입력창 */}
        <div className="w-full rounded-3xl border border-line bg-white/80 p-4 shadow-[0_10px_30px_-12px_rgba(35,33,54,0.18)] backdrop-blur">
          <textarea
            rows={2}
            placeholder="무엇이든 편하게 물어보세요"
            className="w-full resize-none bg-transparent text-[15px] leading-relaxed text-ink outline-none placeholder:text-ink-sub/70"
          />
          <div className="mt-2 flex items-center justify-between">
            <button
              type="button"
              aria-label="전체메뉴"
              className="flex h-9 w-9 items-center justify-center rounded-full text-ink-sub transition-colors hover:bg-black/5"
            >
              <LayoutGrid className="h-5 w-5" strokeWidth={1.8} />
            </button>
            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label="음성 입력"
                className="flex h-9 w-9 items-center justify-center rounded-full text-ink-sub transition-colors hover:bg-black/5"
              >
                <Mic className="h-5 w-5" strokeWidth={1.8} />
              </button>
              <button
                type="button"
                aria-label="전송"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-violet text-white shadow-sm transition-opacity hover:opacity-90"
              >
                <ArrowUp className="h-5 w-5" strokeWidth={2.4} />
              </button>
            </div>
          </div>
        </div>

        {/* 빠른 진입 칩 */}
        <div className="mt-5 flex w-full flex-wrap justify-center gap-2">
          {QUICK_CHIPS.map((chip) => (
            <button
              key={chip}
              type="button"
              className="rounded-full border border-line bg-white/70 px-4 py-2 text-[13px] font-medium text-ink transition-colors hover:border-violet/40 hover:text-violet"
            >
              {chip}
            </button>
          ))}
        </div>
      </div>

      {/* 하단 전체메뉴 트리거 */}
      <div className="relative flex items-center justify-center pb-7">
        <button
          type="button"
          className="flex items-center gap-1.5 text-[13px] font-medium text-ink-sub transition-colors hover:text-ink"
        >
          <ChevronUp className="h-4 w-4" strokeWidth={2} />
          전체메뉴
        </button>
      </div>
    </div>
  )
}
