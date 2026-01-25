import React from 'react'
import { useOutletContext } from 'react-router-dom'
import { CenterOutletContext } from '../../types/center.types'

const PricingTab: React.FC = () => {
  const { center } = useOutletContext<CenterOutletContext>()

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 text-center py-20">
      <div className="inline-block p-4 rounded-full bg-parks-gold/10 text-parks-gold text-4xl mb-6">
        💰
      </div>
      <h2 className="text-3xl font-display font-bold text-white mb-4">
        {center.nameKo} 가격 안내
      </h2>
      <p className="text-slate-400 max-w-md mx-auto">
        투어 옵션별 상세 가격 정보를 준비 중입니다.
        가장 합리적인 가격으로 최고의 다이빙을 약속드립니다.
      </p>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-8 opacity-50 grayscale">
            <div className="h-4 w-24 bg-white/10 rounded mb-4 mx-auto"></div>
            <div className="h-8 w-32 bg-white/10 rounded mb-6 mx-auto"></div>
            <div className="space-y-2">
              <div className="h-3 w-full bg-white/10 rounded"></div>
              <div className="h-3 w-full bg-white/10 rounded"></div>
              <div className="h-3 w-4/5 bg-white/10 rounded mx-auto"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default PricingTab
