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
        background: '#f0effa',
        backgroundImage: [
          /* 우상단 민트 */
          'radial-gradient(60% 55% at 100% 0%, rgba(186,237,232,0.72) 0%, transparent 70%)',
          /* 좌상단~중앙 라벤더 */
          'radial-gradient(55% 50% at 0% 30%, rgba(210,205,248,0.65) 0%, transparent 70%)',
          /* 중앙 퍼플 안개 */
          'radial-gradient(70% 45% at 50% 50%, rgba(220,216,252,0.45) 0%, transparent 65%)',
          /* 하단 화이트 페이드 */
          'linear-gradient(to bottom, transparent 55%, rgba(255,255,255,0.85) 100%)',
        ].join(','),
      }}
    />
  )
}
