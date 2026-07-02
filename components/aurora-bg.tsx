/**
 * 이미지 레퍼런스 배경:
 * 우상단 민트, 좌중단 라벤더, 하단 흰색으로 자연스럽게 페이드되는 멀티톤 그라디언트.
 */
export function AuroraBg({ className = '' }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 ${className}`}
      style={{
        /* 베이스 흰색 — 라벤더 베이스가 하단에서 핑크로 보이는 문제 제거 */
        background: '#ffffff',
        backgroundImage: [
          /* 우상단 민트 */
          'radial-gradient(60% 50% at 100% 0%, rgba(186,237,232,0.78) 0%, transparent 68%)',
          /* 좌상단 라벤더 */
          'radial-gradient(55% 45% at 0% 8%, rgba(210,205,248,0.72) 0%, transparent 68%)',
          /* 중앙 연보라 안개 — 상단 40% 안에만 */
          'radial-gradient(80% 38% at 50% 28%, rgba(220,216,252,0.38) 0%, transparent 60%)',
          /* 하단 완전 흰색 덮기 */
          'linear-gradient(to bottom, transparent 42%, #ffffff 78%)',
        ].join(','),
      }}
    />
  )
}
