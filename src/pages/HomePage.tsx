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

        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="glass-card p-8 rounded-2xl border border-white/5 space-y-4">
            <div className="text-3xl">🇵🇭</div>
            <h3 className="text-xl font-bold text-white">필리핀</h3>
            <p className="text-slate-400">세부와 보홀, 두 곳의 프리미엄 지점에서 최고의 다이빙 경험을 제공합니다.</p>
          </div>
          <div className="glass-card p-8 rounded-2xl border border-white/5 space-y-4">
            <div className="text-3xl">🇲🇾</div>
            <h3 className="text-xl font-bold text-white">말레이시아</h3>
            <p className="text-slate-400">코타키나발루의 아름다운 바다에서 잊지 못할 추억을 만들어보세요.</p>
          </div>
          <div className="glass-card p-8 rounded-2xl border border-white/5 space-y-4">
            <div className="text-3xl">🇮🇩</div>
            <h3 className="text-xl font-bold text-white">인도네시아</h3>
            <p className="text-slate-400">발리 전역의 4개 지점에서 전문적인 다이빙 가이딩을 만나보세요.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage
