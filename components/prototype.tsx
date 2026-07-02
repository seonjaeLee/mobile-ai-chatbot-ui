'use client'

import { useState, useCallback } from 'react'
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { ScreenHome } from './screen-home'
import { ScreenChat } from './screen-chat'
import { MenuSheet } from './menu-sheet'
import { Tappable } from './tappable'
import { AuroraBg } from './aurora-bg'

export type Screen = 'home' | 'chat'

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

  return (
    <div className="fixed inset-0 h-screen w-screen overflow-hidden" style={{ height: '100dvh' }}>
      {/* 배경: 전체 고정 */}
      <AuroraBg className="fixed inset-0 z-0" />

      {/* 고정 헤더: 채팅 화면에서만 표시 */}
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

      {/* 화면 전환 영역 */}
      <LayoutGroup>
        <div className="relative z-10 h-full w-full overflow-hidden">
          {/* 홈 화면 */}
          <motion.div
            animate={{ opacity: screen === 'home' ? 1 : 0, pointerEvents: screen === 'home' ? 'auto' : 'none' }}
            transition={{ duration: 0.28, ease: 'easeInOut' }}
            className="absolute inset-0"
          >
            <ScreenHome
              onAsk={ask}
              onOpenMenu={() => setMenuOpen(true)}
              isExiting={screen === 'chat'}
            />
          </motion.div>

          {/* 채팅 화면 */}
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

      {/* 메뉴 */}
      <MenuSheet
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        onNewChat={() => {
          setMenuOpen(false)
          goHome()
        }}
        onAsk={ask}
      />
    </div>
  )
}
