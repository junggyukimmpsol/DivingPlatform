import React, { memo } from 'react'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'gold' | 'teal' | 'default'
  className?: string
}

const Badge: React.FC<BadgeProps> = memo(({ children, variant = 'gold', className = '' }) => {
  const variantClasses = {
    gold: 'bg-parks-gold/10 border-parks-gold/20 text-parks-gold',
    teal: 'bg-ocean-teal/10 border-ocean-teal/20 text-ocean-teal',
    default: 'bg-white/5 border-white/10 text-white',
  }

  return (
    <span
      className={`
        inline-block rounded-full px-6 py-2 text-sm font-bold border backdrop-blur-sm
        ${variantClasses[variant]}
        ${className}
      `}
    >
      {children}
    </span>
  )
})

Badge.displayName = 'Badge'

export default Badge
