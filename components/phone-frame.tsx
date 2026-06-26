import type { ReactNode } from 'react'
import { Signal, Wifi, BatteryFull } from 'lucide-react'

/**
 * iPhone 목업 프레임. 폭 390px 기준의 세로 화면.
 * OS 상태바는 시스템 기본 그대로 — 색칠하지 않고 기본 잉크 컬러만 사용.
 */
export function PhoneFrame({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative h-[844px] w-[390px] shrink-0 rounded-[3.2rem] bg-[#0d0d12] p-[12px] shadow-[0_40px_80px_-20px_rgba(35,33,54,0.4)]">
        {/* 화면 */}
        <div className="relative h-full w-full overflow-hidden rounded-[2.5rem] bg-white">
          <StatusBar />
          {children}
        </div>
        {/* 다이나믹 아일랜드 */}
        <div className="pointer-events-none absolute left-1/2 top-[20px] z-50 h-[26px] w-[104px] -translate-x-1/2 rounded-full bg-[#0d0d12]" />
      </div>
      <span className="text-sm font-medium text-ink-sub">{label}</span>
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
