'use client'

import { useState } from 'react'
import { AnimatePresence, motion, type PanInfo } from 'framer-motion'
import {
  X,
  ChevronDown,
  Receipt,
  Wallet,
  PiggyBank,
  TrendingUp,
} from 'lucide-react'
import { Tappable } from './tappable'

const ACCORDION_ITEMS = [
  { icon: Receipt, title: '주문', desc: '매수·매도·정정·취소', subs: ['매수', '매도', '정정', '취소'] },
  { icon: Wallet, title: '계좌', desc: '잔고·거래내역·예수금', subs: ['잔고', '거래내역', '예수금', '이체'] },
  { icon: PiggyBank, title: '연금', desc: '개인연금·퇴직연금(IRP)', subs: ['개인연금', 'IRP', '연금이전'] },
  { icon: TrendingUp, title: '금융상품', desc: '펀드·ELS·ISA', subs: ['펀드', 'ELS', 'ISA', 'RP'] },
]

export function MenuSheet({
  open,
  onClose,
  onNewChat,
}: {
  open: boolean
  onClose: () => void
  onNewChat: () => void
}) {
  const [expanded, setExpanded] = useState<string | null>('주문')

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    // 아래로 충분히 끌거나 빠르게 스와이프하면 닫기
    if (info.offset.y > 120 || info.velocity.y > 600) onClose()
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* 딤 배경 */}
          <motion.button
            type="button"
            aria-label="전체메뉴 닫기"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 z-40 bg-ink/30"
          />

          {/* 바텀시트 */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 340, damping: 36 }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.6 }}
            onDragEnd={handleDragEnd}
            className="absolute inset-x-0 bottom-0 z-50 flex max-h-[88%] flex-col rounded-t-[2rem] bg-white shadow-[0_-20px_50px_-12px_rgba(35,33,54,0.3)]"
          >
            {/* 그랩 핸들 (드래그 손잡이) */}
            <div className="flex cursor-grab justify-center pt-3 active:cursor-grabbing">
              <span className="h-1.5 w-10 rounded-full bg-line" />
            </div>

            {/* 헤더 */}
            <div className="flex items-center justify-between px-5 pb-2 pt-4">
              <h2 className="text-[17px] font-bold text-ink">챗봇 메뉴</h2>
              <Tappable
                type="button"
                aria-label="닫기"
                onClick={onClose}
                className="flex h-9 w-9 items-center justify-center rounded-full text-ink-sub hover:bg-black/5"
              >
                <X className="h-5 w-5" strokeWidth={2} />
              </Tappable>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto">
              {/* 아코디언 */}
              <div className="mt-1 px-2 pb-8">
                {ACCORDION_ITEMS.map((item) => {
                  const isOpen = expanded === item.title
                  return (
                    <div key={item.title} className="border-b border-line last:border-b-0">
                      <Tappable
                        type="button"
                        aria-expanded={isOpen}
                        onClick={() => setExpanded(isOpen ? null : item.title)}
                        className="flex w-full items-center gap-3.5 rounded-2xl px-3 py-4 text-left hover:bg-black/[0.03]"
                      >
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-black/[0.04]">
                          <item.icon className="h-5 w-5 text-ink" strokeWidth={1.8} />
                        </span>
                        <span className="flex-1">
                          <span className="block text-[15px] font-medium text-ink">
                            {item.title}
                          </span>
                          <span className="block text-[12.5px] text-ink-sub">
                            {item.desc}
                          </span>
                        </span>
                        <motion.span
                          animate={{ rotate: isOpen ? 180 : 0 }}
                          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                          className="shrink-0 text-ink-sub"
                        >
                          <ChevronDown className="h-5 w-5" strokeWidth={2} />
                        </motion.span>
                      </Tappable>

                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25, ease: 'easeInOut' }}
                            className="overflow-hidden"
                          >
                            <div className="px-3 pb-4 pl-[3.65rem]">
                              <div className="flex flex-wrap gap-2">
                                {item.subs.map((sub) => (
                                  <Tappable
                                    key={sub}
                                    type="button"
                                    className="rounded-full border border-line px-3.5 py-1.5 text-[13px] font-medium text-ink transition-colors hover:border-violet/40 hover:text-violet"
                                  >
                                    {sub}
                                  </Tappable>
                                ))}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )
                })}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
