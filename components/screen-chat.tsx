'use client'

import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowLeft,
  LayoutGrid,
  ArrowUp,
  Sparkles,
  Check,
  ChevronUp,
  ChevronDown,
} from 'lucide-react'
import { AuroraBg } from './aurora-bg'
import { Tappable } from './tappable'

// ── 호가 데이터 ─────────────────────────────────────────────────
const STOCK = { name: '삼성전자', code: '005930', market: 'KOSPi' }
const BASE_PRICE = 192600
const ORDER_BOOK = [
  { price: 192800, diff: +200 },
  { price: 192700, diff: +100 },
  { price: 192600, diff: 0 },   // 현재가
  { price: 192500, diff: -100 },
  { price: 192400, diff: -200 },
]
const QTY = 15

const INTRO_TEXT = '삼성전자 1주당 매수 가격을 선택하거나 입력해 주세요.'
const CONFIRM_INTRO = `아래 내용과 같이 삼성전자 ${QTY}주 매수 접수 할게요. 확인 후 주문을 실행해 주세요. 주문 실행 시 정정·취소가 제한될 수 있어요.`

// 스트리밍 단계
// 0 = 타이핑 인디케이터
// 1 = 호가 안내 텍스트 스트리밍
// 2 = 호가창 카드 표시 (가격 미선택)
// 3 = 사용자 발화 2 + 타이핑 인디케이터 2
// 4 = 주문확인 텍스트 스트리밍
// 5 = 주문확인 카드 표시
// 6 = 매수 완료
type Stage = 0 | 1 | 2 | 3 | 4 | 5 | 6

type Message =
  | { role: 'user'; text: string }
  | { role: 'ai-step1' }
  | { role: 'ai-step2'; selectedPrice: number | null }
  | { role: 'user2'; text: string }
  | { role: 'ai-step3' }
  | { role: 'ai-step4'; done: boolean }

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
  const [typed1, setTyped1] = useState('')
  const [typed2, setTyped2] = useState('')
  const [selectedPrice, setSelectedPrice] = useState<number | null>(null)
  const [orderDone, setOrderDone] = useState(false)
  const [value, setValue] = useState('')
  const [focused, setFocused] = useState(false)
  const [scrolling, setScrolling] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const scrollTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleScroll = () => {
    setScrolling(true)
    if (scrollTimer.current) clearTimeout(scrollTimer.current)
    scrollTimer.current = setTimeout(() => setScrolling(false), 700)
  }

  useEffect(() => () => { if (scrollTimer.current) clearTimeout(scrollTimer.current) }, [])

  // Stage 0 → 1: 900ms 후 텍스트 스트리밍 시작
  useEffect(() => {
    const t = setTimeout(() => setStage(1), 900)
    return () => clearTimeout(t)
  }, [])

  // Stage 1: INTRO_TEXT 타이핑
  useEffect(() => {
    if (stage !== 1) return
    let i = 0
    const id = setInterval(() => {
      i++
      setTyped1(INTRO_TEXT.slice(0, i))
      if (i >= INTRO_TEXT.length) {
        clearInterval(id)
        setTimeout(() => setStage(2), 300)
      }
    }, 24)
    return () => clearInterval(id)
  }, [stage])

  // Stage 3 → 4 (사용자 발화 2 직후): 700ms 후 텍스트 스트리밍
  useEffect(() => {
    if (stage !== 3) return
    const t = setTimeout(() => setStage(4), 700)
    return () => clearTimeout(t)
  }, [stage])

  // Stage 4: CONFIRM_INTRO 타이핑
  useEffect(() => {
    if (stage !== 4) return
    let i = 0
    const id = setInterval(() => {
      i++
      setTyped2(CONFIRM_INTRO.slice(0, i))
      if (i >= CONFIRM_INTRO.length) {
        clearInterval(id)
        setTimeout(() => setStage(5), 300)
      }
    }, 18)
    return () => clearInterval(id)
  }, [stage])

  // 새 내용마다 하단 스크롤
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [stage, typed1, typed2])

  // 가격 선택 → 사용자 발화 2 트리거
  const handleSelectPrice = (price: number) => {
    if (stage !== 2) return
    setSelectedPrice(price)
    // 짧은 딜레이 후 사용자 발화 2 + step3
    setTimeout(() => setStage(3), 500)
  }

  // 매수 실행
  const handleOrderExecute = () => {
    setOrderDone(true)
    setStage(6)
  }

  const send = () => {
    if (!value.trim()) return
    onAsk(value)
    setValue('')
  }

  const totalAmount = (selectedPrice ?? BASE_PRICE) * QTY

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
        <h1 className="text-[17px] font-semibold text-ink">삼성증권mPOP AI챗봇</h1>
      </header>

      {/* 대화 영역 */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className={`mobile-scroll relative flex-1 space-y-5 overflow-y-auto px-4 py-4 ${scrolling ? 'is-scrolling' : ''}`}
      >
        {/* ── 사용자 발화 1 ── */}
        <UserBubble text={question} />

        {/* ── AI 응답 1: 호가 안내 + 호가창 ── */}
        <div className="max-w-[92%]">
          <AIBadge />

          <div className="rounded-3xl rounded-tl-md border border-white/60 bg-white/80 p-4 shadow-[0_12px_30px_-14px_rgba(35,33,54,0.22)] backdrop-blur">
            {stage === 0 ? (
              <TypingDots />
            ) : (
              <p className="text-[16px] leading-relaxed text-ink">
                {typed1}
                {stage === 1 && <Caret />}
              </p>
            )}

            {/* 호가창 카드 */}
            <AnimatePresence>
              {stage >= 2 && (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 28 }}
                  className="mt-4 overflow-hidden rounded-2xl border border-line bg-white"
                >
                  {/* 종목 헤더 */}
                  <div className="px-4 pt-3 pb-2">
                    <p className="text-[12px] font-medium text-ink-sub">
                      {STOCK.name} <span className="ml-1 text-ink-sub/70">{STOCK.code} · {STOCK.market}</span>
                    </p>
                    <p className="mt-0.5 text-[22px] font-bold text-quote-up">
                      {BASE_PRICE.toLocaleString()}
                      <span className="ml-2 text-[14px] font-semibold">
                        ▲ 14,200 (+7.96%)
                      </span>
                    </p>
                  </div>

                  {/* 호가 행 */}
                  <div className="divide-y divide-line">
                    {ORDER_BOOK.map((row) => {
                      const isCurrent = row.diff === 0
                      const isSelected = selectedPrice === row.price
                      return (
                        <Tappable
                          key={row.price}
                          type="button"
                          onClick={() => handleSelectPrice(row.price)}
                          className={`flex w-full items-center justify-between px-4 py-3 text-left transition-colors ${
                            isSelected
                              ? 'bg-violet/8'
                              : isCurrent
                              ? 'bg-aurora-lilac/40'
                              : 'hover:bg-black/[0.02]'
                          }`}
                        >
                          <span className={`text-[16px] font-semibold ${
                            isSelected ? 'text-violet' : isCurrent ? 'text-ink' : 'text-ink'
                          }`}>
                            {row.price.toLocaleString()}
                          </span>
                          <div className="flex items-center gap-2">
                            {isCurrent && (
                              <span className="rounded-full bg-ink/10 px-2 py-0.5 text-[12px] font-medium text-ink-sub">
                                현재가
                              </span>
                            )}
                            {row.diff !== 0 && (
                              <span className={`flex items-center gap-0.5 text-[15px] font-medium ${
                                row.diff > 0 ? 'text-quote-up' : 'text-quote-down'
                              }`}>
                                {row.diff > 0
                                  ? <ChevronUp className="h-4 w-4" strokeWidth={2.5} />
                                  : <ChevronDown className="h-4 w-4" strokeWidth={2.5} />
                                }
                                {Math.abs(row.diff).toLocaleString()}
                              </span>
                            )}
                            {isSelected && (
                              <Check className="h-4 w-4 text-violet" strokeWidth={2.5} />
                            )}
                          </div>
                        </Tappable>
                      )
                    })}
                  </div>

                  {/* 매수가격 선택 버튼 */}
                  <div className="p-3">
                    <Tappable
                      type="button"
                      onClick={() => selectedPrice && handleSelectPrice(selectedPrice)}
                      className={`flex w-full items-center justify-center gap-1.5 rounded-2xl py-3 text-[16px] font-semibold transition-colors ${
                        selectedPrice
                          ? 'bg-violet text-white'
                          : 'bg-line text-ink-sub'
                      }`}
                    >
                      <Check className="h-4 w-4" strokeWidth={2.5} />
                      매수가격 선택
                    </Tappable>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* ── 사용자 발화 2: 가격 선택 완료 ── */}
        <AnimatePresence>
          {stage >= 3 && selectedPrice && (
            <UserBubble
              text={`매수 금액 선택 완료`}
              animate
            />
          )}
        </AnimatePresence>

        {/* ── AI 응답 2: 주문 확인 ── */}
        <AnimatePresence>
          {stage >= 3 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="max-w-[92%]"
            >
              <AIBadge />

              <div className="rounded-3xl rounded-tl-md border border-white/60 bg-white/80 p-4 shadow-[0_12px_30px_-14px_rgba(35,33,54,0.22)] backdrop-blur">
                {stage === 3 ? (
                  <TypingDots />
                ) : (
                  <>
                    <p className="text-[16px] leading-relaxed text-ink">
                      {typed2}
                      {stage === 4 && <Caret />}
                    </p>

                    {/* 주문 확인 테이블 */}
                    <AnimatePresence>
                      {stage >= 5 && (
                        <motion.div
                          initial={{ opacity: 0, y: 14 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ type: 'spring', stiffness: 300, damping: 28 }}
                          className="mt-4 overflow-hidden rounded-2xl border border-line bg-white"
                        >
                          <div className="divide-y divide-line">
                            {[
                              { label: '종목', value: STOCK.name, highlight: false },
                              { label: '구분', value: '매수 · 지정가', highlight: true },
                              { label: '주문가격', value: `${(selectedPrice ?? BASE_PRICE).toLocaleString()}원`, highlight: false },
                              { label: '수량', value: `${QTY}주`, highlight: false },
                            ].map((row) => (
                              <div key={row.label} className="flex items-center justify-between px-4 py-3">
                                <span className="text-[14px] text-ink-sub">{row.label}</span>
                                <span className={`text-[15px] font-medium ${row.highlight ? 'text-quote-up' : 'text-ink'}`}>
                                  {row.value}
                                </span>
                              </div>
                            ))}
                            <div className="flex items-center justify-between bg-aurora-lilac/30 px-4 py-3.5">
                              <span className="text-[14px] font-semibold text-ink">총 주문금액</span>
                              <span className="text-[20px] font-bold text-ink">
                                {totalAmount.toLocaleString()}원
                              </span>
                            </div>
                          </div>

                          {/* 취소 / 매수실행 버튼 */}
                          <AnimatePresence>
                            {!orderDone && (
                              <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="flex gap-2 p-3"
                              >
                                <Tappable
                                  type="button"
                                  onClick={onBack}
                                  className="flex-1 rounded-2xl border border-line py-3 text-[15px] font-semibold text-ink-sub hover:bg-black/[0.03]"
                                >
                                  취소
                                </Tappable>
                                <Tappable
                                  type="button"
                                  onClick={handleOrderExecute}
                                  className="flex-[2] rounded-2xl bg-violet py-3 text-[15px] font-semibold text-white shadow-sm hover:opacity-90"
                                >
                                  매수 · 실행
                                </Tappable>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── 매수 주문 실행 버튼 (하단 고정 느낌) ── */}
        <AnimatePresence>
          {stage >= 5 && !orderDone && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ type: 'spring', stiffness: 300, damping: 28, delay: 0.15 }}
              className="flex justify-end"
            >
              <Tappable
                type="button"
                onClick={handleOrderExecute}
                className="rounded-full bg-violet px-6 py-3.5 text-[16px] font-bold text-white shadow-[0_8px_20px_-6px_rgba(110,93,231,0.5)] hover:opacity-90"
              >
                매수 주문 실행
              </Tappable>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── 완료 메시지 ── */}
        <AnimatePresence>
          {orderDone && (
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 320, damping: 26 }}
              className="max-w-[92%]"
            >
              <AIBadge />
              <div className="rounded-3xl rounded-tl-md border border-white/60 bg-white/80 p-4 shadow-[0_12px_30px_-14px_rgba(35,33,54,0.22)] backdrop-blur">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-violet/10">
                  <Check className="h-5 w-5 text-violet" strokeWidth={2.5} />
                </div>
                <p className="text-[16px] font-semibold text-ink">주문이 접수되었어요.</p>
                <p className="mt-1 text-[14px] leading-relaxed text-ink-sub">
                  삼성전자 {QTY}주 매수 주문이 정상 접수되었습니다. 체결 결과는 알림으로 안내드릴게요.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 하단 입력 영역 */}
      <div
        className="relative shrink-0 px-4 pt-2"
        style={{ paddingBottom: 'calc(1.5rem + env(safe-area-inset-bottom, 0px))' }}
      >
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
            aria-label="챗봇메뉴"
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
              if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
                e.preventDefault()
                send()
              }
            }}
            placeholder="필요한 업무를 입력해주세요"
            className="min-w-0 flex-1 bg-transparent text-[16px] text-ink outline-none placeholder:text-ink-sub"
          />
          <motion.button
            type="button"
            aria-label="전송"
            onClick={send}
            whileTap={{ scale: 0.88 }}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-violet text-white shadow-sm hover:opacity-90 disabled:opacity-35"
            disabled={!value.trim()}
          >
            <ArrowUp className="h-5 w-5" strokeWidth={2.4} />
          </motion.button>
        </motion.div>
        <p className="mb-1 mt-3 text-center text-[13px] text-ink-sub">
          AI는 실수할 수 있어요. 내용을 한 번 더 확인해 주세요.
        </p>
      </div>
    </div>
  )
}

function UserBubble({ text, animate = false }: { text: string; animate?: boolean }) {
  return (
    <motion.div
      initial={animate ? { opacity: 0, y: 12 } : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 360, damping: 30 }}
      className="flex justify-end"
    >
      <div className="max-w-[78%] rounded-3xl rounded-tr-md bg-violet px-4 py-3">
        <p className="text-pretty text-[16px] font-medium leading-relaxed text-white">
          {text}
        </p>
      </div>
    </motion.div>
  )
}

function AIBadge() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mb-2 flex items-center gap-1.5"
    >
      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-violet/10">
        <Sparkles className="h-3 w-3 text-violet" strokeWidth={2.2} />
      </span>
      <span className="text-[13px] font-semibold text-violet">AI상담사</span>
    </motion.div>
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
