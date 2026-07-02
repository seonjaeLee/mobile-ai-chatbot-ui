'use client'

import { useState, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, Signal, Wifi, BatteryFull } from 'lucide-react'
import { ScreenHome } from './screen-home'
import { ScreenChat } from './screen-chat'
import { MenuSheet } from './menu-sheet'
import { Tappable } from './tappable'
import { AuroraBg } from './aurora-bg'

export type Screen = 'home' | 'chat'

// PC 목업 내부 콘텐츠 높이 (상태바 54px 제외)
const SCREEN_H = 844 - 54

export function Prototype() {
  const [screen, setScreen] = useState<Screen>('home')
  const [menuOpen, setMenuOpen] = useState(false)
  const [question, setQuestion] = useState('')
  const [chatKey, setChatKey] = useState(0)

  const ask = useCallback((q: string) => {
    const text = q.trim()
    if (!text) return
    setQuestion(text)
    setChatKey((k) => k + 1)
    setScreen('chat')
  }, [])

  const goHome = useCallback(() => setScreen('home'), [])

  /** 공통 콘텐츠 영역 */
  const content = (isMobile: boolean) => (
    <>
      {/* ── 배경: 항상 최하단에 고정, 모든 화면이 공유 ── */}
      <AuroraBg />

      {/* ── 고정 헤더: 채팅 화면에서만 표시 ── */}
      <AnimatePresence>
        {screen === 'chat' && (
          <motion.div
            key="chat-header"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="sticky top-0 z-30 flex h-14 shrink-0 items-center justify-center border-b border-line/20 bg-white/60 px-4 backdrop-blur-md"
          >
            <Tappable
              type="button"
              aria-label="뒤로"
              onClick={goHome}
              className="absolute left-3 flex h-10 w-10 items-center justify-center rounded-full text-ink hover:bg-black/5"
            >
              <ArrowLeft className="h-[22px] w-[22px]" strokeWidth={2} />
            </Tappable>
            <h1 className="text-[17px] font-semibold text-ink">삼성증권mPOP AI챗봇</h1>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── 화면 전환 영역 ── */}
      <AnimatePresence initial={false} mode="popLayout">
        {screen === 'home' ? (
          <motion.div
            key="home"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ type: 'spring', stiffness: 340, damping: 36 }}
            className="absolute inset-0"
          >
            <ScreenHome
              onAsk={ask}
              onOpenMenu={() => setMenuOpen(true)}
              isMobile={isMobile}
            />
          </motion.div>
        ) : (
          <motion.div
            key="chat"
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 14 }}
            transition={{ type: 'spring', stiffness: 340, damping: 36 }}
            className="absolute inset-x-0 bottom-0 top-14"
          >
            <ScreenChat
              key={chatKey}
              question={question}
              onBack={goHome}
              onAsk={ask}
              onOpenMenu={() => setMenuOpen(true)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <MenuSheet
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        onNewChat={() => {
          setMenuOpen(false)
          goHome()
        }}
      />
    </>
  )

  return (
    <>
      {/* ── 모바일: 풀스크린 (md 미만) ── */}
      {/* dvh: 키패드가 올라와도 뷰포트 높이가 줄어드므로 콘텐츠가 밀리지 않음 */}
      <div className="fixed inset-0 md:hidden" style={{ height: '100dvh' }}>
        <div className="relative h-full w-full overflow-hidden">
          {content(true)}
        </div>
      </div>

      {/* ── PC: 폰 목업 (md 이상) ── */}
      <div className="hidden md:flex md:flex-col md:items-center md:gap-5">
        <div className="relative h-[844px] w-[390px] shrink-0 rounded-[3.2rem] bg-[#0d0d12] p-[12px] shadow-[0_40px_90px_-20px_rgba(35,33,54,0.45)]">
          <div className="relative h-full w-full overflow-hidden rounded-[2.5rem]">
            <StatusBar />
            <div
              className="relative w-full overflow-hidden"
              style={{ height: SCREEN_H }}
            >
              {content(false)}
            </div>
          </div>
          {/* 다이나믹 아일랜드 */}
          <div className="pointer-events-none absolute left-1/2 top-[20px] z-50 h-[26px] w-[104px] -translate-x-1/2 rounded-full bg-[#0d0d12]" />
        </div>

        <p className="max-w-[390px] text-center text-[13px] leading-relaxed text-ink-sub">
          입력창에 질문을 보내거나 칩을 눌러 대화를 시작해 보세요. 하단{' '}
          <span className="font-medium text-ink">챗봇 메뉴</span>를 끌어올리거나
          아래로 드래그해 닫을 수 있어요.
        </p>
      </div>
    </>
  )
}

function StatusBar() {
  return (
    <div className="flex h-[54px] items-end justify-between px-7 pb-2 text-ink">
      <span className="text-[15px] font-semibold tracking-tight">9:41</span>
      <div className="flex items-center gap-1.5">
        <Signal className="h-[15px] w-[15px]" strokeWidth={2.5} />
        <Wifi className="h-[15px] w-[15px]" strokeWidth={2.5} />
        <BatteryFull className="h-[18px] w-[18px]" strokeWidth={2} />
      </div>
    </div>
  )
}
