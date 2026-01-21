import React from 'react'
import { useOutletContext } from 'react-router-dom'
import { CenterOutletContext } from '../../types/center.types'

const ReviewsTab: React.FC = () => {
  const { center } = useOutletContext<CenterOutletContext>()

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 text-center py-20">
      <div className="inline-block p-4 rounded-full bg-parks-gold/10 text-parks-gold text-4xl mb-6">
        ⭐
      </div>
      <h2 className="text-3xl font-display font-bold text-white mb-4">
        {center.nameKo} 생생 리뷰
      </h2>
      <p className="text-slate-400 max-w-md mx-auto">
        실제 방문객들의 소중한 후기를 모으고 있습니다.
        {center.nameKo}에서의 감동적인 순간들을 전해드릴게요.
      </p>

      <div className="mt-12 max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white/5 border border-white/5 rounded-xl p-6 text-left">
            <div className="flex gap-1 mb-3">
              {[1, 2, 3, 4, 5].map(s => <span key={s}>⭐</span>)}
            </div>
            <div className="h-4 w-full bg-white/5 rounded mb-2"></div>
            <div className="h-4 w-2/3 bg-white/5 rounded"></div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ReviewsTab
