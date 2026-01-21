import React from 'react'
import { useOutletContext } from 'react-router-dom'
import { CenterOutletContext } from '../../types/center.types'

const IntroductionTab: React.FC = () => {
  const { center } = useOutletContext<CenterOutletContext>()

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-4xl">{center.icon}</span>
          <div>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-white">
              {center.nameKo} <span className="text-parks-gold">소개</span>
            </h1>
            <p className="text-slate-400">{center.countryNameKo}, {center.name}</p>
          </div>
        </div>
        <p className="text-lg text-slate-300 leading-relaxed max-w-3xl">
          {center.description}. 환상적인 다이빙 경험을 Parks Local Diving과 함께하세요.
          상세한 스팟 특징과 사진, 영상 등은 곧 업데이트될 예정입니다.
        </p>
      </div>

      {/* 플레이스홀더 섹션 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="aspect-video rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-500 italic">
          센터 전경 / 활동 사진 준비 중...
        </div>
        <div className="aspect-video rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-500 italic">
          소개 영상 준비 중...
        </div>
      </div>

      <div className="mt-12 p-8 rounded-2xl bg-gradient-to-br from-ocean-dark to-slate-900 border border-white/5">
        <h3 className="text-xl font-bold text-white mb-4">📍 스팟 특징</h3>
        <ul className="space-y-3 text-slate-300">
          <li className="flex items-center gap-2">
            <span className="text-parks-gold">✓</span> 맑은 시야와 풍부한 수중 생태계
          </li>
          <li className="flex items-center gap-2">
            <span className="text-parks-gold">✓</span> 초보자부터 전문가까지 아우르는 다양한 포인트
          </li>
          <li className="flex items-center gap-2">
            <span className="text-parks-gold">✓</span> Parks Local 만의 전문 가이드 시스템
          </li>
        </ul>
      </div>
    </div>
  )
}

export default IntroductionTab
