import React, { useEffect, useState } from 'react'

const HeroSection = () => {
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-ocean-dark flex items-center justify-center">
      {/* Cinematic Background Layer */}
      <div
        className="absolute inset-0 z-0"
        style={{
          transform: `translateY(${scrollY * 0.5}px)`,
        }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_#1e293b_0%,_#020617_100%)]"></div>
        {/* Dynamic Gradient Orbs for 'Deep Ocean' Feel */}
        <div className="absolute top-[-20%] left-[20%] w-[800px] h-[800px] bg-ocean-accent/10 rounded-full blur-[120px] mix-blend-screen animate-pulse-glow"></div>
        <div className="absolute bottom-[-10%] right-[10%] w-[600px] h-[600px] bg-ocean-teal/10 rounded-full blur-[100px] mix-blend-screen animate-float-slow"></div>

        {/* Subtle Grid texture for 'Tech' feel */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 contrast-150 brightness-100 mix-blend-overlay"></div>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 w-full max-w-7xl px-6 pt-20 text-center">

        {/* Premium Pill Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-ocean-teal/30 bg-ocean-teal/5 px-4 py-1.5 backdrop-blur-md transition-all hover:bg-ocean-teal/10 hover:border-ocean-teal/50 mb-8 animate-fade-up">
          <div className="h-2 w-2 rounded-full bg-parks-gold animate-pulse"></div>
          <span className="font-body text-sm font-medium tracking-widest text-ocean-teal uppercase">Parks Local Diving</span>
        </div>

        {/* Main Title - Modern Gradient Typography */}
        <h1 className="mx-auto max-w-5xl font-display text-5xl font-semibold leading-tight tracking-tight text-white md:text-7xl lg:text-8xl animate-fade-up" style={{ animationDelay: '0.1s' }}>
          Dive into the <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-ocean-teal via-white to-ocean-accent">
            Deepest Blue
          </span>
        </h1>

        {/* Korean Subtext with 'Tech' readability */}
        <p className="mx-auto mt-8 max-w-2xl font-body text-lg font-light leading-relaxed text-slate-400 md:text-xl animate-fade-up" style={{ animationDelay: '0.2s' }}>
          세부, 보홀 최고의 프리미엄 다이빙 샵. <br />
          <span className="text-white font-medium">Parks 로컬 다이빙</span>에서 시작되는
          안전하고 합리적인 수중 모험.
        </p>

        {/* Buttons / CTA */}
        <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6 animate-fade-up" style={{ animationDelay: '0.3s' }}>
          <button className="group relative overflow-hidden rounded-full bg-white px-8 py-4 text-ocean-dark transition-all hover:scale-105 active:scale-95">
            <span className="relative z-10 font-body text-base font-bold tracking-wide">지금 예약하기</span>
            <div className="absolute inset-0 z-0 bg-gradient-to-r from-parks-gold to-parks-gold-light opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
          </button>

          <button className="group flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/50 px-8 py-4 backdrop-blur-sm transition-all hover:bg-slate-800 hover:border-slate-500 active:scale-95">
            <span className="font-body text-base font-medium text-slate-300 group-hover:text-white">더 알아보기</span>
            <svg className="w-4 h-4 text-slate-400 transition-transform group-hover:translate-x-1 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>

        {/* Stats Glass Card - Silicon Valley 'Bento' Style */}
        <div className="mx-auto mt-20 max-w-4xl grid grid-cols-2 gap-4 md:grid-cols-4 animate-fade-up" style={{ animationDelay: '0.4s' }}>
          {[
            { label: 'Locations', value: '4', sub: 'Global Spots' },
            { label: 'Reviews', value: '1k+', sub: '5-Star Ratings' },
            { label: 'Price', value: '-30%', sub: 'Best Value' },
            { label: 'Safety', value: '100%', sub: 'PADI Certified' },
          ].map((stat, idx) => (
            <div key={idx} className="glass-card flex flex-col items-center justify-center rounded-2xl p-6 transition-all hover:bg-white/10 hover:-translate-y-1">
              <span className="font-display text-3xl font-bold text-white md:text-4xl">{stat.value}</span>
              <span className="mt-2 font-body text-sm font-medium text-ocean-teal uppercase tracking-wider">{stat.label}</span>
              <span className="mt-1 text-xs text-slate-500">{stat.sub}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll Hint */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce opacity-50">
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  )
}

export default HeroSection
