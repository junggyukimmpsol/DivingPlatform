import React, { useState, useEffect } from 'react'
import { useLanguage } from '../contexts/LanguageContext'
import LanguageSwitcher from './LanguageSwitcher'
import { FaHome, FaStar, FaMapMarkerAlt, FaCalendarAlt, FaDollarSign, FaGift } from 'react-icons/fa'

interface NavigationProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  const { t } = useLanguage()
  const [isScrolled, setIsScrolled] = useState(false)
  const [hoveredTab, setHoveredTab] = useState<string | null>(null)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const tabs = [
    { id: 'home', label: t.nav.home, icon: FaHome },
    { id: 'why-us', label: t.nav.whyUs, icon: FaStar },
    { id: 'locations', label: t.nav.locations, icon: FaMapMarkerAlt },
    { id: 'schedule', label: t.nav.schedule, icon: FaCalendarAlt },
    { id: 'pricing', label: t.nav.pricing, icon: FaDollarSign },
    { id: 'events', label: t.nav.events, icon: FaGift },
  ]

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'bg-ocean-dark/95 backdrop-blur-xl border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.3)]'
          : 'bg-transparent border-b border-transparent'
      }`}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <button
            onClick={() => onTabChange('home')}
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
          </button>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2">
            <div className="relative flex items-center gap-1 rounded-full bg-white/5 p-1.5 backdrop-blur-sm border border-white/10">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id
                const isHovered = hoveredTab === tab.id

                return (
                  <button
                    key={tab.id}
                    onClick={() => onTabChange(tab.id)}
                    onMouseEnter={() => setHoveredTab(tab.id)}
                    onMouseLeave={() => setHoveredTab(null)}
                    aria-label={tab.label}
                    aria-current={isActive ? 'page' : undefined}
                    className={`
                      relative px-4 py-2 rounded-full font-body font-medium transition-all duration-300 text-sm flex items-center gap-2
                      focus:outline-none focus:ring-2 focus:ring-parks-gold/50 focus:ring-offset-1 focus:ring-offset-transparent
                      ${isActive
                        ? 'text-ocean-dark'
                        : 'text-slate-300 hover:text-white'
                      }
                    `}
                  >
                    {/* Active/Hover Background */}
                    {isActive && (
                      <span className="absolute inset-0 rounded-full bg-gradient-to-r from-parks-gold to-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.4)] animate-scale-in"></span>
                    )}
                    {!isActive && isHovered && (
                      <span className="absolute inset-0 rounded-full bg-white/10 animate-fade-in"></span>
                    )}

                    <span className="relative z-10 flex items-center gap-2">
                      <tab.icon className={`text-sm transition-transform duration-300 ${isActive || isHovered ? 'scale-110' : ''}`} aria-hidden="true" />
                      <span className="hidden lg:inline">{tab.label}</span>
                    </span>
                  </button>
                )
              })}
            </div>

            {/* Divider */}
            <div className="w-px h-8 bg-white/10 mx-2"></div>

            {/* Language Switcher */}
            <LanguageSwitcher />
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden py-3">
          {/* Mobile Header */}
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={() => onTabChange('home')}
              className="flex items-center gap-2"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-parks-gold to-amber-500">
                <span className="text-sm font-bold text-ocean-dark">P</span>
              </div>
              <span className="font-display text-lg font-bold text-white">
                Parks <span className="text-parks-gold">Diving</span>
              </span>
            </button>
            <LanguageSwitcher />
          </div>

          {/* Mobile Tab Grid */}
          <div className="grid grid-cols-6 gap-1 rounded-2xl bg-white/5 p-1.5 backdrop-blur-sm border border-white/10">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id

              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  aria-label={tab.label}
                  aria-current={isActive ? 'page' : undefined}
                  className={`
                    relative flex flex-col items-center justify-center py-2.5 rounded-xl transition-all duration-300
                    focus:outline-none
                    ${isActive
                      ? 'bg-gradient-to-b from-parks-gold to-amber-500 text-ocean-dark shadow-[0_0_15px_rgba(251,191,36,0.3)]'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }
                  `}
                >
                  <tab.icon className={`text-base mb-0.5 transition-transform ${isActive ? 'scale-110' : ''}`} aria-hidden="true" />
                  <span className="text-[10px] font-medium leading-tight">{tab.label}</span>
                </button>
              )
            })}
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
