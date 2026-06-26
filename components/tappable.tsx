'use client'

import { motion } from 'framer-motion'
import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'

/**
 * 공통 탭 버튼 — 누를 때 살짝 눌리는 스케일 + 키보드 포커스 링.
 * 제스처 포커스 표시를 일관되게 적용하기 위한 래퍼.
 */
export function Tappable({
  className,
  children,
  ...props
}: ComponentProps<typeof motion.button>) {
  return (
    <motion.button
      whileTap={{ scale: 0.94 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      className={cn(
        'outline-none focus-visible:ring-2 focus-visible:ring-violet/55 focus-visible:ring-offset-2 focus-visible:ring-offset-white',
        className,
      )}
      {...props}
    >
      {children}
    </motion.button>
  )
}
