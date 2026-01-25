import React from 'react'
import InteractiveMap from '../components/map/InteractiveMap'

const HomePage: React.FC = () => {
  return (
    <div className="pt-20 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-6">
            Explore Your Next <span className="text-parks-gold">Dive Adventure</span>
          </h1>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto">
            본질에 집중하는 프리미엄 다이빙 서비스. 지도를 클릭하여 원하는 지역의 지점을 선택하세요.
          </p>
        </div>

        <div className="glass-card p-4 md:p-8 rounded-3xl border border-white/10">
          <InteractiveMap />
        </div>

        {/* Country list removed as per user request */}
      </div>
    </div>
  )
}

export default HomePage
