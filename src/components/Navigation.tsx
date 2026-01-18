import React from 'react'
import { useLanguage } from '../contexts/LanguageContext'
import LanguageSwitcher from './LanguageSwitcher'
import { FaHome, FaStar, FaMapMarkerAlt, FaCalendarAlt, FaDollarSign, FaGift } from 'react-icons/fa'

interface NavigationProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  const { t } = useLanguage()

  const tabs = [
    { id: 'home', label: t.nav.home, icon: FaHome },
    { id: 'why-us', label: t.nav.whyUs, icon: FaStar },
    { id: 'locations', label: t.nav.locations, icon: FaMapMarkerAlt },
    { id: 'schedule', label: t.nav.schedule, icon: FaCalendarAlt },
    { id: 'pricing', label: t.nav.pricing, icon: FaDollarSign },
    { id: 'events', label: t.nav.events, icon: FaGift },
  ]

  return (
    <nav className="sticky top-0 z-50 bg-ocean-dark/80 backdrop-blur-md border-b border-white/5 shadow-lg" role="navigation" aria-label="Main navigation">
      <div className="mx-auto max-w-7xl px-4">
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center justify-between py-4">
          <div className="font-display text-2xl font-bold text-parks-gold tracking-tight">
            Parks 로컬 다이빙
          </div>
          <div className="flex items-center gap-4">
            <div className="flex gap-1.5">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  aria-label={tab.label}
                  aria-current={activeTab === tab.id ? 'page' : undefined}
                  className={`
                    px-5 py-2.5 rounded-lg font-body font-medium transition-all duration-200 text-sm flex items-center gap-2
                    focus:outline-none focus:ring-2 focus:ring-parks-gold focus:ring-offset-2 focus:ring-offset-ocean-dark
                    ${activeTab === tab.id
                      ? 'bg-parks-gold text-ocean-dark shadow-[0_0_15px_rgba(251,191,36,0.5)]'
                      : 'text-slate-300 hover:bg-white/10 hover:text-white'
                    }
                  `}
                >
                  <tab.icon className="text-base" aria-hidden="true" />
                  {tab.label}
                </button>
              ))}
            </div>
            <LanguageSwitcher />
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden py-3">
          <div className="flex items-center justify-between mb-3">
            <div className="font-display text-lg font-semibold text-parks-gold">
              Parks 로컬 다이빙
            </div>
            <LanguageSwitcher />
          </div>
          <div className="grid grid-cols-3 gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                aria-label={tab.label}
                aria-current={activeTab === tab.id ? 'page' : undefined}
                className={`
                  px-2 py-2.5 rounded-lg font-body font-medium transition-all duration-200 text-xs flex flex-col items-center
                  focus:outline-none focus:ring-2 focus:ring-parks-gold focus:ring-offset-2 focus:ring-offset-ocean-dark
                  ${activeTab === tab.id
                    ? 'bg-parks-gold text-ocean-dark shadow-sm'
                    : 'text-slate-300 bg-white/5'
                  }
                `}
              >
                <tab.icon className="text-lg mb-1" aria-hidden="true" />
                <div>{tab.label}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navigation
