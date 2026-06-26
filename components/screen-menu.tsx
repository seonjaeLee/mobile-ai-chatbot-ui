import {
  X,
  ChevronRight,
  ChevronDown,
  MessageCirclePlus,
  Clock,
  Star,
  Receipt,
  Wallet,
  PiggyBank,
  TrendingUp,
} from 'lucide-react'
import { AuroraBg } from './aurora-bg'

const LIST_ITEMS = [
  {
    icon: MessageCirclePlus,
    title: '새 대화 시작',
    desc: '지금 대화를 정리하고 새로 시작',
  },
  {
    icon: Clock,
    title: '최근 대화',
    desc: '지난 질문·답변 다시 보기',
  },
  {
    icon: Star,
    title: '관심 종목',
    desc: '담아둔 종목 한눈에',
  },
]

const ACCORDION_ITEMS = [
  { icon: Receipt, title: '주문', desc: '매수·매도·정정·취소', open: true },
  { icon: Wallet, title: '계좌', desc: '잔고·거래내역·예수금', open: false },
  { icon: PiggyBank, title: '연금', desc: '개인연금·퇴직연금(IRP)', open: false },
  { icon: TrendingUp, title: '금융상품', desc: '펀드·ELS·ISA', open: false },
]

export function ScreenMenu() {
  return (
    <div className="relative h-[calc(844px-54px)] overflow-hidden">
      {/* 뒤 배경 (흐려진 진입 화면 느낌) */}
      <AuroraBg className="opacity-60" />
      <div className="absolute inset-0 bg-ink/25" />

      {/* 바텀시트 */}
      <div className="absolute inset-x-0 bottom-0 max-h-[88%] overflow-y-auto rounded-t-[2rem] bg-white shadow-[0_-20px_50px_-12px_rgba(35,33,54,0.3)]">
        {/* 그랩 핸들 */}
        <div className="flex justify-center pt-3">
          <span className="h-1.5 w-10 rounded-full bg-line" />
        </div>

        {/* 헤더 */}
        <div className="flex items-center justify-between px-5 pb-2 pt-4">
          <h2 className="text-[17px] font-bold text-ink">전체 메뉴</h2>
          <button
            type="button"
            aria-label="닫기"
            className="flex h-9 w-9 items-center justify-center rounded-full text-ink-sub transition-colors hover:bg-black/5"
          >
            <X className="h-5 w-5" strokeWidth={2} />
          </button>
        </div>

        {/* 리스트 항목 */}
        <ul className="px-2">
          {LIST_ITEMS.map((item) => (
            <li key={item.title} className="border-b border-line last:border-b-0">
              <button
                type="button"
                className="flex w-full items-center gap-3.5 px-3 py-4 text-left transition-colors hover:bg-black/[0.03]"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-violet-soft">
                  <item.icon className="h-5 w-5 text-violet" strokeWidth={1.8} />
                </span>
                <span className="flex-1">
                  <span className="block text-[15px] font-medium text-ink">
                    {item.title}
                  </span>
                  <span className="block text-[12.5px] text-ink-sub">
                    {item.desc}
                  </span>
                </span>
                <ChevronRight className="h-5 w-5 shrink-0 text-ink-sub" />
              </button>
            </li>
          ))}
        </ul>

        {/* 아코디언 */}
        <div className="mt-1 px-2 pb-8">
          {ACCORDION_ITEMS.map((item) => (
            <div key={item.title} className="border-b border-line last:border-b-0">
              <button
                type="button"
                aria-expanded={item.open}
                className="flex w-full items-center gap-3.5 px-3 py-4 text-left transition-colors hover:bg-black/[0.03]"
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
                <ChevronDown
                  className={`h-5 w-5 shrink-0 text-ink-sub transition-transform ${
                    item.open ? 'rotate-180' : ''
                  }`}
                  strokeWidth={2}
                />
              </button>
              {item.open && (
                <div className="px-3 pb-4 pl-[3.65rem]">
                  <div className="flex flex-wrap gap-2">
                    {['매수', '매도', '정정', '취소'].map((sub) => (
                      <span
                        key={sub}
                        className="rounded-full border border-line px-3.5 py-1.5 text-[13px] font-medium text-ink"
                      >
                        {sub}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
