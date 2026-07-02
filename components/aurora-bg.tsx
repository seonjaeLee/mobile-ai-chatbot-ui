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
        /* #f8f8f8 베이스 — 순백보다 부드럽고, 라벤더 잔상 없이 깔끔하게 마무리 */
        background: '#f8f8f8',
        backgroundImage: [
          /* 우상단 민트 */
          'radial-gradient(60% 50% at 100% 0%, rgba(186,237,232,0.80) 0%, transparent 68%)',
          /* 좌상단 라벤더 */
          'radial-gradient(55% 45% at 0% 8%, rgba(210,205,248,0.75) 0%, transparent 68%)',
          /* 중앙 연보라 안개 */
          'radial-gradient(80% 38% at 50% 28%, rgba(220,216,252,0.40) 0%, transparent 60%)',
        ].join(','),
      }}
    />
  )
}
