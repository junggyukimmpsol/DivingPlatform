import React, { useState, useEffect } from 'react'
import LanguageSwitcher from './LanguageSwitcher'
import { FaHome } from 'react-icons/fa'
import { Link, useLocation } from 'react-router-dom'

const Navigation: React.FC = () => {
  const { pathname } = useLocation()
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const isHome = pathname === '/'

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled
        ? 'bg-ocean-dark/95 backdrop-blur-xl border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.3)]'
        : 'bg-transparent border-b border-transparent'
        }`}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link
            to="/"
            className="group flex items-center gap-3 transition-all duration-300 hover:scale-105"
          >
            {/* Logo Icon */}
            <div className="relative">
              <div className="absolute inset-0 bg-parks-gold/30 rounded-xl blur-lg group-hover:bg-parks-gold/50 transition-all duration-300"></div>
              <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-parks-gold to-amber-500 shadow-lg">
                <span className="text-lg font-bold text-ocean-dark">P</span>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-display text-xl font-bold text-white tracking-tight leading-tight">
                Parks
              </span>
              <span className="text-[10px] font-body font-medium text-parks-gold tracking-widest uppercase">
                Local Diving
              </span>
            </div>
          </Link>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            {!isHome && (
              <Link
                to="/"
                className="hidden md:flex items-center gap-2 text-sm font-bold text-slate-300 hover:text-parks-gold transition-colors"
              >
                <FaHome size={18} />
                <span>지도 보기</span>
              </Link>
            )}
            <div className="w-px h-8 bg-white/10 mx-2 hidden md:block"></div>
            <LanguageSwitcher />
          </div>
        </div>
      </div>

      {/* Bottom glow line when scrolled */}
      {isScrolled && (
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-parks-gold/30 to-transparent"></div>
      )}
    </nav>
  )
}

export default Navigation
