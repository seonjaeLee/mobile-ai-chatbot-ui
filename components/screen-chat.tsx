'use client'

import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowLeft,
  LayoutGrid,
  ArrowUp,
  Sparkles,
  ChevronRight,
} from 'lucide-react'
import { AuroraBg } from './aurora-bg'
import { Tappable } from './tappable'

const INTRO =
  '오늘 코스피는 외국인 매도세가 이어지며 약세로 마감했어요. 큰 흐름만 간단히 정리해 드릴게요.'

const BULLETS = [
  {
    body: (
      <>
        코스피 <span className="font-semibold text-quote-down">2,612.4</span>{' '}
        <span className="font-medium text-quote-down">▼ 0.84%</span> — 외국인·기관
        동반 순매도
      </>
    ),
  },
  {
    body: (
      <>
        원/달러 <span className="font-semibold text-quote-up">1,386.2</span>{' '}
        <span className="font-medium text-quote-up">▲ 0.42%</span> — 환율 부담이
        투자심리를 눌렀어요
      </>
    ),
  },
  {
    body: <>미국 금리 경계감에 반도체 등 대형주 중심으로 차익실현 매물이 나왔어요</>,
  },
]

const NEWS = [
  { source: '연합뉴스', title: '외국인 순매도 지속에 코스피 약세 마감' },
  { source: '한국경제', title: '반도체株 차익실현 매물에 변동성 확대' },
  { source: '머니투데이', title: '美 금리 경계감에 아시아 증시 동반 조정' },
]

// 스트리밍 단계: 0 타이핑중 → 1 본문 타이핑 → 2 불릿 → 3 뉴스 → 4 면책 완료
type Stage = 0 | 1 | 2 | 3 | 4

export function ScreenChat({
  question,
  onBack,
  onAsk,
  onOpenMenu,
}: {
  question: string
  onBack: () => void
  onAsk: (q: string) => void
  onOpenMenu: () => void
}) {
  const [stage, setStage] = useState<Stage>(0)
  const [typed, setTyped] = useState('')
  const [value, setValue] = useState('')
  const [focused, setFocused] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  // 단계 진행: 타이핑 인디케이터 → 본문 글자 스트리밍 → 나머지 블록
  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = []
    timers.push(setTimeout(() => setStage(1), 900))
    return () => timers.forEach(clearTimeout)
  }, [])

  useEffect(() => {
    if (stage !== 1) return
    let i = 0
    const id = setInterval(() => {
      i += 1
      setTyped(INTRO.slice(0, i))
      if (i >= INTRO.length) {
        clearInterval(id)
        setTimeout(() => setStage(2), 200)
      }
    }, 22)
    return () => clearInterval(id)
  }, [stage])

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = []
    if (stage === 2) timers.push(setTimeout(() => setStage(3), 700))
    if (stage === 3) timers.push(setTimeout(() => setStage(4), 600))
    return () => timers.forEach(clearTimeout)
  }, [stage])

  // 새 내용이 들어올 때마다 하단으로 부드럽게 스크롤
  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: 'smooth',
    })
  }, [stage, typed])

  const send = () => {
    if (!value.trim()) return
    onAsk(value)
    setValue('')
  }

  return (
    <div className="relative flex h-full flex-col">
      <AuroraBg className="opacity-70" />

      {/* 상단 바 */}
      <header className="relative flex h-14 shrink-0 items-center justify-center px-4">
        <Tappable
          type="button"
          aria-label="뒤로"
          onClick={onBack}
          className="absolute left-3 flex h-10 w-10 items-center justify-center rounded-full text-ink hover:bg-black/5"
        >
          <ArrowLeft className="h-[22px] w-[22px]" strokeWidth={2} />
        </Tappable>
        <h1 className="text-[15px] font-medium text-ink">삼성증권mPOP AI챗봇</h1>
      </header>

      {/* 대화 스크롤 영역 */}
      <div
        ref={scrollRef}
        className="relative flex-1 space-y-5 overflow-y-auto px-4 py-4"
      >
        {/* 사용자 발화 */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 360, damping: 30 }}
          className="flex justify-end"
        >
          <p className="max-w-[78%] text-pretty text-right text-[15px] font-medium leading-relaxed text-ink">
            &ldquo;{question}&rdquo;
          </p>
        </motion.div>

        {/* AI 답변 */}
        <div className="max-w-[88%]">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-2 flex items-center gap-1.5"
          >
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-violet/10">
              <Sparkles className="h-3 w-3 text-violet" strokeWidth={2.2} />
            </span>
            <span className="text-[12px] font-medium text-violet">AI상담사</span>
          </motion.div>

          <div className="rounded-3xl rounded-tl-md border border-white/60 bg-white/80 p-4 shadow-[0_12px_30px_-14px_rgba(35,33,54,0.22)] backdrop-blur">
            {stage === 0 ? (
              <TypingDots />
            ) : (
              <p className="text-[15px] leading-relaxed text-ink">
                {typed}
                {stage === 1 && <Caret />}
              </p>
            )}

            <AnimatePresence>
              {stage >= 2 && (
                <motion.ul
                  initial="hidden"
                  animate="show"
                  variants={{
                    hidden: {},
                    show: { transition: { staggerChildren: 0.12 } },
                  }}
                  className="mt-4 space-y-3"
                >
                  {BULLETS.map((b, i) => (
                    <motion.li
                      key={i}
                      variants={{
                        hidden: { opacity: 0, x: -12 },
                        show: { opacity: 1, x: 0 },
                      }}
                      className="flex items-start gap-2.5"
                    >
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-violet" />
                      <p className="text-[14px] leading-relaxed text-ink">
                        {b.body}
                      </p>
                    </motion.li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>

          {/* 연관 뉴스 */}
          <AnimatePresence>
            {stage >= 3 && (
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 320, damping: 30 }}
                className="mt-3 rounded-3xl rounded-tl-md border border-line bg-white/70 p-2"
              >
                <p className="px-2 py-1.5 text-[12px] font-medium text-ink-sub">
                  연관 뉴스
                </p>
                <ul>
                  {NEWS.map((n) => (
                    <li key={n.title}>
                      <Tappable
                        type="button"
                        className="flex w-full items-center gap-2 rounded-2xl px-2 py-2 text-left hover:bg-black/[0.03]"
                      >
                        <span className="shrink-0 rounded-md bg-soft-blue/10 px-1.5 py-0.5 text-[11px] font-medium text-soft-blue">
                          {n.source}
                        </span>
                        <span className="flex-1 truncate text-[13px] text-ink">
                          {n.title}
                        </span>
                        <ChevronRight className="h-4 w-4 shrink-0 text-ink-sub" />
                      </Tappable>
                    </li>
                  ))}
                </ul>
                <Tappable
                  type="button"
                  className="rounded-full px-2 py-2 text-[13px] font-medium text-soft-blue"
                >
                  관련 뉴스 더보기
                </Tappable>
              </motion.div>
            )}
          </AnimatePresence>

          {/* 면책 카드 */}
          <AnimatePresence>
            {stage >= 4 && (
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 320, damping: 30 }}
                className="mt-3 rounded-2xl bg-black/[0.04] px-4 py-3"
              >
                <p className="text-[12px] leading-relaxed text-ink-sub">
                  제가 간추린 내용이라 원문과 다를 수 있어요. 중요한 판단 전엔
                  출처를 한 번 더 살펴봐 주세요.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* 하단 입력 영역 */}
      <div className="relative shrink-0 px-4 pb-6 pt-2">
        <motion.div
          animate={{
            borderColor: focused ? 'rgba(110,93,231,0.55)' : 'rgba(236,235,242,1)',
            boxShadow: focused
              ? '0 12px 34px -14px rgba(110,93,231,0.35)'
              : '0 10px 30px -14px rgba(35,33,54,0.18)',
          }}
          className="flex items-center gap-2 rounded-full border bg-white/85 py-2 pl-2 pr-2 backdrop-blur"
        >
          <Tappable
            type="button"
            aria-label="전체메뉴"
            onClick={onOpenMenu}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-ink-sub hover:bg-black/5"
          >
            <LayoutGrid className="h-5 w-5" strokeWidth={1.8} />
          </Tappable>
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                send()
              }
            }}
            placeholder="무엇이든 편하게 물어보세요"
            className="min-w-0 flex-1 bg-transparent text-[15px] text-ink outline-none placeholder:text-ink-sub/70"
          />
          <Tappable
            type="button"
            aria-label="전송"
            onClick={send}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-violet text-white shadow-sm hover:opacity-90"
          >
            <ArrowUp className="h-5 w-5" strokeWidth={2.4} />
          </Tappable>
        </motion.div>
        <p className="mb-1 mt-3 text-center text-[12px] text-ink-sub">
          AI는 실수할 수 있어요. 내용을 한 번 더 확인해 주세요.
        </p>
      </div>
    </div>
  )
}

function TypingDots() {
  return (
    <div className="flex items-center gap-1.5 py-1" aria-label="답변 작성 중">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="h-2 w-2 rounded-full bg-violet/50"
          animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
          transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }}
        />
      ))}
    </div>
  )
}

function Caret() {
  return (
    <motion.span
      className="ml-0.5 inline-block h-[15px] w-[2px] translate-y-[2px] bg-violet"
      animate={{ opacity: [1, 0, 1] }}
      transition={{ duration: 0.8, repeat: Infinity }}
    />
  )
}
