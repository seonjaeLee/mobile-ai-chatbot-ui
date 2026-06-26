/**
 * 화이트 배경 위 중앙 집중형 오로라 그라데이션.
 * 화면 전체가 아니라 중앙에 부드럽게 모이도록 radial로 구성.
 */
export function AuroraBg({ className = '' }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 bg-white ${className}`}
      style={{
        backgroundImage: [
          'radial-gradient(40% 30% at 50% 34%, rgba(198,220,249,0.55), rgba(198,220,249,0) 70%)',
          'radial-gradient(34% 26% at 32% 28%, rgba(218,239,238,0.6), rgba(218,239,238,0) 72%)',
          'radial-gradient(36% 28% at 70% 30%, rgba(216,211,249,0.55), rgba(216,211,249,0) 72%)',
          'radial-gradient(50% 34% at 50% 44%, rgba(238,240,248,0.7), rgba(238,240,248,0) 75%)',
        ].join(','),
      }}
    />
  )
}
