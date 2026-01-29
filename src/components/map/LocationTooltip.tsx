import React, { useEffect, useState, useMemo } from 'react'
import { DivingLocation } from '../../types/map.types'
import { MAP_CONFIG } from '../../data/diving-locations'
import { useLanguage } from '../../contexts/LanguageContext'

interface LocationTooltipProps {
  location: DivingLocation
}

const TOOLTIP_FADE_IN_DELAY_MS = 50

/**
 * 지도 마커 호버 시 표시되는 툴팁
 * glass-card 디자인 시스템 사용
 */
const LocationTooltip: React.FC<LocationTooltipProps> = ({ location }) => {
  const [isVisible, setIsVisible] = useState(false)
  const { t } = useLanguage()
  const { coordinates, name, nameKo, description, icon } = location

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), TOOLTIP_FADE_IN_DELAY_MS)
    return () => clearTimeout(timer)
  }, [])

  // 툴팁 위치 계산 (SVG 좌표를 화면 좌표로 변환)
  const tooltipStyle: React.CSSProperties = useMemo(
    () => ({
      position: 'absolute' as const,
      left: `${(coordinates.x / MAP_CONFIG.viewBox.width) * 100}%`,
      top: `${(coordinates.y / MAP_CONFIG.viewBox.height) * 100}%`,
      transform: 'translate(-50%, -120%)',
      zIndex: 100,
      pointerEvents: 'none' as const,
    }),
    [coordinates.x, coordinates.y]
  )

  return (
    <div
      style={tooltipStyle}
      className={`
        transition-all duration-300 ease-out
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}
      `}
    >
      {/* 툴팁 카드 */}
      <div className="glass-card rounded-xl p-4 border border-white/10 shadow-2xl min-w-[200px]">
        {/* 아이콘 + 제목 */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl">{icon}</span>
          <div>
            <h4 className="text-white font-bold text-lg leading-tight">{nameKo}</h4>
            <p className="text-slate-400 text-sm">{name}</p>
          </div>
        </div>

        {/* 설명 */}
        <p className="text-slate-300 text-sm border-t border-white/10 pt-2 mt-2">
          {description}
        </p>

        {/* 클릭 안내 */}
        <div className="flex items-center gap-1 mt-3 text-ocean-teal text-xs font-medium">
          <span>👆</span>
          <span>{t.common.clickToViewDetails}</span>
        </div>
      </div>

      {/* 툴팁 화살표 */}
      <div className="absolute left-1/2 bottom-0 transform -translate-x-1/2 translate-y-full">
        <div
          className="w-0 h-0"
          style={{
            borderLeft: '8px solid transparent',
            borderRight: '8px solid transparent',
            borderTop: '8px solid rgba(255, 255, 255, 0.1)',
          }}
        ></div>
      </div>
    </div>
  )
}

export default React.memo(LocationTooltip)
