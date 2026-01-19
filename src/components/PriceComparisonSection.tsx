import { useLanguage } from '../contexts/LanguageContext'

const PriceComparisonSection = () => {
  const { t } = useLanguage()

  const discountColors = [
    'from-parks-gold/20 to-parks-gold/5 border-parks-gold/20',
    'from-ocean-teal/20 to-ocean-teal/5 border-ocean-teal/20',
    'from-purple-500/20 to-purple-500/5 border-purple-500/20',
  ]

  const discountTextColors = ['text-parks-gold', 'text-ocean-teal', 'text-white']

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-ocean-dark to-slate-950 py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <div className="mb-4 inline-block rounded-full bg-parks-gold/10 border border-parks-gold/20 px-6 py-2 text-sm font-bold text-parks-gold">
            {t.pricing.badge}
          </div>
          <h2 className="mb-6 text-4xl font-display font-bold text-white md:text-5xl lg:text-6xl">
            {t.pricing.title}
          </h2>
          <p className="text-xl font-light text-slate-300 md:text-2xl">
            {t.pricing.subtitle} <span className="font-bold text-parks-gold">{t.pricing.subtitleHighlight}</span>
          </p>
        </div>

        {/* Price Comparison Table */}
        {/* Desktop View: Table */}
        <div className="hidden md:block glass-card overflow-x-auto rounded-3xl p-8 relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-parks-gold/5 rounded-full blur-[80px] pointer-events-none"></div>

          <table className="w-full min-w-[800px] border-collapse relative z-10">
            <thead>
              <tr className="border-b border-white/10 text-slate-400 uppercase text-xs tracking-wider">
                <th className="p-4 text-left font-medium">{t.pricing.tableHeaders.location}</th>
                <th className="p-4 text-left font-medium">{t.pricing.tableHeaders.product}</th>
                <th className="p-4 text-left font-medium">{t.pricing.tableHeaders.competitor}</th>
                <th className="p-4 text-left font-bold text-parks-gold">{t.pricing.tableHeaders.parks}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {t.pricing.priceData.map((item, index) => (
                <tr
                  key={index}
                  className="transition-all duration-200 hover:bg-white/5"
                >
                  <td className="p-4">
                    <div className="whitespace-pre-line text-sm font-medium text-slate-300">
                      {item.location}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="font-semibold text-white">{item.type}</div>
                    {item.duration && (
                      <div className="mt-1 whitespace-pre-line text-xs text-slate-500">
                        {item.duration}
                      </div>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="whitespace-pre-line text-lg font-medium text-slate-500 line-through decoration-slate-600">
                      {item.competitor}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div>
                        <div className="text-2xl font-bold text-ocean-teal">{item.parks}</div>
                        <div className="text-sm font-bold text-parks-gold">{item.savings}</div>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile View: Horizontal-First Cards */}
        <div className="md:hidden space-y-3 relative z-10">
          {t.pricing.priceData.map((item, index) => (
            <div key={index} className="glass-card p-5 rounded-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-ocean-teal/5 rounded-full blur-[40px] pointer-events-none"></div>

              <div className="relative z-10">
                {/* Top Section: Side-by-Side */}
                <div className="flex items-start gap-4 mb-4">
                  <div className="flex-shrink-0 w-24 px-2 py-2 rounded-lg bg-white/5 border border-white/10 text-[10px] font-bold text-ocean-teal text-center leading-tight">
                    {item.location.replace(/\n/g, ' ')}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-bold text-white mb-1 leading-snug">{item.type}</h3>
                    {item.duration && (
                      <p className="text-xs text-slate-500 leading-tight">{item.duration.replace(/\n/g, ' ')}</p>
                    )}
                  </div>
                </div>

                {/* Bottom Section: Pricing Details */}
                <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-2">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-500 mb-0.5">{t.pricing.mobileCompetitorLabel}</span>
                    <span className="text-sm text-slate-400 line-through decoration-slate-600">
                      {item.competitor.split('\n')[0]}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="flex flex-col items-end">
                      <span className="text-xl font-bold text-white tracking-tight leading-none mb-1">{item.parks}</span>
                      <span className="text-[10px] font-bold text-parks-gold bg-parks-gold/10 px-2 py-0.5 rounded-full">
                        {item.savings.replace(/[()]/g, '')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Important Notes */}
        <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm">
          <h3 className="mb-4 text-2xl font-bold text-parks-gold">{t.pricing.notesTitle}</h3>
          <div className="space-y-3 text-slate-300">
            {t.pricing.notes.map((note, index) => (
              <div key={index} className="flex items-start gap-3">
                <span className="mt-1 font-bold text-parks-gold">{note.number}.</span>
                <p className="whitespace-pre-line">
                  {note.highlight && <span className="font-bold text-white">{note.highlight}</span>}
                  {note.text}
                  {note.subtext && (
                    <span className="font-bold text-ocean-teal">
                      {'\n'}{note.subtext}
                    </span>
                  )}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Discount Highlight */}
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {t.pricing.discountHighlight.map((item, index) => (
            <div
              key={index}
              className={`rounded-2xl bg-gradient-to-br ${discountColors[index]} border p-6 text-center backdrop-blur-sm`}
            >
              <h4 className={`mb-2 text-3xl font-bold ${discountTextColors[index]}`}>{item.value}</h4>
              <p className="text-slate-300">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default PriceComparisonSection
