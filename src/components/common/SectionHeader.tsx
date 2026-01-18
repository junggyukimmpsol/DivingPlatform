import React, { memo } from 'react'
import Badge from './Badge'

interface SectionHeaderProps {
  badge?: string
  badgeVariant?: 'gold' | 'teal' | 'default'
  title: string
  titleHighlight?: string
  subtitle?: string
  centered?: boolean
  className?: string
}

const SectionHeader: React.FC<SectionHeaderProps> = memo(({
  badge,
  badgeVariant = 'gold',
  title,
  titleHighlight,
  subtitle,
  centered = true,
  className = '',
}) => {
  return (
    <div className={`mb-12 ${centered ? 'text-center' : ''} ${className}`}>
      {badge && (
        <div className="mb-4">
          <Badge variant={badgeVariant}>{badge}</Badge>
        </div>
      )}
      <h2 className="mb-6 text-4xl font-display font-bold text-white md:text-5xl lg:text-6xl">
        {title}
        {titleHighlight && (
          <>
            {' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-ocean-teal to-ocean-accent">
              {titleHighlight}
            </span>
          </>
        )}
      </h2>
      {subtitle && (
        <p className="text-lg text-slate-300 md:text-xl">{subtitle}</p>
      )}
    </div>
  )
})

SectionHeader.displayName = 'SectionHeader'

export default SectionHeader
