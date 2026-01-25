import React from 'react'
import { useOutletContext } from 'react-router-dom'
import { CenterOutletContext } from '../../types/center.types'

import { REVIEW_DATA } from '../../data/reviewData'

const ReviewsTab: React.FC = () => {
  const { center } = useOutletContext<CenterOutletContext>()

  // Get reviews for the current center
  const reviews = REVIEW_DATA[center.id] || []
  const showScroll = reviews.length > 3

  console.log('Current Center ID:', center.id);
  console.log('Reviews Data:', reviews);
  console.log('All Review Data:', REVIEW_DATA);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 text-center py-20">
      <div className="inline-block p-4 rounded-full bg-parks-gold/10 text-parks-gold text-4xl mb-6">
        ⭐
      </div>
      <h2 className="text-3xl font-display font-bold text-white mb-4">
        {center.nameKo} 생생 리뷰
      </h2>
      <p className="text-slate-400 max-w-md mx-auto mb-12">
        실제 방문객들의 소중한 후기를 모으고 있습니다.
        {center.nameKo}에서의 감동적인 순간들을 전해드릴게요.
      </p>

      <div className={`max-w-4xl mx-auto ${showScroll ? 'max-h-[600px] overflow-y-auto pr-2 custom-scrollbar' : ''}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reviews.length > 0 ? (
            reviews.map((review, i) => (
              <div key={i} className="bg-white/5 border border-white/5 rounded-xl p-6 text-left h-fit break-keep">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i} className="text-yellow-400">
                        ⭐
                      </span>
                    ))}
                  </div>
                  <span className="text-xs text-slate-500">Registered Review</span>
                </div>
                <p className="text-slate-300 text-sm leading-relaxed">{review}</p>
              </div>
            ))
          ) : (
            <div className="col-span-full text-slate-500 italic py-12">
              등록된 리뷰가 없습니다.
            </div>
          )}
        </div>
      </div>
      {showScroll && (
        <p className="text-slate-500 text-xs mt-4">
          스크롤하여 더 많은 리뷰를 확인하세요
        </p>
      )}
    </div>
  )
}

export default ReviewsTab
