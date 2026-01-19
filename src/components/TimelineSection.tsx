import React from 'react'
import { useLanguage } from '../contexts/LanguageContext'

const TimelineSection = () => {
  const { t } = useLanguage()

  const pointColors = {
    cebu: 'text-ocean-teal',
    bohol: 'text-purple-400',
    bali: 'text-orange-400',
  }

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-ocean-dark to-slate-950 py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <div className="mb-4 inline-block rounded-full bg-parks-gold/10 border border-parks-gold/20 px-6 py-2 text-sm font-bold text-parks-gold">
            {t.timeline.badge}
          </div>
          <h2 className="mb-6 text-4xl font-display font-bold text-white md:text-5xl lg:text-6xl">
            {t.timeline.title}
          </h2>
        </div>

        {/* Timeline Grid */}
        <div className="mb-16 grid gap-8 lg:grid-cols-2">
          {t.timeline.schedules.map((schedule, idx) => (
            <div key={idx} className="glass-card rounded-3xl p-8 shadow-2xl relative overflow-hidden">
              {/* Timeline Accent Line */}
              <div className="absolute left-[3.5rem] top-24 bottom-24 w-0.5 bg-white/10"></div>

              <h3 className="mb-8 text-center text-2xl font-bold text-white font-display">
                {schedule.type}
              </h3>
              <div className="space-y-6 relative z-10">
                {schedule.timeline.map((item, index) => (
                  <div key={index} className="flex items-start gap-4 group">
                    {/* Time Badge */}
                    <div className="flex-shrink-0 relative z-10">
                      <div className="flex h-16 w-16 flex-col items-center justify-center rounded-full bg-ocean-light border border-white/10 text-white shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:border-parks-gold/50">
                        <span className="text-xs font-semibold text-ocean-teal">{item.time}</span>
                      </div>
                    </div>

                    {/* Activity Card */}
                    <div className="flex-1">
                      <div className="rounded-xl bg-white/5 border border-white/5 p-4 transition-all duration-300 hover:bg-white/10 hover:border-white/10">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl filter drop-shadow-md">{item.icon}</span>
                          <p className="font-semibold text-slate-200">{item.activity}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Diving Points */}
        <div className="mb-12 text-center">
          <div className="mb-4 inline-block rounded-full bg-ocean-teal/10 border border-ocean-teal/20 px-6 py-2 text-sm font-bold text-ocean-teal">
            {t.timeline.pointsBadge}
          </div>
          <h2 className="mb-6 text-4xl font-bold text-white md:text-5xl font-display">
            {t.timeline.pointsTitle}
          </h2>
          <p className="text-lg text-slate-300">
            {t.timeline.pointsSubtitle}
          </p>
        </div>

        {/* Points Grid */}
        <div className="grid gap-8 md:grid-cols-3">
          {/* Cebu Points */}
          <div className="glass-card rounded-2xl p-8 hover:bg-white/5 transition-colors">
            <div className="mb-6 text-center">
              <h3 className={`mb-2 text-2xl font-bold ${pointColors.cebu} font-display`}>{t.timeline.divingPoints.cebu.title}</h3>
              <p className="text-sm text-slate-500">{t.timeline.divingPoints.cebu.subtitle}</p>
            </div>
            <div className="space-y-4">
              {t.timeline.divingPoints.cebu.points.map((point, idx) => (
                <div key={idx} className="rounded-lg bg-white/5 border border-white/5 p-4">
                  <h4 className="mb-1 font-bold text-white">{point.name}</h4>
                  <p className="text-sm text-slate-400">{point.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Bohol Points */}
          <div className="glass-card rounded-2xl p-8 hover:bg-white/5 transition-colors">
            <div className="mb-6 text-center">
              <h3 className={`mb-2 text-2xl font-bold ${pointColors.bohol} font-display`}>{t.timeline.divingPoints.bohol.title}</h3>
              <p className="text-sm text-slate-500">{t.timeline.divingPoints.bohol.subtitle}</p>
            </div>
            <div className="space-y-4">
              {t.timeline.divingPoints.bohol.points.map((point, idx) => (
                <div key={idx} className="rounded-lg bg-white/5 border border-white/5 p-4">
                  <h4 className="mb-1 font-bold text-white">{point.name}</h4>
                  <p className="text-sm text-slate-400">{point.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Bali Points */}
          <div className="glass-card rounded-2xl p-8 hover:bg-white/5 transition-colors">
            <div className="mb-6 text-center">
              <h3 className={`mb-2 text-2xl font-bold ${pointColors.bali} font-display`}>{t.timeline.divingPoints.bali.title}</h3>
              <p className="text-sm text-slate-500">{t.timeline.divingPoints.bali.subtitle}</p>
            </div>
            <div className="space-y-4">
              {t.timeline.divingPoints.bali.points.map((point, idx) => (
                <div key={idx} className="rounded-lg bg-white/5 border border-white/5 p-4">
                  <h4 className="mb-1 font-bold text-white">{point.name}</h4>
                  <p className="text-sm text-slate-400">{point.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 rounded-2xl bg-gradient-to-r from-parks-gold/20 to-parks-gold/10 border border-parks-gold/20 p-8 text-center backdrop-blur-sm">
          <h3 className="mb-4 text-2xl font-bold text-parks-gold">
            {t.timeline.ctaTitle}
          </h3>
          <p className="text-lg text-slate-300">
            {t.timeline.ctaSubtitle}
          </p>
        </div>
      </div>
    </section>
  )
}

export default TimelineSection
