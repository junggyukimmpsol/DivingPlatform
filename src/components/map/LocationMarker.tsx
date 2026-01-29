import React, { useMemo } from 'react'
import { DivingLocation } from '../../types/map.types'
import { getGradientColors } from '../../utils/map-coordinates'
import { useLanguage } from '../../contexts/LanguageContext'
import { DIVING_LOCATIONS } from '../../data/diving-locations'

interface LocationMarkerProps {
  location: DivingLocation
  isHovered: boolean
  isSelected: boolean
  onHover: () => void
  onLeave: () => void
  onClick: () => void
}

/**
 * 지도상의 다이빙 지점 마커 컴포넌트
 * 호버/클릭 인터랙션 지원
 */
const LocationMarker: React.FC<LocationMarkerProps> = ({
  location,
  isHovered,
  isSelected,
  onHover,
  onLeave,
  onClick,
}) => {
  const { t, language } = useLanguage()
  const { coordinates, color, icon } = location
  const { x, y } = coordinates

  // Get location index from DIVING_LOCATIONS
  const locationIndex = DIVING_LOCATIONS.findIndex(loc => loc.id === location.id)
  const locT = t.locations.locations[locationIndex]
  const displayName = language === 'en' ? locT.name : locT.nameKo

  const colors = useMemo(() => getGradientColors(color), [color])
  const scale = isHovered ? 1.3 : isSelected ? 1.2 : 1
  const translateZ = isHovered ? 80 : isSelected ? 60 : 50

  const gStyle = useMemo(
    () => ({
      cursor: 'pointer' as const,
      transform: `translateZ(${translateZ}px) scale(${scale})`,
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    }),
    [translateZ, scale]
  )

  return (
    <g
      transform={`translate(${x}, ${y})`}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onClick={onClick}
      style={gStyle}
      role="button"
      tabIndex={0}
      aria-label={`${displayName} (${locT.name}) ${t.common.divingShopLocation}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick()
        }
      }}
    >
      {/* 펄스 애니메이션 원 (배경) */}
      <circle
        cx="0"
        cy="0"
        r="20"
        fill={colors.start}
        opacity="0.3"
        className="animate-ping"
        style={{
          animationDuration: '2s',
          animationIterationCount: 'infinite',
        }}
      />

      {/* 발광 효과 */}
      <circle
        cx="0"
        cy="0"
        r={isHovered ? 35 : 25}
        fill={colors.start}
        opacity={isHovered ? 0.3 : 0.2}
        filter="blur(8px)"
        style={{
          transition: 'all 0.3s ease',
        }}
      />

      {/* 메인 마커 원 */}
      <circle
        cx="0"
        cy="0"
        r={isHovered ? 22 : 18}
        fill={`url(#marker-gradient-${location.id})`}
        stroke="#ffffff"
        strokeWidth={isHovered ? 3 : 2}
        filter={`url(#marker-shadow-${location.id})`}
        style={{
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      />

      {/* 아이콘 (이모지) */}
      <text
        x="0"
        y="0"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={isHovered ? '20' : '16'}
        style={{
          transition: 'font-size 0.3s ease',
          pointerEvents: 'none',
        }}
      >
        {icon}
      </text>

      {/* 위치 이름 (호버 시 표시) */}
      {isHovered && (
        <text
          x="0"
          y="35"
          textAnchor="middle"
          fill="#ffffff"
          fontSize="14"
          fontWeight="bold"
          style={{
            pointerEvents: 'none',
            textShadow: '0 2px 4px rgba(0,0,0,0.8)',
          }}
        >
          {displayName}
        </text>
      )}

      {/* 선택 표시 */}
      {isSelected && (
        <circle
          cx="0"
          cy="0"
          r="28"
          fill="none"
          stroke="#fbbf24"
          strokeWidth="2"
          strokeDasharray="4 2"
          opacity="0.8"
        >
          <animateTransform
            attributeName="transform"
            attributeType="XML"
            type="rotate"
            from="0 0 0"
            to="360 0 0"
            dur="3s"
            repeatCount="indefinite"
          />
        </circle>
      )}
    </g>
  )
}

export default React.memo(LocationMarker)
