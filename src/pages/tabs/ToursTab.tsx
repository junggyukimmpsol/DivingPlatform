import React from 'react'
import { useOutletContext } from 'react-router-dom'
import { CenterOutletContext } from '../../types/center.types'

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
      <p className="text-slate-400 max-w-md mx-auto">
        다양한 투어 옵션과 상세 일정을 곧 공개합니다.
        맞춤형 투어 문의는 우측 하단 문의 버튼을 이용해 주세요.
      </p>

      <div className="mt-12 max-w-4xl mx-auto border border-dashed border-white/20 rounded-2xl p-12">
        <p className="text-slate-500 italic">상세 투어 테이블 및 타임라인 데이터 로딩 예정...</p>
      </div>
    </div>
  )
}

export default ToursTab
