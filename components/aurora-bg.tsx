/**
 * 레퍼런스 배경:
 * 좌상단 라벤더 + 우상단 민트, 중앙 연회색, 하단 핑크-라벤더가 올라오는 풀스크린 그라디언트.
 * 하단을 흰색으로 빼지 않고 색감이 끝까지 유지됨.
 */
export function AuroraBg({ className = '' }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 ${className}`}
      style={{
        /* 연라벤더 베이스 — 하단 핑크톤의 베이스 */
        background: '#eeecf8',
        backgroundImage: [
          /* 우상단 민트 */
          'radial-gradient(60% 45% at 100% 0%, rgba(186,237,232,0.82) 0%, transparent 65%)',
          /* 좌상단 라벤더 */
          'radial-gradient(55% 42% at 0% 0%, rgba(210,205,248,0.78) 0%, transparent 65%)',
          /* 중앙 화이트 안개 — 중간을 밝게 */
          'radial-gradient(70% 40% at 50% 45%, rgba(255,255,255,0.68) 0%, transparent 70%)',
          /* 하단 핑크-라벤더 */
          'radial-gradient(80% 40% at 50% 100%, rgba(230,210,248,0.55) 0%, transparent 65%)',
        ].join(','),
      }}
    />
  )
}
