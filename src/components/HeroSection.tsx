import React, { useEffect, useState } from 'react'
import { FaPlay, FaChevronDown } from 'react-icons/fa'
import { useLanguage } from '../contexts/LanguageContext'

const HeroSection = () => {
  const [scrollY, setScrollY] = useState(0)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const { t } = useLanguage()

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e
      const centerX = window.innerWidth / 2
      const centerY = window.innerHeight / 2
      setMousePosition({
        x: (clientX - centerX) / centerX,
        y: (clientY - centerY) / centerY,
      })
    }

    window.addEventListener('scroll', handleScroll)
    window.addEventListener('mousemove', handleMouseMove)
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-ocean-dark flex items-center justify-center">
      {/* Animated Background Layers */}
      <div
        className="absolute inset-0 z-0"
        style={{
          transform: `translateY(${scrollY * 0.3}px)`,
        }}
      >
        {/* Base gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_120%_80%_at_50%_-20%,_#0c4a6e_0%,_#020617_60%)]"></div>

        {/* Animated gradient orbs with mouse interaction */}
        <div
          className="absolute top-[-10%] left-[10%] w-[900px] h-[900px] bg-gradient-radial from-ocean-accent/20 via-ocean-accent/5 to-transparent rounded-full blur-[100px] animate-pulse-glow"
          style={{
            transform: `translate(${mousePosition.x * 30}px, ${mousePosition.y * 30}px)`,
            transition: 'transform 0.3s ease-out',
          }}
        ></div>
        <div
          className="absolute bottom-[-20%] right-[5%] w-[700px] h-[700px] bg-gradient-radial from-ocean-teal/15 via-ocean-teal/5 to-transparent rounded-full blur-[80px] animate-float-slow"
          style={{
            transform: `translate(${mousePosition.x * -20}px, ${mousePosition.y * -20}px)`,
            transition: 'transform 0.5s ease-out',
          }}
        ></div>
        <div
          className="absolute top-[40%] right-[20%] w-[400px] h-[400px] bg-gradient-radial from-parks-gold/10 via-parks-gold/5 to-transparent rounded-full blur-[60px] animate-float-delayed"
        ></div>

        {/* Animated grid lines */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '80px 80px',
          }}
        ></div>

        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white/30 rounded-full animate-float-slow"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 8}s`,
                animationDuration: `${8 + Math.random() * 4}s`,
              }}
            ></div>
          ))}
        </div>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 w-full max-w-7xl px-6 pt-16 pb-8">
        <div className="flex flex-col items-center text-center">
          {/* Premium Badge with glow effect */}
          <div className="relative mb-10 animate-fade-up">
            <div className="absolute inset-0 bg-parks-gold/20 blur-xl rounded-full"></div>
            <div className="relative inline-flex items-center gap-3 rounded-full border border-parks-gold/40 bg-gradient-to-r from-parks-gold/10 to-transparent px-6 py-2.5 backdrop-blur-md">
              <div className="relative">
                <div className="absolute inset-0 bg-parks-gold rounded-full animate-ping opacity-50"></div>
                <div className="relative h-2.5 w-2.5 rounded-full bg-parks-gold shadow-[0_0_10px_rgba(251,191,36,0.8)]"></div>
              </div>
              <span className="font-body text-sm font-semibold tracking-[0.2em] text-parks-gold uppercase">
                {t.hero.badge}
              </span>
            </div>
          </div>

          {/* Main Title with dramatic typography */}
          <h1
            className="mx-auto max-w-5xl font-display text-5xl font-bold leading-[1.1] tracking-tight text-white sm:text-6xl md:text-7xl lg:text-8xl animate-fade-up"
            style={{ animationDelay: '0.1s' }}
          >
            <span className="block mb-2">{t.hero.title1}</span>
            <span className="relative inline-block">
              <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-ocean-teal via-cyan-300 to-ocean-accent bg-[length:200%_auto] animate-gradient-shift">
                {t.hero.title2}
              </span>
              <span className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-ocean-teal to-transparent opacity-50"></span>
            </span>
          </h1>

          {/* Subtitle with refined typography */}
          <p
            className="mx-auto mt-8 max-w-2xl font-body text-lg leading-relaxed text-slate-300 md:text-xl lg:text-2xl animate-fade-up"
            style={{ animationDelay: '0.2s' }}
          >
            {t.hero.subtitle}
            <br className="hidden sm:block" />
            <span className="text-white font-medium">{t.hero.subtitleHighlight}</span>{t.hero.subtitleEnd}
            <span className="text-ocean-teal font-medium"> {t.hero.subtitlePremium}</span> {t.hero.subtitleExperience}
          </p>

          {/* CTA Buttons */}
          <div
            className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6 animate-fade-up"
            style={{ animationDelay: '0.3s' }}
          >
            {/* Primary CTA */}
            <a
              href="http://pf.kakao.com/_xhhbxcn/chat"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative overflow-hidden rounded-full bg-gradient-to-r from-parks-gold via-amber-400 to-parks-gold-light px-10 py-4 shadow-glow-gold transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(251,191,36,0.5)] active:scale-95"
            >
              <span className="relative z-10 flex items-center gap-2 font-body text-base font-bold tracking-wide text-ocean-dark">
                {t.hero.cta}
                <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
              <div className="absolute inset-0 z-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
            </a>

            {/* Secondary CTA */}
            <button className="group flex items-center gap-3 rounded-full border border-white/20 bg-white/5 px-8 py-4 backdrop-blur-md transition-all duration-300 hover:bg-white/10 hover:border-white/30 active:scale-95">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/10 group-hover:bg-white/20 transition-colors">
                <FaPlay className="w-3 h-3 text-white ml-0.5" />
              </div>
              <span className="font-body text-base font-medium text-white">{t.hero.watchVideo}</span>
            </button>
          </div>

          {/* Stats Section - Bento Grid Style */}
          <div
            className="mx-auto mt-20 w-full max-w-4xl animate-fade-up"
            style={{ animationDelay: '0.4s' }}
          >
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
              {t.hero.stats.map((stat, idx) => (
                <div
                  key={idx}
                  className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.08] to-white/[0.02] p-6 backdrop-blur-sm transition-all duration-300 hover:border-white/20 hover:bg-white/[0.1] hover:-translate-y-1 hover:shadow-lg"
                >
                  {/* Hover glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-ocean-teal/0 to-ocean-teal/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                  <div className="relative z-10">
                    <span className="text-3xl mb-3 block filter drop-shadow-lg">{stat.icon}</span>
                    <span className="font-display text-3xl font-bold text-white md:text-4xl">{stat.value}</span>
                    <div className="mt-2">
                      <span className="block font-body text-sm font-semibold text-ocean-teal uppercase tracking-wider">{stat.label}</span>
                      <span className="block mt-1 text-xs text-slate-400">{stat.sub}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Trust badges */}
          <div
            className="mt-12 flex flex-wrap items-center justify-center gap-6 animate-fade-up"
            style={{ animationDelay: '0.5s' }}
          >
            {t.hero.trustBadges.map((badge, idx) => (
              <React.Fragment key={idx}>
                <div className="flex items-center gap-2 text-slate-400">
                  <span className="text-lg">{badge.icon}</span>
                  <span className="text-sm font-medium">{badge.text}</span>
                </div>
                {idx < t.hero.trustBadges.length - 1 && <div className="w-px h-4 bg-slate-600"></div>}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce-subtle">
        <span className="text-xs font-medium text-slate-500 uppercase tracking-widest">{t.hero.scroll}</span>
        <div className="relative">
          <div className="w-6 h-10 rounded-full border-2 border-slate-600 flex justify-center pt-2">
            <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></div>
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-ocean-dark to-transparent pointer-events-none"></div>
    </section>
  )
}

export default HeroSection
