import React from 'react'
import { NavLink, useParams } from 'react-router-dom'
import { CENTERS } from '../../data/centers'
import LanguageSwitcher from '../LanguageSwitcher'

/**
 * 센터 페이지용 이중 상단바 네비게이션
 */
const CenterNavigation: React.FC = () => {
  const { centerId } = useParams<{ centerId: string }>()
  const [isScrolled, setIsScrolled] = React.useState(false)

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const currentCenter = CENTERS.find(c => c.id === centerId)

  const tabs = [
    { id: 'introduction', label: '소개', icon: '📝' },
    { id: 'tours', label: '투어 일정', icon: '🚢' },
    { id: 'pricing', label: '가격', icon: '💰' },
    { id: 'reviews', label: '리뷰', icon: '⭐' },
  ]

  return (
    <nav className="sticky top-0 z-50 flex flex-col w-full shadow-2xl">
      {/* 1차 상단바: 센터 선택 */}
      <div className={`transition-all duration-300 ${isScrolled ? 'bg-ocean-dark/95 backdrop-blur-md' : 'bg-ocean-dark'} border-b border-white/5`}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 md:h-16">
            {/* Logo */}
            <NavLink to="/" className="flex items-center gap-2 group shrink-0">
              <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-parks-gold to-amber-500 shadow-lg group-hover:scale-105 transition-transform">
                <span className="text-sm font-bold text-ocean-dark">P</span>
              </div>
              <span className="hidden sm:block font-display text-lg font-bold text-white">
                Parks <span className="text-parks-gold">Diving</span>
              </span>
            </NavLink>

            {/* 센터 리스트 */}
            <div className="flex items-center gap-1 md:gap-4 overflow-x-auto no-scrollbar py-2">
              {CENTERS.map((center) => (
                <NavLink
                  key={center.id}
                  to={`/${center.id}`}
                  className={({ isActive }) => `
                    flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all whitespace-nowrap
                    ${isActive
                      ? 'bg-parks-gold text-ocean-dark shadow-lg shadow-parks-gold/20'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'}
                  `}
                >
                  <span className="text-base">{center.icon}</span>
                  <span>{center.nameKo}</span>
                </NavLink>
              ))}
            </div>

            <div className="flex items-center gap-2 ml-2">
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      </div>

      {/* 2차 상단바: 탭 네비게이션 */}
      <div className="bg-slate-900/80 backdrop-blur-md border-b border-white/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center md:justify-start h-12 gap-6 md:gap-10 overflow-x-auto no-scrollbar">
            {tabs.map((tab) => (
              <NavLink
                key={tab.id}
                to={`/${centerId}/${tab.id}`}
                className={({ isActive }) => `
                  relative h-full flex items-center gap-1.5 text-sm font-semibold transition-all whitespace-nowrap px-1
                  ${isActive ? 'text-parks-gold' : 'text-slate-400 hover:text-slate-200'}
                `}
              >
                {({ isActive }) => (
                  <>
                    <span>{tab.icon}</span>
                    <span>{tab.label}</span>
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-parks-gold rounded-full shadow-[0_0_8px_rgba(251,191,36,0.5)]"></span>
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </div>
        </div>
      </div>

      {/* 현재 센터 국가 표시 (Sub-indicator) */}
      {currentCenter && (
        <div className="absolute top-full left-0 right-0 py-1 bg-gradient-to-r from-transparent via-white/5 to-transparent text-center">
          <span className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold">
            {currentCenter.countryIcon} {currentCenter.countryNameKo} · {currentCenter.name}
          </span>
        </div>
      )}
    </nav>
  )
}

export default CenterNavigation
