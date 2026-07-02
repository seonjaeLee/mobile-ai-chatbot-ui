'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { X, LayoutGrid, Mic, ArrowUp } from 'lucide-react'
import { Tappable } from './tappable'


export function ScreenHome({
  onAsk,
  onOpenMenu,
  isMobile = false,
}: {
  onAsk: (q: string) => void
  onOpenMenu: () => void
  isMobile?: boolean
}) {
  const [value, setValue] = useState('')
  const [focused, setFocused] = useState(false)

  const send = () => {
    if (!value.trim()) return
    onAsk(value)
    setValue('')
  }

  return (
    <div className="relative flex h-full flex-col">{/* 배경은 prototype.tsx에서 공유 */}

      {/* 상단 바 — 채팅 헤더와 동일한 blur 처리로 배경 통일 */}
      <header className="relative flex h-14 items-center justify-center border-b border-line/20 bg-white/60 px-4 backdrop-blur-md">
        <Tappable
          type="button"
          aria-label="닫기"
          className="absolute left-3 flex h-10 w-10 items-center justify-center rounded-full text-ink hover:bg-black/5"
        >
          <X className="h-[22px] w-[22px]" strokeWidth={2} />
        </Tappable>
        <h1 className="text-[17px] font-semibold text-ink">삼성증권mPOP AI챗봇</h1>
      </header>

      {/* 중앙 영역 */}
      <motion.div
        initial="hidden"
        animate="show"
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
        }}
        className="relative flex flex-1 flex-col items-center justify-center px-6"
      >
        <motion.p
          variants={fadeUp}
          className="mb-3 text-[15px] font-medium text-ink"
        >
          선재Lee님 안녕하세요.
        </motion.p>
        <motion.h2
          variants={fadeUp}
          className="mb-3 text-balance text-center text-[28px] font-bold leading-snug text-ink"
        >
          어떤 업무를 도와드릴까요?
        </motion.h2>
        <motion.p
          variants={fadeUp}
          className="mb-9 text-[15px] text-ink-sub"
        >
          AI 상담사에게 자유롭게 물어보세요.
        </motion.p>



      </motion.div>

      {/* 입력창 — 하단 바텀시트: 상단만 둥글고 좌우하단은 화면 끝까지 */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30, delay: 0.25 }}
        style={{
          borderColor: focused ? 'rgba(110,93,231,0.4)' : 'rgba(236,235,242,1)',
          paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        }}
        className="shrink-0 rounded-t-3xl border-x border-t bg-white/95 shadow-[0_-8px_32px_-8px_rgba(35,33,54,0.12)] backdrop-blur"
      >
        {/* 1행: 텍스트 입력 */}
        <div className="px-5 pt-5">
          <textarea
            rows={1}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
                e.preventDefault()
                send()
              }
            }}
            placeholder="필요한 업무를 입력해주세요"
            className="w-full resize-none bg-transparent text-[16px] leading-relaxed text-ink outline-none placeholder:text-ink-sub"
          />
        </div>
        {/* 2행: 버튼 영역 */}
        <div className="flex items-center justify-between px-4 pb-4 pt-3">
          <Tappable
            type="button"
            aria-label="챗봇 메뉴"
            onClick={onOpenMenu}
            className="flex h-9 w-9 items-center justify-center rounded-full text-ink-sub hover:bg-black/5"
          >
            <LayoutGrid className="h-5 w-5" strokeWidth={1.8} />
          </Tappable>
          <div className="flex items-center gap-2">
            <Tappable
              type="button"
              aria-label="음성 입력"
              className="flex h-9 w-9 items-center justify-center rounded-full text-ink-sub hover:bg-black/5"
            >
              <Mic className="h-5 w-5" strokeWidth={1.8} />
            </Tappable>
            <Tappable
              type="button"
              aria-label="전송"
              onClick={send}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-violet text-white shadow-sm hover:opacity-90 disabled:opacity-30"
            >
              <ArrowUp className="h-5 w-5" strokeWidth={2.4} />
            </Tappable>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 320, damping: 30 } },
}
