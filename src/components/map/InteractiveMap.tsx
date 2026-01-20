import React, { useState, useCallback } from 'react'
import MapSVG from './MapSVG'
import LocationMarker from './LocationMarker'
import LocationTooltip from './LocationTooltip'
import { DIVING_LOCATIONS, MAP_CONFIG } from '../../data/diving-locations'
import { getGradientColors } from '../../utils/map-coordinates'
import { useMediaQuery } from '../../hooks/useMediaQuery'

// 상수 정의
const SCROLL_DELAY_MS = 300
const DESKTOP_BREAKPOINT = '(min-width: 768px)'

/**
 * 2.5D 인터랙티브 다이빙 지도 메인 컴포넌트
 */
const InteractiveMap: React.FC = () => {
  const [hoveredLocation, setHoveredLocation] = useState<string | null>(null)
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null)

  // 반응형 감지 (useMediaQuery 훅 사용)
  const isDesktop = useMediaQuery(DESKTOP_BREAKPOINT)

  // 마커 클릭 핸들러 - LocationsSection 카드로 스크롤
  const handleMarkerClick = useCallback((locationId: string) => {
    setSelectedLocation(locationId)

    // 해당 location의 detailsRef를 찾아서 스크롤
    const location = DIVING_LOCATIONS.find(loc => loc.id === locationId)
    if (location) {
      // LocationsSection의 그리드 아이템으로 스크롤
      // 약간의 딜레이를 주고 스크롤 (애니메이션 효과)
      setTimeout(() => {
        const sectionElement = document.querySelector('[data-section="locations"]')
        if (sectionElement) {
          sectionElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          })
        }
      }, SCROLL_DELAY_MS)
    }
  }, [])

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
        <div className="inline-block rounded-full bg-ocean-teal/10 border border-ocean-teal/20 px-6 py-2 text-sm font-bold text-ocean-teal mb-4">
          🗺️ Interactive Map
        </div>
        <h3 className="text-3xl md:text-4xl font-display font-bold text-white mb-2">
          다이빙 샵 위치
        </h3>
        <p className="text-slate-400 text-sm md:text-base">
          지도를 클릭하여 각 지점의 상세 정보를 확인하세요
        </p>
      </div>

      {/* 3D 지도 컨테이너 */}
      <div
        className="relative w-full overflow-hidden rounded-2xl border border-white/10 shadow-2xl"
        style={{
          height: isDesktop ? '600px' : '400px',
          perspective: isDesktop ? `${MAP_CONFIG.perspective.value}px` : 'none',
          perspectiveOrigin: 'center 40%',
        }}
      >
        {/* 배경 그라디언트 */}
        <div className="absolute inset-0 bg-gradient-to-b from-ocean-dark to-slate-950 opacity-50"></div>

        {/* 2.5D 지도 레이어 */}
        <div
          className="relative w-full h-full transition-transform duration-700 ease-out"
          style={{
            transform: isDesktop
              ? `rotateX(${MAP_CONFIG.perspective.rotateX}deg) rotateZ(${MAP_CONFIG.perspective.rotateZ}deg)`
              : 'none',
            transformStyle: 'preserve-3d',
          }}
        >
          {/* SVG 지도 */}
          <MapSVG />

          {/* SVG 마커들 오버레이 */}
          <svg
            viewBox={`0 0 ${MAP_CONFIG.viewBox.width} ${MAP_CONFIG.viewBox.height}`}
            className="absolute inset-0 w-full h-full pointer-events-auto"
            preserveAspectRatio="xMidYMid meet"
          >
            {/* 모든 마커가 공유하는 그라디언트와 필터 정의 */}
            <defs>
              {DIVING_LOCATIONS.map((location) => {
                const colors = getGradientColors(location.color)
                return (
                  <React.Fragment key={location.id}>
                    <linearGradient
                      id={`marker-gradient-${location.id}`}
                      x1="0%"
                      y1="0%"
                      x2="0%"
                      y2="100%"
                    >
                      <stop offset="0%" stopColor={colors.start} />
                      <stop offset="100%" stopColor={colors.end} />
                    </linearGradient>

                    <filter
                      id={`marker-shadow-${location.id}`}
                      x="-50%"
                      y="-50%"
                      width="200%"
                      height="200%"
                    >
                      <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
                      <feOffset dx="0" dy="4" result="offsetblur" />
                      <feComponentTransfer>
                        <feFuncA type="linear" slope="0.5" />
                      </feComponentTransfer>
                      <feMerge>
                        <feMergeNode />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </React.Fragment>
                )
              })}
            </defs>

            {DIVING_LOCATIONS.map((location) => (
              <LocationMarker
                key={location.id}
                location={location}
                isHovered={hoveredLocation === location.id}
                isSelected={selectedLocation === location.id}
                onHover={() => handleMarkerHover(location.id)}
                onLeave={handleMarkerLeave}
                onClick={() => handleMarkerClick(location.id)}
              />
            ))}
          </svg>

          {/* 툴팁 */}
          {hoveredLocationData && (
            <LocationTooltip location={hoveredLocationData} />
          )}
        </div>

        {/* 안내 텍스트 (모바일) */}
        {!isDesktop && (
          <div className="absolute bottom-4 left-0 right-0 text-center">
            <p className="text-xs text-slate-400 bg-slate-900/80 inline-block px-4 py-2 rounded-full">
              위치를 탭하여 상세 정보 보기
            </p>
          </div>
        )}
      </div>

      {/* 범례 (Legend) */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        {DIVING_LOCATIONS.map((location) => (
          <button
            key={location.id}
            onClick={() => handleMarkerClick(location.id)}
            onMouseEnter={() => handleMarkerHover(location.id)}
            onMouseLeave={handleMarkerLeave}
            className={`
              glass-card rounded-lg p-3 text-left transition-all duration-300
              hover:scale-105 hover:bg-white/10
              ${selectedLocation === location.id ? 'ring-2 ring-parks-gold' : ''}
              ${hoveredLocation === location.id ? 'bg-white/10' : ''}
            `}
          >
            <div className="flex items-center gap-2">
              <span className="text-2xl">{location.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold text-sm truncate">
                  {location.nameKo}
                </p>
                <p className="text-slate-400 text-xs truncate">{location.name}</p>
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
