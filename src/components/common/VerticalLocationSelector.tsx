import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { DIVING_LOCATIONS } from '../../data/diving-locations'
import { useLanguage } from '../../contexts/LanguageContext'

const VerticalLocationSelector: React.FC = () => {
  const { pathname } = useLocation()
  const { t, language } = useLanguage()

  // Only show on branch pages, not on home page
  if (pathname === '/') {
    return null
  }

  return (
    <div className="fixed bottom-6 left-6 z-40 block">
      <div className="flex flex-row gap-2 bg-ocean-dark/70 backdrop-blur-xl rounded-xl border border-white/10 p-2 shadow-xl">
        {DIVING_LOCATIONS.map((loc, index) => {
          const locT = t.locations.locations[index]
          const displayName = language === 'en' ? loc.name : locT.nameKo
          const isActive = pathname === loc.path

          return (
            <Link
              key={loc.id}
              to={loc.path}
              className={`
                group relative flex items-center justify-center
                w-12 h-12 rounded-lg
                transition-all duration-300
                ${
                  isActive
                    ? 'bg-parks-gold text-ocean-dark shadow-md shadow-parks-gold/30'
                    : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white hover:scale-110 hover:shadow-md'
                }
              `}
              aria-label={`Go to ${displayName}`}
            >
              {/* Flag Icon */}
              <img
                src={`https://flagcdn.com/w80/${loc.icon}.png`}
                alt={`${displayName} flag`}
                className="w-8 h-8 object-cover rounded-md transition-transform group-hover:scale-110"
              />

              {/* Tooltip on hover */}
              <div
                className={`
                  absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-lg
                  bg-ocean-dark border border-white/20 shadow-xl
                  whitespace-nowrap
                  opacity-0 pointer-events-none group-hover:opacity-100
                  transition-opacity duration-200
                `}
              >
                <p className="text-xs font-bold text-white">{displayName}</p>
              </div>

              {/* Active indicator */}
              {isActive && (
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-1 bg-parks-gold rounded-full animate-pulse-glow" />
              )}
            </Link>
          )
        })}
      </div>

      {/* Decorative glow */}
      <div className="absolute inset-0 -z-10 blur-2xl opacity-20 bg-gradient-to-b from-parks-gold via-ocean-accent to-ocean-teal rounded-3xl" />
    </div>
  )
}

export default VerticalLocationSelector
