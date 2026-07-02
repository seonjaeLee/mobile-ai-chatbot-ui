'use client'

import { AnimatePresence, motion, type PanInfo } from 'framer-motion'
import {
  X,
  Receipt,
  Wallet,
  PiggyBank,
  TrendingUp,
} from 'lucide-react'
import { Tappable } from './tappable'

const MENU_ITEMS = [
  { icon: Receipt, title: '주문', subs: ['매수', '매도', '정정', '취소'] },
  { icon: Wallet, title: '계좌', subs: ['잔고', '거래내역', '예수금', '이체'] },
  { icon: PiggyBank, title: '연금', subs: ['개인연금', 'IRP', '연금이전'] },
  { icon: TrendingUp, title: '금융상품', subs: ['펀드', 'ELS', 'ISA', 'RP'] },
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
  const handleDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.y > 120 || info.velocity.y > 600) onClose()
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* 딤 배경 */}
          <motion.button
            type="button"
            aria-label="챗봇 메뉴 닫기"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 z-40 bg-ink/30"
          />

          {/* 바텀시트 — 헤더 위 60px가 항상 노출되도록 max-h 제한 */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 340, damping: 36 }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.6 }}
            onDragEnd={handleDragEnd}
            className="absolute inset-x-0 bottom-0 z-50 flex flex-col rounded-t-[2rem] bg-white shadow-[0_-20px_50px_-12px_rgba(35,33,54,0.3)]"
            style={{ maxHeight: 'calc(100% - 60px)' }}
          >
            {/* 그랩 핸들 */}
            <div className="flex shrink-0 cursor-grab justify-center pt-3 active:cursor-grabbing">
              <span className="h-1.5 w-10 rounded-full bg-line" />
            </div>

            {/* 헤더 */}
            <div className="flex shrink-0 items-center justify-between px-5 pb-3 pt-4">
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

            {/* 스크롤 영역 + 하단 페이드 마스크 */}
            <div className="relative min-h-0 flex-1">
              {/* 실제 스크롤 컨테이너 */}
              <div className="mobile-scroll h-full overflow-y-auto px-2 pb-10">
                {MENU_ITEMS.map((item) => (
                  <div key={item.title} className="border-b border-line last:border-b-0">
                    {/* 1뎁스 */}
                    <div className="flex items-center gap-3.5 px-3 pb-2 pt-4">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-black/[0.04]">
                        <item.icon className="h-5 w-5 text-ink" strokeWidth={1.8} />
                      </span>
                      <span className="text-[16px] font-semibold text-ink">
                        {item.title}
                      </span>
                    </div>
                    {/* 2뎁스 — 항상 노출 */}
                    <div className="flex flex-wrap gap-2 pb-4 pl-[3.65rem] pr-3">
                      {item.subs.map((sub) => (
                        <Tappable
                          key={sub}
                          type="button"
                          className="rounded-full border border-line px-4 py-2 text-[14px] font-medium text-ink transition-colors hover:border-violet/40 hover:bg-violet-soft hover:text-violet"
                        >
                          {sub}
                        </Tappable>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* 하단 페이드 아웃 마스크 */}
              <div
                className="pointer-events-none absolute inset-x-0 bottom-0 h-16 rounded-b-[2rem]"
                style={{
                  background: 'linear-gradient(to bottom, transparent, white)',
                }}
              />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
