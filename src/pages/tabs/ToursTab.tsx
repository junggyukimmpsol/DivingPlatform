import React from 'react'
import { useOutletContext } from 'react-router-dom'
import { CenterOutletContext } from '../../types/center.types'
import { TOURS_DATA } from '../../data/tours'

const ToursTab: React.FC = () => {
  const { center } = useOutletContext<CenterOutletContext>()

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 text-center py-20">
      <div className="inline-block p-4 rounded-full bg-parks-gold/10 text-parks-gold text-4xl mb-6">
        🚢
      </div>
      <h2 className="text-3xl font-display font-bold text-white mb-4">
        {center.nameKo} 투어 일정
      </h2>

      {TOURS_DATA[center.id] ? (
        <div className="max-w-2xl mx-auto">
          <p className="text-xl text-white mb-2 font-bold">{TOURS_DATA[center.id].title}</p>
          <p className="text-slate-400 mb-6">{TOURS_DATA[center.id].description}</p>

          <div className="mt-8 border border-white/10 rounded-2xl p-8 bg-white/5">
            <h3 className="text-lg font-bold text-white mb-4">투어 특징</h3>
            <ul className="text-left space-y-3 text-slate-300">
              {/* Since we don't have detailed features in the crawled data yet, we can show a placeholder or just the price if available */}
              <li className="flex items-start gap-2">
                <span>💰</span>
                <span>가격: {TOURS_DATA[center.id].price}</span>
              </li>
              <li className="flex items-start gap-2">
                <span>📝</span>
                <span>상세 내용은 곧 업데이트될 예정입니다.</span>
              </li>
            </ul>
          </div>
        </div>
      ) : (
        <p className="text-slate-400 max-w-md mx-auto">
          준비 중입니다.
        </p>
      )}

      <div className="mt-12 max-w-4xl mx-auto border border-dashed border-white/20 rounded-2xl p-12">
        <p className="text-slate-500 italic">상세 투어 테이블 및 타임라인 데이터 로딩 예정...</p>
      </div>
    </div>
  )
}

export default ToursTab
