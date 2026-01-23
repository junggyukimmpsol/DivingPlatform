import React from 'react'
import { useOutletContext } from 'react-router-dom'
import { CenterOutletContext } from '../../types/center.types'
import { TOURS_DATA } from '../../data/tours'

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
        {TOURS_DATA[center.id] && TOURS_DATA[center.id].reviews.length > 0 ? (
          TOURS_DATA[center.id].reviews.map((review, i) => (
            <div key={i} className="bg-white/5 border border-white/5 rounded-xl p-6 text-left">
              <div className="flex justify-between items-start mb-3">
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className={i < Number(review.rating) ? "text-yellow-400" : "text-gray-600"}>
                      {i < Number(review.rating) ? "⭐" : "☆"}
                    </span>
                  ))}
                </div>
                <span className="text-xs text-slate-500">{review.date}</span>
              </div>
              <p className="text-slate-300 text-sm mb-3 line-clamp-3">{review.content}</p>
              <p className="text-xs text-slate-500 text-right">- {review.writer}</p>
            </div>
          ))
        ) : (
          <div className="col-span-full text-slate-500 italic py-12">
            아직 등록된 리뷰가 없습니다.
          </div>
        )}
      </div>
    </div>
  )
}

export default ReviewsTab
