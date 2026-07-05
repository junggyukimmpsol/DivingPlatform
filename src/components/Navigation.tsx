import React, { useState, useEffect } from 'react'
import LanguageSwitcher from './LanguageSwitcher'
import { FaHome, FaInfoCircle, FaShip, FaStar, FaBars, FaTimes, FaUserCircle, FaMagic } from 'react-icons/fa'
import { Link, useLocation, useSearchParams } from 'react-router-dom'
import { DIVING_LOCATIONS } from '../data/diving-locations'
import { useLanguage } from '../contexts/LanguageContext'
import { useAuth } from '../contexts/AuthContext'

const Navigation: React.FC = () => {
  const { pathname } = useLocation()
  const { t, language } = useLanguage()
  const { user } = useAuth()
  const [searchParams] = useSearchParams()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setIsMenuOpen(false)
  }, [pathname])

  const currentBranch = DIVING_LOCATIONS.find(loc => loc.path === pathname)
  const activeTab = searchParams.get('tab') || 'intro'
  const isHome = pathname === '/'

  const tabs = [
    { id: 'intro', label: t.nav.intro, icon: FaInfoCircle },
    { id: 'tours', label: t.nav.tours, icon: FaShip },
    { id: 'reviews', label: t.nav.reviews, icon: FaStar },
  ]

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled || currentBranch || isMenuOpen
          ? 'bg-ocean-dark/95 backdrop-blur-xl border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.3)]'
          : 'bg-transparent border-b border-transparent'
          }`}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Tier 1: Logo and Main Links */}
          <div className="flex items-center justify-between h-16 lg:h-20">
            <div className="flex items-center gap-4 md:gap-8 lg:gap-12">
              {/* Logo */}
              <Link
                to="/"
                className="group flex items-center transition-all duration-300 hover:scale-105"
              >
                <div className="relative h-10 w-10 md:h-12 md:w-12 overflow-hidden rounded-xl border border-white/10 shadow-lg group-hover:border-parks-gold/50 transition-all duration-300">
                  <img
                    src="/dive_logo.jpg"
                    alt={t.common.logoAlt}
                    className="h-full w-full object-cover"
                  />
                </div>
              </Link>

              {/* Branch Links (Tier 1 - Desktop only) */}
              <div className="hidden md:flex items-center gap-1 p-1 bg-white/5 rounded-full border border-white/5">
                {DIVING_LOCATIONS.map((loc, index) => {
                  const locT = t.locations.locations[index];
                  const displayName = language === 'en' ? loc.name : locT.nameKo;
                  return (
                    <Link
                      key={loc.id}
                      to={loc.path}
                      className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-bold transition-all ${pathname === loc.path
                        ? 'bg-parks-gold text-ocean-dark shadow-md'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                        }`}
                    >
                      {displayName}
                    </Link>
                  )
                })}
              </div>
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-1.5 md:gap-4 flex-shrink-0">
              <div className="hidden sm:block">
                {!isHome && (
                  <Link
                    to="/"
                    className="flex items-center gap-2 text-sm font-bold text-slate-300 hover:text-parks-gold transition-colors"
                  >
                    <FaHome size={18} />
                    <span>{t.nav.home}</span>
                  </Link>
                )}
              </div>
              <div className="hidden md:block w-px h-8 bg-white/10 mx-1"></div>
              {user && (
                <Link
                  to="/photo-enhance"
                  className={`hidden lg:flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold transition ${pathname === '/photo-enhance'
                    ? 'bg-parks-gold text-ocean-dark'
                    : 'bg-white/5 text-slate-200 hover:bg-white/10 hover:text-parks-gold'
                    }`}
                >
                  <FaMagic size={16} />
                  <span>AI 사진보정</span>
                </Link>
              )}
              <Link
                to={user ? '/profile' : '/auth'}
                className={`hidden md:flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold transition ${pathname === '/profile' || pathname === '/auth'
                  ? 'bg-parks-gold text-ocean-dark'
                  : 'bg-white/5 text-slate-200 hover:bg-white/10 hover:text-parks-gold'
                  }`}
              >
                <FaUserCircle size={16} />
                <span>{user ? '내 정보' : '로그인'}</span>
              </Link>
              <div className="scale-85 md:scale-100 origin-right flex-shrink-0">
                <LanguageSwitcher />
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 text-white bg-white/5 rounded-lg border border-white/10 flex-shrink-0"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <FaTimes size={18} /> : <FaBars size={18} />}
              </button>
            </div>
          </div>

          {/* Tier 2: Branch Sub-Tabs */}
          {currentBranch && (
            <div className="flex items-center justify-center gap-2 pb-3 pt-1 border-t border-white/5 animate-slide-down overflow-x-auto no-scrollbar">
              {tabs.map((tab) => (
                <Link
                  key={tab.id}
                  to={`${currentBranch.path}?tab=${tab.id}`}
                  className={`flex-shrink-0 flex items-center gap-2 px-4 md:px-6 py-2 rounded-lg text-xs md:text-sm font-bold transition-all ${activeTab === tab.id
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
        {(isScrolled || currentBranch || isMenuOpen) && (
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-parks-gold/30 to-transparent"></div>
        )}
      </nav>

      {/* Mobile Menu Overlay */}
      <div className={`
        fixed inset-0 z-40 bg-ocean-dark/95 backdrop-blur-xl transition-all duration-300 md:hidden
        ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none translate-x-full'}
      `}>
        <div className="flex flex-col h-full pt-24 px-6">
          <div className="space-y-4">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest px-2 mb-4">{t.nav.locationInfo}</p>
            {DIVING_LOCATIONS.map((loc, index) => {
              const locT = t.locations.locations[index];
              const displayName = language === 'en' ? loc.name : locT.nameKo;
              return (
                <Link
                  key={loc.id}
                  to={loc.path}
                  className={`flex items-center justify-between p-4 rounded-xl border transition-all ${pathname === loc.path
                    ? 'bg-parks-gold/10 border-parks-gold text-parks-gold'
                    : 'bg-white/5 border-white/5 text-white'
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={`https://flagcdn.com/w80/${loc.icon}.png`}
                      alt={`${displayName} flag`}
                      className="w-8 h-8 object-cover rounded-md"
                    />
                    <span className="font-bold">{displayName}</span>
                  </div>
                  <div className="text-xs opacity-50 uppercase tracking-tighter">{loc.id.replace('-', ' ')}</div>
                </Link>
              )
            })}
          </div>

          <div className="mt-8 pt-8 border-t border-white/10 space-y-4">
            <Link
              to="/"
              className="flex items-center gap-3 p-4 text-white font-bold bg-white/5 rounded-xl border border-white/5"
            >
              <FaHome className="text-parks-gold" />
              <span>{t.nav.home}</span>
            </Link>
            <Link
              to={user ? '/profile' : '/auth'}
              className="flex items-center gap-3 p-4 text-white font-bold bg-white/5 rounded-xl border border-white/5"
            >
              <FaUserCircle className="text-parks-gold" />
              <span>{user ? '내 다이빙 정보' : '로그인 / 회원가입'}</span>
            </Link>
            {user && (
              <Link
                to="/photo-enhance"
                className="flex items-center gap-3 p-4 text-white font-bold bg-white/5 rounded-xl border border-white/5"
              >
                <FaMagic className="text-parks-gold" />
                <span>AI 사진보정</span>
              </Link>
            )}
          </div>

          <div className="mt-auto pb-10 text-center">
            <p className="text-xs text-slate-500 mb-2">{t.footer.companyName}</p>
            <p className="text-[10px] text-slate-600">{t.footer.allRightsReserved}</p>
          </div>
        </div>
      </div>
    </>
  )
}

export default Navigation
