import {
  ArrowLeft,
  LayoutGrid,
  ArrowUp,
  Sparkles,
  ChevronRight,
} from 'lucide-react'
import { AuroraBg } from './aurora-bg'

const NEWS = [
  {
    source: '연합뉴스',
    title: '외국인 순매도 지속에 코스피 약세 마감',
  },
  {
    source: '한국경제',
    title: '반도체株 차익실현 매물에 변동성 확대',
  },
  {
    source: '머니투데이',
    title: '美 금리 경계감에 아시아 증시 동반 조정',
  },
]

export function ScreenChat() {
  return (
    <div className="relative flex h-[calc(844px-54px)] flex-col">
      <AuroraBg className="opacity-70" />

      {/* 상단 바 */}
      <header className="relative flex h-14 shrink-0 items-center justify-center px-4">
        <button
          type="button"
          aria-label="나가기"
          className="absolute left-3 flex h-10 w-10 items-center justify-center rounded-full text-ink transition-colors hover:bg-black/5"
        >
          <ArrowLeft className="h-[22px] w-[22px]" strokeWidth={2} />
        </button>
        <h1 className="text-[15px] font-medium text-ink">삼성증권mPOP AI상담사</h1>
      </header>

      {/* 대화 스크롤 영역 */}
      <div className="relative flex-1 space-y-5 overflow-y-auto px-4 py-4">
        {/* 사용자 발화 (우측, 말풍선 없이 따옴표) */}
        <div className="flex justify-end">
          <p className="max-w-[78%] text-pretty text-right text-[15px] font-medium leading-relaxed text-ink">
            &ldquo;오늘 주식장이 왜 이래?&rdquo;
          </p>
        </div>

        {/* AI 답변 (좌측, 반투명 카드형) */}
        <div className="max-w-[88%]">
          <div className="mb-2 flex items-center gap-1.5">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-violet/10">
              <Sparkles className="h-3 w-3 text-violet" strokeWidth={2.2} />
            </span>
            <span className="text-[12px] font-medium text-violet">AI상담사</span>
          </div>

          <div className="rounded-3xl rounded-tl-md border border-white/60 bg-white/80 p-4 shadow-[0_12px_30px_-14px_rgba(35,33,54,0.22)] backdrop-blur">
            <p className="text-[15px] leading-relaxed text-ink">
              오늘 코스피는 외국인 매도세가 이어지며 약세로 마감했어요. 큰 흐름만
              간단히 정리해 드릴게요.
            </p>

            <ul className="mt-4 space-y-3">
              <li className="flex items-start gap-2.5">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-violet" />
                <p className="text-[14px] leading-relaxed text-ink">
                  코스피{' '}
                  <span className="font-semibold text-quote-down">2,612.4</span>{' '}
                  <span className="font-medium text-quote-down">
                    ▼ 0.84%
                  </span>{' '}
                  — 외국인·기관 동반 순매도
                </p>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-violet" />
                <p className="text-[14px] leading-relaxed text-ink">
                  원/달러{' '}
                  <span className="font-semibold text-quote-up">1,386.2</span>{' '}
                  <span className="font-medium text-quote-up">▲ 0.42%</span>{' '}
                  — 환율 부담이 투자심리를 눌렀어요
                </p>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-violet" />
                <p className="text-[14px] leading-relaxed text-ink">
                  미국 금리 경계감에 반도체 등 대형주 중심으로 차익실현 매물이
                  나왔어요
                </p>
              </li>
            </ul>
          </div>

          {/* 연관 뉴스 */}
          <div className="mt-3 rounded-3xl rounded-tl-md border border-line bg-white/70 p-2">
            <p className="px-2 py-1.5 text-[12px] font-medium text-ink-sub">
              연관 뉴스
            </p>
            <ul>
              {NEWS.map((n) => (
                <li key={n.title}>
                  <button
                    type="button"
                    className="flex w-full items-center gap-2 rounded-2xl px-2 py-2 text-left transition-colors hover:bg-black/[0.03]"
                  >
                    <span className="shrink-0 rounded-md bg-soft-blue/10 px-1.5 py-0.5 text-[11px] font-medium text-soft-blue">
                      {n.source}
                    </span>
                    <span className="flex-1 truncate text-[13px] text-ink">
                      {n.title}
                    </span>
                    <ChevronRight className="h-4 w-4 shrink-0 text-ink-sub" />
                  </button>
                </li>
              ))}
            </ul>
            <button
              type="button"
              className="px-2 py-2 text-[13px] font-medium text-soft-blue"
            >
              관련 뉴스 더보기
            </button>
          </div>

          {/* 면책 카드 */}
          <div className="mt-3 rounded-2xl bg-black/[0.04] px-4 py-3">
            <p className="text-[12px] leading-relaxed text-ink-sub">
              제가 간추린 내용이라 원문과 다를 수 있어요. 중요한 판단 전엔 출처를
              한 번 더 살펴봐 주세요.
            </p>
          </div>
        </div>
      </div>

      {/* 하단 입력 영역 */}
      <div className="relative shrink-0 px-4 pb-6 pt-2">
        <div className="flex items-center gap-2 rounded-full border border-line bg-white/85 py-2 pl-2 pr-2 shadow-[0_10px_30px_-14px_rgba(35,33,54,0.18)] backdrop-blur">
          <button
            type="button"
            aria-label="전체메뉴"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-ink-sub transition-colors hover:bg-black/5"
          >
            <LayoutGrid className="h-5 w-5" strokeWidth={1.8} />
          </button>
          <input
            type="text"
            placeholder="무엇이든 편하게 물어보세요"
            className="min-w-0 flex-1 bg-transparent text-[15px] text-ink outline-none placeholder:text-ink-sub/70"
          />
          <button
            type="button"
            aria-label="전송"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-violet text-white shadow-sm transition-opacity hover:opacity-90"
          >
            <ArrowUp className="h-5 w-5" strokeWidth={2.4} />
          </button>
        </div>
        <p className="mt-3 text-center text-[12px] text-ink-sub">
          투자 결정은 천천히, 신중하게
        </p>
      </div>
    </div>
  )
}
