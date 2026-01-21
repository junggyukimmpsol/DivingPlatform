import React, { useState, useCallback } from 'react'
import MapSVG from './MapSVG'
import LocationMarker from './LocationMarker'
import LocationTooltip from './LocationTooltip'
import { DIVING_LOCATIONS, MAP_CONFIG } from '../../data/diving-locations'
import { getGradientColors } from '../../utils/map-coordinates'
import { useMediaQuery } from '../../hooks/useMediaQuery'

import { useNavigate } from 'react-router-dom'

// 상수 정의
const DESKTOP_BREAKPOINT = '(min-width: 768px)'

/**
 * 2D 인터랙티브 다이빙 지도 메인 컴포넌트
 */
const InteractiveMap: React.FC = () => {
  const [hoveredLocation, setHoveredLocation] = useState<string | null>(null)
  const navigate = useNavigate()

  // 반응형 감지 (useMediaQuery 훅 사용)
  const isDesktop = useMediaQuery(DESKTOP_BREAKPOINT)

  // 마커 클릭 핸들러 - 지역 페이지로 이동
  const handleMarkerClick = useCallback((path: string) => {
    navigate(path)
  }, [navigate])

  // 호버 핸들러들
  const handleMarkerHover = useCallback((locationId: string) => {
    setHoveredLocation(locationId)
  }, [])

  const handleMarkerLeave = useCallback(() => {
    setHoveredLocation(null)
  }, [])

  const hoveredLocationData = hoveredLocation
    ? DIVING_LOCATIONS.find(loc => loc.id === hoveredLocation)
    : null

  return (
    <div className="relative w-full">
      {/* 지도 제목 섹션 */}
      <div className="text-center mb-8">
        <h3 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
          지역 선택
        </h3>
        <p className="text-slate-400 text-sm md:text-base max-w-2xl mx-auto">
          관심 있는 국가와 지역을 지도의 마커나 아래 리스트에서 클릭하세요.
          각 지역은 독립적인 공간으로 구성되어 있습니다.
        </p>
      </div>

      {/* 2D 지도 컨테이너 */}
      <div
        className="relative w-full overflow-hidden rounded-2xl border border-white/10 shadow-2xl bg-ocean-dark"
        style={{
          height: isDesktop ? '600px' : '500px',
        }}
      >
        {/* 2D 지도 레이어 */}
        <div className="relative w-full h-full">
          {/* SVG 지도 */}
          <MapSVG />

          {/* SVG 마커들 오버레이 */}
          <svg
            viewBox={`0 0 ${MAP_CONFIG.viewBox.width} ${MAP_CONFIG.viewBox.height}`}
            className="absolute inset-0 w-full h-full pointer-events-auto"
            preserveAspectRatio="xMidYMid meet"
          >
            {/* 마커 정의 생략 - 기존 defs 사용 */}
            <defs>
              {DIVING_LOCATIONS.map((location) => {
                const colors = getGradientColors(location.color)
                return (
                  <linearGradient
                    key={location.id}
                    id={`marker-gradient-${location.id}`}
                    x1="0%"
                    y1="0%"
                    x2="0%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor={colors.start} />
                    <stop offset="100%" stopColor={colors.end} />
                  </linearGradient>
                )
              })}
            </defs>

            {DIVING_LOCATIONS.map((location) => (
              <LocationMarker
                key={location.id}
                location={location}
                isHovered={hoveredLocation === location.id}
                isSelected={false}
                onHover={() => handleMarkerHover(location.id)}
                onLeave={handleMarkerLeave}
                onClick={() => handleMarkerClick(location.path)}
              />
            ))}
          </svg>

          {/* 툴팁 */}
          {hoveredLocationData && (
            <LocationTooltip location={hoveredLocationData} />
          )}
        </div>
      </div>

      {/* 범례 (Legend) */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {DIVING_LOCATIONS.map((location) => (
          <button
            key={location.id}
            onClick={() => handleMarkerClick(location.path)}
            onMouseEnter={() => handleMarkerHover(location.id)}
            onMouseLeave={handleMarkerLeave}
            className={`
              glass-card rounded-xl p-4 text-left transition-all duration-300
              hover:scale-105 hover:bg-white/10 border border-white/5
              ${hoveredLocation === location.id ? 'bg-white/10 border-parks-gold/30' : ''}
            `}
          >
            <div className="flex items-center gap-3">
              <span className="text-3xl">{location.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-white font-bold text-lg">
                  {location.nameKo}
                </p>
                <p className="text-slate-400 text-xs truncate">{location.description}</p>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* 컨트롤 힌트 */}
      <div className="mt-6 text-center">
        <p className="text-sm text-ocean-teal font-medium">
          💡 Tip: 지도를 호버하면 더 많은 정보를 볼 수 있습니다
        </p>
      </div>
    </div>
  )
}

export default React.memo(InteractiveMap)
