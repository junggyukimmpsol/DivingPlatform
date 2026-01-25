import React, { useState, useEffect } from 'react'
import LanguageSwitcher from './LanguageSwitcher'
import { FaHome, FaInfoCircle, FaShip, FaStar } from 'react-icons/fa'
import { Link, useLocation, useSearchParams } from 'react-router-dom'
import { DIVING_LOCATIONS } from '../data/diving-locations'

const Navigation: React.FC = () => {
  const { pathname } = useLocation()
  const [searchParams] = useSearchParams()
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const currentBranch = DIVING_LOCATIONS.find(loc => loc.path === pathname)
  const activeTab = searchParams.get('tab') || 'intro'
  const isHome = pathname === '/'

  const tabs = [
    { id: 'intro', label: '소개', icon: FaInfoCircle },
    { id: 'tours', label: '투어 & 가격', icon: FaShip },
    { id: 'reviews', label: '리뷰', icon: FaStar },
  ]

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled || currentBranch
        ? 'bg-ocean-dark/95 backdrop-blur-xl border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.3)]'
        : 'bg-transparent border-b border-transparent'
        }`}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Tier 1: Logo and Main Links */}
        <div className="flex items-center justify-between h-16 lg:h-20">
          <div className="flex items-center gap-8 lg:gap-12">
            {/* Logo */}
            <Link
              to="/"
              className="group flex items-center gap-3 transition-all duration-300 hover:scale-105"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-parks-gold/30 rounded-xl blur-lg group-hover:bg-parks-gold/50 transition-all duration-300"></div>
                <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-parks-gold to-amber-500 shadow-lg">
                  <span className="text-lg font-bold text-ocean-dark">P</span>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-display text-xl font-bold text-white tracking-tight leading-tight">Parks</span>
                <span className="text-[10px] font-body font-medium text-parks-gold tracking-widest uppercase">Local Diving</span>
              </div>
            </Link>

            {/* Branch Links (Tier 1) */}
            <div className="hidden md:flex items-center gap-1 p-1 bg-white/5 rounded-full border border-white/5">
              {DIVING_LOCATIONS.map((loc) => (
                <Link
                  key={loc.id}
                  to={loc.path}
                  className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all ${pathname === loc.path
                    ? 'bg-parks-gold text-ocean-dark shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                >
                  {loc.nameKo}
                </Link>
              ))}
            </div>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            {!isHome && (
              <Link
                to="/"
                className="hidden md:flex items-center gap-2 text-sm font-bold text-slate-300 hover:text-parks-gold transition-colors"
              >
                <FaHome size={18} />
                <span>지도</span>
              </Link>
            )}
            <div className="w-px h-8 bg-white/10 mx-2 hidden md:block"></div>
            <LanguageSwitcher />
          </div>
        </div>

        {/* Tier 2: Branch Sub-Tabs */}
        {currentBranch && (
          <div className="flex items-center justify-center gap-2 pb-3 pt-1 border-t border-white/5 animate-slide-down">
            {tabs.map((tab) => (
              <Link
                key={tab.id}
                to={`${currentBranch.path}?tab=${tab.id}`}
                className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === tab.id
                  ? 'text-parks-gold bg-white/5 border border-parks-gold/30'
                  : 'text-slate-400 hover:text-white'
                  }`}
              >
                <tab.icon size={14} className={activeTab === tab.id ? 'text-parks-gold' : 'text-slate-500'} />
                {tab.label}
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Bottom glow line when scrolled or has subtabs */}
      {(isScrolled || currentBranch) && (
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-parks-gold/30 to-transparent"></div>
      )}
    </nav>
  )
}

export default Navigation
