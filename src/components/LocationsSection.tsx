import React from 'react'
import { useLanguage } from '../contexts/LanguageContext'
import InteractiveMap from './map/InteractiveMap'

const LocationsSection = () => {
  const { t } = useLanguage()

  const colors = [
    'from-blue-500 to-blue-700',
    'from-purple-500 to-purple-700',
    'from-emerald-500 to-emerald-700',
    'from-orange-500 to-orange-700',
  ]

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-ocean-dark to-slate-950 py-16 md:py-24" data-section="locations">
      {/* Decorative Background */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute left-0 top-0 h-[600px] w-[600px] rounded-full bg-ocean-accent/10 blur-[120px]"></div>
        <div className="absolute bottom-0 right-0 h-[800px] w-[800px] rounded-full bg-ocean-teal/10 blur-[120px]"></div>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <div className="mb-4 inline-block rounded-full bg-ocean-teal/10 border border-ocean-teal/20 px-6 py-2 text-sm font-bold text-ocean-teal">
            {t.locations.badge}
          </div>
          <h2 className="mb-6 text-4xl font-display font-bold text-white md:text-5xl lg:text-6xl">
            {t.locations.title}
          </h2>
          <p className="text-xl font-light text-slate-300 md:text-2xl">
            <span className="font-semibold text-parks-gold">{t.locations.subtitle}</span>{t.locations.subtitleEnd}
          </p>
          <p className="mt-4 text-lg text-slate-400">
            {t.locations.description1}
            <br />
            {t.locations.description2}
          </p>
        </div>

        {/* Interactive Map */}
        <div className="mb-16">
          <InteractiveMap />
        </div>

        {/* Locations Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {t.locations.locations.map((location, index) => (
            <div
              key={index}
              className="glass-card group transform rounded-2xl p-6 transition-all duration-300 hover:scale-105 hover:bg-white/10 border border-white/5"
            >
              {/* Branch Number Badge */}
              <div className={`mb-4 inline-block rounded-full bg-gradient-to-r ${colors[index]} px-4 py-1 text-sm font-bold text-white shadow-lg`}>
                {location.number}
              </div>

              {/* Location Name */}
              <h3 className="mb-2 text-3xl font-display font-bold text-white">
                {location.name}
              </h3>
              <p className="mb-4 text-xl font-medium text-slate-300">
                {location.nameKo}
              </p>

              {/* Description */}
              <p className="mb-6 text-sm text-slate-400 border-b border-white/10 pb-4">{location.description}</p>

              {/* Diving Points */}
              <div className="mb-4">
                <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">다이빙 포인트</h4>
                <div className="space-y-2">
                  {location.features.map((feature, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2"
                    >
                      <span className="text-ocean-teal">📍</span>
                      <span className="text-sm font-medium text-slate-300">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Services */}
              {location.services && (
                <div className="mb-4">
                  <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">제공 서비스</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {location.services.map((service, idx) => (
                      <div
                        key={idx}
                        className={`flex items-center gap-1.5 text-xs rounded-lg px-2 py-1.5 ${
                          service.highlight
                            ? 'bg-parks-gold/20 border border-parks-gold/40 text-parks-gold font-bold'
                            : 'bg-white/5 border border-white/10 text-slate-300'
                        }`}
                      >
                        <span className="text-sm">{service.icon}</span>
                        <span>{service.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* PADI Badge */}
              <div className="mt-4 rounded-lg bg-white/5 border border-white/10 p-3 text-center transition-colors group-hover:bg-white/10">
                <div className="flex items-center justify-center gap-2">
                  <span className="text-2xl drop-shadow-md">⭐</span>
                  <div className="text-left">
                    <p className="text-xs font-semibold text-ocean-teal">PADI</p>
                    <p className="text-sm font-bold text-parks-gold">{t.locations.padi5Star}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {t.locations.trustIndicators.map((indicator, index) => (
            <div key={index} className="glass-card rounded-2xl p-6 text-center hover:bg-white/5 transition-colors">
              <div className="mb-3 text-4xl filter drop-shadow-lg">{indicator.icon}</div>
              <h4 className="mb-2 text-2xl font-bold text-white">{indicator.value}</h4>
              <p className="text-slate-400">{indicator.label}</p>
            </div>
          ))}
        </div>

        {/* Map Visualization Hint */}
        <div className="mt-12 text-center">
          <p className="text-lg text-ocean-teal font-medium tracking-wide">
            {t.locations.bottomText}
          </p>
        </div>
      </div>
    </section>
  )
}

export default LocationsSection
