'use client'

import { useState, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Signal, Wifi, BatteryFull } from 'lucide-react'
import { ScreenHome } from './screen-home'
import { ScreenChat } from './screen-chat'
import { MenuSheet } from './menu-sheet'

export type Screen = 'home' | 'chat'

const SCREEN_H = 844 - 54

export function Prototype() {
  const [screen, setScreen] = useState<Screen>('home')
  const [menuOpen, setMenuOpen] = useState(false)
  const [question, setQuestion] = useState('')
  // chat 화면을 매번 새로 마운트해 스트리밍을 재생하기 위한 키
  const [chatKey, setChatKey] = useState(0)

  const ask = useCallback((q: string) => {
    const text = q.trim()
    if (!text) return
    setQuestion(text)
    setChatKey((k) => k + 1)
    setScreen('chat')
  }, [])

  const goHome = useCallback(() => setScreen('home'), [])

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="relative h-[844px] w-[390px] shrink-0 rounded-[3.2rem] bg-[#0d0d12] p-[12px] shadow-[0_40px_90px_-20px_rgba(35,33,54,0.45)]">
        <div className="relative h-full w-full overflow-hidden rounded-[2.5rem] bg-white">
          <StatusBar />

          {/* 화면 영역 */}
          <div
            className="relative w-full overflow-hidden"
            style={{ height: SCREEN_H }}
          >
            <AnimatePresence initial={false} mode="popLayout">
              {screen === 'home' ? (
                <motion.div
                  key="home"
                  initial={{ opacity: 0, x: -40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ type: 'spring', stiffness: 320, damping: 34 }}
                  className="absolute inset-0"
                >
                  <ScreenHome onAsk={ask} onOpenMenu={() => setMenuOpen(true)} />
                </motion.div>
              ) : (
                <motion.div
                  key="chat"
                  initial={{ opacity: 0, x: 60 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 60 }}
                  transition={{ type: 'spring', stiffness: 320, damping: 34 }}
                  className="absolute inset-0"
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

            {/* 전체메뉴 바텀시트 */}
            <MenuSheet
              open={menuOpen}
              onClose={() => setMenuOpen(false)}
              onNewChat={() => {
                setMenuOpen(false)
                goHome()
              }}
            />
          </div>
        </div>

        {/* 다이나믹 아일랜드 */}
        <div className="pointer-events-none absolute left-1/2 top-[20px] z-50 h-[26px] w-[104px] -translate-x-1/2 rounded-full bg-[#0d0d12]" />
      </div>

      <p className="max-w-[390px] text-center text-[13px] leading-relaxed text-ink-sub">
        입력창에 질문을 보내거나 칩을 눌러 대화를 시작해 보세요. 하단{' '}
        <span className="font-medium text-ink">전체메뉴</span>를 끌어올리거나
        아래로 드래그해 닫을 수 있어요.
      </p>
    </div>
  )
}

/** 시스템 기본 상태바 (색칠 금지, 기본 잉크 컬러) */
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
