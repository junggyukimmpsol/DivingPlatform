import React from 'react'
import { useLanguage } from '../contexts/LanguageContext'

const WhyUsSection = () => {
  const { t } = useLanguage()

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 to-ocean-dark py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <div className="mb-4 inline-block rounded-full bg-parks-gold/10 border border-parks-gold/20 px-6 py-2 text-sm font-bold text-parks-gold">
            {t.whyUs.badge}
          </div>
          <h2 className="mb-6 text-4xl font-display font-bold text-white md:text-5xl lg:text-6xl">
            {t.whyUs.title}
          </h2>
          <p className="text-xl font-light text-slate-300 md:text-2xl">
            <span className="font-semibold text-white">{t.whyUs.subtitle}</span>{t.whyUs.subtitleEnd}
          </p>
        </div>

        {/* Features Grid */}
        <div className="mb-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {t.whyUs.features.map((feature, index) => (
            <div
              key={index}
              className="glass-card transform rounded-2xl p-6 transition-all duration-300 hover:scale-105 hover:bg-white/10"
            >
              <div className="mb-4 flex items-center gap-3">
                <span className="text-4xl filter drop-shadow-lg">{feature.icon}</span>
              </div>
              <h3 className="mb-2 text-xl font-bold text-white">
                {feature.title}
              </h3>
              <p className="mb-3 text-lg font-bold text-parks-gold">
                {feature.highlight}
              </p>
              {feature.description && (
                <p className="mb-2 text-sm leading-relaxed text-slate-400">
                  {feature.description}
                </p>
              )}
              <p className="text-sm leading-relaxed">
                <span className="font-bold text-parks-gold">{feature.highlight2}</span>
                <span className="text-slate-400">{feature.highlight3}</span>
              </p>
            </div>
          ))}
        </div>

        {/* All-Inclusive Items */}
        <div className="glass-card rounded-3xl p-8 md:p-12 relative overflow-hidden">
          {/* Glow effect */}
          <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-ocean-teal/20 rounded-full blur-[80px]"></div>

          <h3 className="mb-8 text-center text-2xl font-display font-bold text-white md:text-3xl relative z-10">
            {t.whyUs.inclusiveTitle}
          </h3>
          <p className="mb-8 text-center text-lg text-slate-300 relative z-10">
            {t.whyUs.inclusiveSubtitle1}
            <br />
            <span className="font-bold text-parks-gold">{t.whyUs.inclusiveSubtitle2}</span>
          </p>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 relative z-10">
            {t.whyUs.inclusiveItems.map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/5 p-4 hover:bg-white/10 transition-colors"
              >
                <span className="text-3xl">{item.icon}</span>
                <div className="flex-1">
                  <p className="font-semibold text-white">{item.name}</p>
                  <p className="text-sm font-bold text-parks-gold">{t.whyUs.free}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Additional Info */}
          <div className="mt-8 rounded-xl bg-ocean-dark/50 border border-white/5 p-6 relative z-10">
            <h4 className="mb-3 font-bold text-white">{t.whyUs.notIncludedTitle}</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              {t.whyUs.notIncludedItems.map((item, index) => (
                <li key={index}>• {item}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Tour Package Highlights */}
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl bg-gradient-to-br from-parks-gold/20 to-parks-gold/5 border border-parks-gold/20 p-8 shadow-lg backdrop-blur-sm">
            <h3 className="mb-4 text-2xl font-bold text-parks-gold">{t.whyUs.tourPackageTitle}</h3>
            <ul className="space-y-3 text-slate-200">
              {t.whyUs.tourPackageItems.map((item, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="mt-1 text-parks-gold">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl bg-gradient-to-br from-ocean-teal/20 to-ocean-blue/5 border border-ocean-teal/20 p-8 shadow-lg backdrop-blur-sm">
            <h3 className="mb-4 text-2xl font-bold text-ocean-teal">{t.whyUs.safetyTitle}</h3>
            <ul className="space-y-3 text-slate-200">
              {t.whyUs.safetyItems.map((item, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="mt-1">{item.icon}</span>
                  <span>{item.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

export default WhyUsSection
