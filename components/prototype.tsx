'use client'

import { useState, useCallback } from 'react'
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion'
import { ArrowLeft, Signal, Wifi, BatteryFull, X } from 'lucide-react'
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
  const [headerHasScrolled, setHeaderHasScrolled] = useState(false)

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
      {/* ── 배경: 전체 높이 채우기, 모든 화면이 공유 ── */}
      <AuroraBg className="fixed inset-0 z-0" />

      {/* ── 고정 헤더: 채팅 화면에서만 표시 ── */}
      {/* 고정 헤더: 키패드 올라와도 밀리지 않도록 fixed 사용 */}
      <AnimatePresence>
        {screen === 'chat' && (
          <motion.div
            key="chat-header"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed left-0 right-0 top-0 z-40 flex h-14 shrink-0 items-center justify-center border-b bg-white px-4 transition-all duration-200"
            style={{
              borderColor: headerHasScrolled ? 'rgba(236,235,242,1)' : 'transparent',
              backgroundColor: headerHasScrolled ? 'rgba(255,255,255,0.7)' : 'rgb(255,255,255)',
              backdropFilter: headerHasScrolled ? 'blur(10px)' : 'none',
              boxShadow: headerHasScrolled ? '0 4px 12px -4px rgba(35,33,54,0.12)' : 'none',
            }}
          >
            <Tappable
              type="button"
              aria-label="닫기"
              onClick={goHome}
              className="absolute left-4 flex h-9 w-9 items-center justify-center rounded-full text-ink hover:bg-black/5"
            >
              <X className="h-6 w-6" strokeWidth={2} />
            </Tappable>
            <h1 className="text-[17px] font-semibold text-ink">삼성증권mPOP AI챗봇</h1>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── 화면 전환 영역 ── */}
      {/* LayoutGroup: home/chat 동시 마운트 → layoutId가 두 화면 간에 작동 */}
      <LayoutGroup>
      <div className="relative z-10 inset-0 overflow-hidden" style={{ position: isMobile ? 'fixed' : 'absolute', inset: 0 }}>
        {/* 홈 화면 — chat 전환 시 fade out */}
        <motion.div
          animate={{ opacity: screen === 'home' ? 1 : 0, pointerEvents: screen === 'home' ? 'auto' : 'none' }}
          transition={{ duration: 0.28, ease: 'easeInOut' }}
          className="absolute inset-0"
        >
          <ScreenHome
            onAsk={ask}
            onOpenMenu={() => setMenuOpen(true)}
            isMobile={isMobile}
            isExiting={screen === 'chat'}
          />
        </motion.div>

        {/* 채팅 화면 — home에서 chat으로 전환 시 fade in */}
        <motion.div
          animate={{ opacity: screen === 'chat' ? 1 : 0, pointerEvents: screen === 'chat' ? 'auto' : 'none' }}
          transition={{ duration: 0.28, ease: 'easeInOut' }}
          className="absolute inset-0"
        >
          <ScreenChat
            key={chatKey}
            question={question}
            onBack={goHome}
            onAsk={ask}
            onOpenMenu={() => setMenuOpen(true)}
            onScrollChange={setHeaderHasScrolled}
          />
        </motion.div>
      </div>
      </LayoutGroup>

      <MenuSheet
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        onNewChat={() => {
          setMenuOpen(false)
          goHome()
        }}
        onAsk={ask}
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
              style={{ height: SCREEN_H, contain: 'strict' }}
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
    <div className="flex h-[54px] items-end justify-between px-7 pb-2 text-white">
      <span className="text-[15px] font-semibold tracking-tight">9:41</span>
      <div className="flex items-center gap-1.5">
        <Signal className="h-[15px] w-[15px]" strokeWidth={2.5} />
        <Wifi className="h-[15px] w-[15px]" strokeWidth={2.5} />
        <BatteryFull className="h-[18px] w-[18px]" strokeWidth={2} />
      </div>
    </div>
  )
}
