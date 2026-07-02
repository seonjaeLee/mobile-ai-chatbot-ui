'use client'

import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  LayoutGrid,
  Mic,
  ArrowUp,
  Sparkles,
  Check,
  ChevronUp,
  ChevronDown,
} from 'lucide-react'
import { Tappable } from './tappable'

// ── 데이터 ─────────────────────────────────────────────────────
const STOCK = { name: '삼성전자', code: '005930', market: 'KOSPi' }
const BASE_PRICE = 192600
const ORDER_BOOK = [
  { price: 192800, diff: +200 },
  { price: 192700, diff: +100 },
  { price: 192600, diff: 0 },
  { price: 192500, diff: -100 },
  { price: 192400, diff: -200 },
]
const QTY = 15
const ORDER_NO = 'B20260627-0381'
const ORDER_TIME = '14:32:05'

const INTRO_TEXT = '삼성전자 1주당 매수 가격을 선택하거나 입력해 주세요.'
const CONFIRM_INTRO = `아래 내용과 같이 삼성전자 ${QTY}주 매수 접수 할게요. 확인 후 주문을 실행해 주세요. 주문 실행 시 정정·취소가 제한될 수 있어요.`
const DONE_TEXT = '매수 주문이 정상 접수되었어요. 체결 여부는 거래내역에서 확인할 수 있어요. 체결되면 알림으로 알려드릴게요.'

// ISA 단순 답변 모드
const ISA_TEXT = 'ISA(개인종합자산관리계좌)는 예금·펀드·ETF를 한 계좌에 담아 비과세 혜택을 받는 절세 계좌예요.'
const ISA_CHIPS = ['가입 자격 확인', '납입 한도 조회', '계좌 개설하기']

// stage
// 0 = AI 타이핑 dots
// 1 = 호가 안내 텍스트 스트리밍 (매수 모드) / ISA 텍스트 스트리밍 (ISA 모드)
// 2 = 호가창 카드 (매수 모드) / ISA 칩 노출 (ISA 모드)
// 3 = 사용자 발화 2 + AI 타이핑 dots
// 4 = 주문확인 텍스트 스트리밍
// 5 = 주문확인 카드 (매수실행 전)
// 6 = 사용자 발화 3 + 완료
type Stage = 0 | 1 | 2 | 3 | 4 | 5 | 6

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
  // ISA 질문 여부 판단 — question에 'ISA'가 포함되면 단순 답변 모드
  const isISA = question.includes('ISA')

  const [stage, setStage] = useState<Stage>(0)
  const [typed1, setTyped1] = useState('')
  const [typed2, setTyped2] = useState('')
  const [selectedPrice, setSelectedPrice] = useState<number | null>(null)
  // priceConfirmed: 매수가격선택 버튼 눌린 상태
  const [priceConfirmed, setPriceConfirmed] = useState(false)
  // orderExecuted: 매수실행 버튼 눌린 상태
  const [orderExecuted, setOrderExecuted] = useState(false)
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

  // stage 0 → 1
  useEffect(() => {
    const t = setTimeout(() => setStage(1), 900)
    return () => clearTimeout(t)
  }, [])

  // stage 1: 타이핑 — ISA 모드와 매수 모드 분기
  useEffect(() => {
    if (stage !== 1) return
    const text = isISA ? ISA_TEXT : INTRO_TEXT
    let i = 0
    const id = setInterval(() => {
      i++
      setTyped1(text.slice(0, i))
      if (i >= text.length) { clearInterval(id); setTimeout(() => setStage(2), 300) }
    }, 22)
    return () => clearInterval(id)
  }, [stage, isISA])

  // stage 3 → 4
  useEffect(() => {
    if (stage !== 3) return
    const t = setTimeout(() => setStage(4), 800)
    return () => clearTimeout(t)
  }, [stage])

  // stage 4: 타이핑
  useEffect(() => {
    if (stage !== 4) return
    let i = 0
    const id = setInterval(() => {
      i++
      setTyped2(CONFIRM_INTRO.slice(0, i))
      if (i >= CONFIRM_INTRO.length) { clearInterval(id); setTimeout(() => setStage(5), 300) }
    }, 18)
    return () => clearInterval(id)
  }, [stage])

  // 자동 스크롤
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [stage, typed1, typed2, selectedPrice, priceConfirmed, orderExecuted])

  // 가격 탭
  const handleSelectPrice = (price: number) => {
    if (priceConfirmed || stage !== 2) return
    setSelectedPrice(price)
  }

  // 매수가격선택 버튼 → 체크 + 비활성 + 사용자 발화 트리거
  const handlePriceConfirm = () => {
    if (!selectedPrice || priceConfirmed || stage !== 2) return
    setPriceConfirmed(true)
    setTimeout(() => setStage(3), 400)
  }

  // 매수실행 버튼 → 체크 + 비활성 + 사용자 발화 + 완료
  const handleOrderExecute = () => {
    if (orderExecuted || stage !== 5) return
    setOrderExecuted(true)
    setTimeout(() => setStage(6), 400)
  }

  const send = () => {
    if (!value.trim()) return
    onAsk(value)
    setValue('')
  }

  const totalAmount = (selectedPrice ?? BASE_PRICE) * QTY

  return (
    <div className="relative flex h-full flex-col">{/* 배경은 prototype.tsx에서 공유 */}

      {/* ── 스크롤 대화 영역: pt-14로 헤더 아래 시작 ── */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className={`mobile-scroll relative flex-1 overflow-y-auto px-4 pb-4 pt-3 ${scrolling ? 'is-scrolling' : ''}`}
      >
        <div className="flex flex-col gap-5 py-3">

          {/* ━━ 사용자 발화 1 ━━ */}
          <UserBubble text={question} />

          {/* ━━ AI 응답 1 ━━ */}
          <div className="flex flex-col gap-2">
            <AIBadge />
            {/* 말풍선 */}
            <div className="max-w-[86%]">
              <div className="rounded-2xl rounded-tl-[6px] border border-line/50 bg-white px-4 py-3 shadow-sm">
                {stage === 0
                  ? <TypingDots />
                  : <p className="text-[16px] leading-relaxed text-ink">{typed1}{stage === 1 && <Caret />}</p>
                }
              </div>
            </div>

            {/* ISA 모드: 연관 칩 */}
            <AnimatePresence>
              {isISA && stage >= 2 && (
                <motion.div
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 28 }}
                  className="flex flex-wrap gap-2 pt-1"
                >
                  {ISA_CHIPS.map((chip) => (
                    <Tappable
                      key={chip}
                      type="button"
                      className="rounded-full border border-line bg-white/80 px-4 py-2 text-[14px] font-medium text-ink transition-colors hover:border-violet/40 hover:bg-violet-soft hover:text-violet"
                    >
                      {chip}
                    </Tappable>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* 호가창 카드 (매수 모드 전용) */}
            <AnimatePresence>
              {!isISA && stage >= 2 && (
                <motion.div
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 28 }}
                  className="mr-10 overflow-hidden rounded-2xl border border-line bg-white shadow-[0_4px_24px_-8px_rgba(35,33,54,0.14)]"
                >
                  {/* 종목 헤더 */}
                  <div className="border-b border-line px-4 pb-3 pt-4">
                    <p className="mb-0.5 text-[12px] font-medium text-ink-sub">
                      {STOCK.name}&nbsp;
                      <span className="text-ink-sub/70">{STOCK.code} · {STOCK.market}</span>
                    </p>
                    <p className="text-[22px] font-bold leading-tight text-quote-up">
                      {BASE_PRICE.toLocaleString()}
                      <span className="ml-2 text-[14px] font-semibold">▲ 14,200 (+7.96%)</span>
                    </p>
                  </div>

                  {/* 호가 행: 모두 동일 스타일, 선택만 하이라이트 */}
                  <div className="divide-y divide-line/60">
                    {ORDER_BOOK.map((row) => {
                      const isSelected = selectedPrice === row.price
                      const isCurrent = row.diff === 0
                      return (
                        <Tappable
                          key={row.price}
                          type="button"
                          disabled={priceConfirmed}
                          onClick={() => handleSelectPrice(row.price)}
                          className={`flex w-full items-center justify-between px-4 py-3.5 transition-colors ${
                            isSelected
                              ? 'bg-violet/[0.07]'
                              : 'hover:bg-black/[0.02]'
                          }`}
                        >
                          <span className={`text-[16px] font-semibold ${isSelected ? 'text-violet' : 'text-ink'}`}>
                            {row.price.toLocaleString()}
                          </span>
                          <div className="flex items-center gap-2">
                            {isCurrent && (
                              <span className="rounded-full bg-ink/[0.07] px-2 py-0.5 text-[12px] font-medium text-ink-sub">
                                현재가
                              </span>
                            )}
                            {row.diff !== 0 && (
                              <span className={`flex items-center gap-0.5 text-[14px] font-semibold ${row.diff > 0 ? 'text-quote-up' : 'text-quote-down'}`}>
                                {row.diff > 0
                                  ? <ChevronUp className="h-3.5 w-3.5" strokeWidth={2.5} />
                                  : <ChevronDown className="h-3.5 w-3.5" strokeWidth={2.5} />
                                }
                                {Math.abs(row.diff).toLocaleString()}
                              </span>
                            )}
                          </div>
                        </Tappable>
                      )
                    })}
                  </div>

                  {/* 매수가격 선택 버튼 */}
                  <div className="p-3 pt-2">
                    <motion.button
                      type="button"
                      onClick={handlePriceConfirm}
                      disabled={!selectedPrice || priceConfirmed}
                      animate={
                        priceConfirmed
                          ? { backgroundColor: 'rgb(236,235,242)', color: 'rgb(83,82,101)' }
                          : selectedPrice
                          ? { backgroundColor: 'rgb(110,93,231)', color: '#ffffff' }
                          : { backgroundColor: 'rgb(236,235,242)', color: 'rgb(83,82,101)' }
                      }
                      transition={{ duration: 0.2 }}
                      className="relative w-full rounded-2xl py-3.5 text-[16px] font-semibold disabled:cursor-not-allowed"
                    >
                      {/* ���스트는 항상 중앙 고정 */}
                      <span className="flex items-center justify-center">매수가격 선택</span>
                      {/* 체크는 절대위치 우측 — 텍스트 위치에 영향 없음 */}
                      <AnimatePresence>
                        {priceConfirmed && (
                          <motion.span
                            key="checked"
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: 'spring', stiffness: 400, damping: 22 }}
                            className="absolute right-4 top-1/2 -translate-y-1/2"
                          >
                            <Check className="h-4 w-4" strokeWidth={2.5} />
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ━━ 사용자 발화 2: 매수금액선택완료 ━━ */}
          <AnimatePresence>
            {stage >= 3 && (
              <UserBubble text="매수금액선택완료" delay={0} key="user2" />
            )}
          </AnimatePresence>

          {/* ━━ AI 응답 2: 주문 확인 ━━ */}
          <AnimatePresence>
            {stage >= 3 && (
              <motion.div
                key="ai2"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="flex flex-col gap-2"
              >
                <AIBadge />

                {/* 말풍선 */}
                <div className="max-w-[86%]">
                  <div className="rounded-2xl rounded-tl-[6px] border border-line/50 bg-white px-4 py-3 shadow-sm">
                    {stage === 3
                      ? <TypingDots />
                      : <p className="text-[16px] leading-relaxed text-ink">{typed2}{stage === 4 && <Caret />}</p>
                    }
                  </div>
                </div>

                {/* 주문 확인 카드 */}
                <AnimatePresence>
                  {stage >= 5 && (
                    <motion.div
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 28, delay: 0.06 }}
                      className="mr-10 overflow-hidden rounded-2xl border border-line bg-white shadow-[0_4px_24px_-8px_rgba(35,33,54,0.14)]"
                    >
                      {/* 주문 내역 테이블: 배경색 없음 */}
                      <div className="divide-y divide-line/60">
                        {[
                          { label: '종목', value: STOCK.name, accent: false },
                          { label: '구분', value: '매수 · 지정가', accent: true },
                          { label: '주문가격', value: `${(selectedPrice ?? BASE_PRICE).toLocaleString()}원`, accent: false },
                          { label: '수량', value: `${QTY}주`, accent: false },
                          { label: '총 주문금액', value: `${totalAmount.toLocaleString()}원`, bold: true },
                        ].map((row) => (
                          <div key={row.label} className="flex items-center justify-between px-4 py-3.5">
                            <span className="text-[14px] text-ink-sub">{row.label}</span>
                            <span className={`text-[15px] ${
                              row.bold ? 'font-bold text-ink text-[17px]' :
                              row.accent ? 'font-semibold text-quote-up' :
                              'font-medium text-ink'
                            }`}>
                              {row.value}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* 취소 / 매수 실행 버튼 */}
                      <div className="flex gap-2 p-3 pt-2">
                        <Tappable
                          type="button"
                          onClick={onBack}
                          disabled={orderExecuted}
                          className="flex-1 rounded-2xl border border-line py-3.5 text-[15px] font-semibold text-ink-sub hover:bg-black/[0.03] disabled:opacity-40"
                        >
                          취소
                        </Tappable>
                        <motion.button
                          type="button"
                          onClick={handleOrderExecute}
                          disabled={orderExecuted}
                          animate={
                            orderExecuted
                              ? { backgroundColor: 'rgb(236,235,242)', color: 'rgb(83,82,101)' }
                              : { backgroundColor: 'rgb(110,93,231)', color: '#ffffff' }
                          }
                          transition={{ duration: 0.2 }}
                          className="relative flex-[2] rounded-2xl py-3.5 text-[15px] font-semibold shadow-sm disabled:cursor-not-allowed"
                        >
                          {/* 텍스트는 ��상 중앙 고정 */}
                          <span className="flex items-center justify-center">매수 · 실행</span>
                          {/* 체크는 절대위치 우측 */}
                          <AnimatePresence>
                            {orderExecuted && (
                              <motion.span
                                key="exec-check"
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ type: 'spring', stiffness: 400, damping: 22 }}
                                className="absolute right-4 top-1/2 -translate-y-1/2"
                              >
                                <Check className="h-4 w-4" strokeWidth={2.5} />
                              </motion.span>
                            )}
                          </AnimatePresence>
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ━━ 사용자 발화 3: 매수주문실행 ━━ */}
          <AnimatePresence>
            {stage >= 6 && (
              <UserBubble text="매수 주문 실행" delay={0} key="user3" />
            )}
          </AnimatePresence>

          {/* ━━ AI 응답 3: 완료 ━━ */}
          <AnimatePresence>
            {stage >= 6 && (
              <motion.div
                key="ai3"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30, delay: 0.1 }}
                className="flex flex-col gap-2"
              >
                <AIBadge />

                {/* 말풍선 */}
                <div className="max-w-[86%]">
                  <div className="rounded-2xl rounded-tl-[6px] border border-line/50 bg-white px-4 py-3 shadow-sm">
                    <p className="text-[16px] leading-relaxed text-ink">{DONE_TEXT}</p>
                  </div>
                </div>

                {/* 주문 접수 완료 카드 */}
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 28, delay: 0.18 }}
                  className="mr-10 overflow-hidden rounded-2xl border border-line bg-white shadow-[0_4px_24px_-8px_rgba(35,33,54,0.14)]"
                >
                  {/* 체크 + 타이틀 중앙 정렬 */}
                  <div className="flex flex-col items-center gap-2 px-4 pb-4 pt-6">
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: 'spring', stiffness: 380, damping: 22, delay: 0.3 }}
                      className="flex h-12 w-12 items-center justify-center rounded-full bg-[#daefee]"
                    >
                      <Check className="h-6 w-6 text-[#2a7a6f]" strokeWidth={2.5} />
                    </motion.div>
                    <p className="text-[18px] font-bold text-ink">주문 접수 완료</p>
                  </div>

                  {/* 상세 내역 */}
                  <div className="divide-y divide-line/60 border-t border-line/60">
                    {[
                      { label: '종목', value: STOCK.name },
                      { label: '구분', value: '매수 · 지정가', accent: true },
                      { label: '주문 수량', value: `${QTY}주` },
                      { label: '주문가격', value: `${(selectedPrice ?? BASE_PRICE).toLocaleString()}원` },
                      { label: '총 주문금액', value: `${totalAmount.toLocaleString()}원`, bold: true },
                      { label: '주문번호', value: ORDER_NO },
                      { label: '접수시각', value: ORDER_TIME },
                    ].map((row) => (
                      <div key={row.label} className="flex items-center justify-between px-4 py-3">
                        <span className="text-[14px] text-ink-sub">{row.label}</span>
                        <span className={`text-[14px] ${
                          row.bold ? 'text-[16px] font-bold text-ink' :
                          row.accent ? 'font-semibold text-quote-up' :
                          'font-medium text-ink'
                        }`}>
                          {row.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>

      {/* ── 하단 입력 영역 ── */}
      {/* 하단 입력 영역 — layoutId로 home 중앙 카드와 연결 */}
      <motion.div
        layoutId="chat-input"
        layout
        animate={{
          borderColor: focused ? 'rgba(110,93,231,0.4)' : 'rgba(236,235,242,1)',
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 32 }}
        className="shrink-0 rounded-t-3xl border-x border-t bg-white/95 shadow-[0_-8px_32px_-8px_rgba(35,33,54,0.12)] backdrop-blur"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        {/* 1행: 텍스트 입력 */}
        <div className="px-5 pt-5">
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
            className="w-full bg-transparent text-[16px] text-ink outline-none placeholder:text-ink-sub"
          />
        </div>
        {/* 2행: 버튼 영역 */}
        <div className="flex items-center justify-between px-4 pb-4 pt-3">
          <Tappable
            type="button"
            aria-label="챗봇 메뉴"
            onClick={onOpenMenu}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-ink-sub hover:bg-black/5"
          >
            <LayoutGrid className="h-5 w-5" strokeWidth={1.8} />
          </Tappable>
          <div className="flex items-center gap-2">
            <Tappable
              type="button"
              aria-label="음성 입력"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-ink-sub hover:bg-black/5"
            >
              <Mic className="h-5 w-5" strokeWidth={1.8} />
            </Tappable>
            <motion.button
              type="button"
              aria-label="전송"
              onClick={send}
              whileTap={{ scale: 0.88 }}
              disabled={!value.trim()}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-violet text-white shadow-sm hover:opacity-90 disabled:opacity-30"
            >
              <ArrowUp className="h-5 w-5" strokeWidth={2.4} />
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

// ── 공통 서브 컴포넌트 ────────────────────────────────────────

function UserBubble({ text, delay = 0 }: { text: string; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14, x: 8 }}
      animate={{ opacity: 1, y: 0, x: 0 }}
      transition={{ type: 'spring', stiffness: 360, damping: 30, delay }}
      className="flex justify-end"
    >
      <div className="max-w-[78%] rounded-2xl rounded-tr-[6px] bg-violet px-4 py-3">
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
      initial={{ opacity: 0, x: -6 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2 }}
      className="flex items-center gap-1.5"
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
    <div className="flex items-center gap-1.5 py-0.5" aria-label="답변 작성 중">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="h-2 w-2 rounded-full bg-violet/40"
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
