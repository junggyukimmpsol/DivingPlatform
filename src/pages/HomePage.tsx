import { useLanguage } from '../contexts/LanguageContext'
import { useNavigate } from 'react-router-dom'
import { DIVING_LOCATIONS } from '../data/diving-locations'

const HomePage: React.FC = () => {
  const { t } = useLanguage()
  const navigate = useNavigate()

  return (
    <div className="pt-20 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
            {t.locations.title}
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            {t.locations.description1}
          </p>
        </div>

        {/* Location Cards Grid */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-6 max-w-5xl mx-auto">
          {DIVING_LOCATIONS.map((location, index) => {
            const locT = t.locations.locations[index]
            return (
              <div
                key={location.id}
                className="glass-card p-3 sm:p-4 md:p-6 rounded-xl md:rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-300 group cursor-pointer"
                onClick={() => navigate(location.path)}
              >
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-2 sm:gap-4 mb-3 sm:mb-4">
                  <div className={`
                    w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl md:rounded-2xl flex items-center justify-center bg-gradient-to-br ${location.color} shadow-lg group-hover:scale-110 transition-transform flex-shrink-0 overflow-hidden p-1
                  `}>
                    <img
                      src={`https://flagcdn.com/w80/${location.icon}.png`}
                      alt={`${location.name} flag`}
                      className="w-full h-full object-cover rounded-lg md:rounded-xl"
                    />
                  </div>
                  <div className="flex-1 min-w-0 text-center sm:text-left">
                    <div className="text-xs sm:text-sm text-slate-400 mb-0.5 sm:mb-1">{locT.number}</div>
                    <h3 className="font-display font-bold text-white text-lg sm:text-xl md:text-2xl mb-0.5 sm:mb-1">
                      {locT.name}
                    </h3>
                    <p className="text-parks-gold text-xs sm:text-sm">{locT.nameKo}</p>
                  </div>
                </div>

                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-3 sm:mb-4 line-clamp-2 sm:line-clamp-none">
                  {locT.description}
                </p>

                <button
                  className="w-full py-2 sm:py-2.5 md:py-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-parks-gold/50 rounded-lg md:rounded-xl text-xs sm:text-sm text-slate-300 hover:text-white transition-all flex items-center justify-center gap-2 group-hover:border-parks-gold/50"
                >
                  <span>{t.nav.locationInfo}</span>
                  <svg className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default HomePage
