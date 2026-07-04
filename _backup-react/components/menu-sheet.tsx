'use client'

import { AnimatePresence, motion, type PanInfo } from 'framer-motion'
import { X } from 'lucide-react'
import { Tappable } from './tappable'

// 이미지 레퍼런스 기준 1뎁스 플랫 메뉴 항목
// query: 탭 시 사용자 발화로 전달될 텍스트
const MENU_ITEMS = [
  { label: '매수 · 매도 주문',    query: '매수·매도 주문 방법 알려줘' },
  { label: '잔고 · 거래내역',     query: '잔고와 거래내역 보는 방법 알려줘' },
  { label: '펀드 · CMA',         query: '펀드와 CMA 상품 알려줘' },
  { label: '연금저축계좌',        query: '연금저축계좌 알아보기' },
  { label: '퇴직연금(IRP)',       query: '퇴직연금 IRP 알아보기' },
  { label: 'ISA',                query: 'ISA 알아보기' },
  { label: '국내·해외 주식거래',  query: '국내·해외 주식거래 방법 알려줘' },
  { label: '공모주·배당·수수료',  query: '공모주, 배당, 수수료 안내 해줘' },
]

export function MenuSheet({
  open,
  onClose,
  onNewChat,
  onAsk,
}: {
  open: boolean
  onClose: () => void
  onNewChat: () => void
  onAsk: (q: string) => void
}) {
  const handleDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.y > 120 || info.velocity.y > 600) onClose()
  }

  const handleItem = (query: string) => {
    onClose()
    // 시트 닫힘 애니메이션(300ms) 후 화면 전환
    setTimeout(() => onAsk(query), 320)
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
              <div className="mobile-scroll h-full overflow-y-auto pb-10">
                <ul>
                  {MENU_ITEMS.map((item) => (
                    <li key={item.label} className="border-b border-line last:border-b-0">
                      <Tappable
                        type="button"
                        onClick={() => handleItem(item.query)}
                        className="flex w-full items-center px-5 py-4 text-left hover:bg-black/[0.03] active:bg-violet-soft"
                      >
                        <span className="text-[16px] font-medium text-ink">
                          {item.label}
                        </span>
                      </Tappable>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 하단 페이드 마스크 */}
              <div
                className="pointer-events-none absolute inset-x-0 bottom-0 h-16 rounded-b-[2rem]"
                style={{ background: 'linear-gradient(to bottom, transparent, white)' }}
              />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
