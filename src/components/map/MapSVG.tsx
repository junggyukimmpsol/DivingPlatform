import React from 'react'
import { MAP_CONFIG } from '../../data/diving-locations'

/**
 * 동남아시아 지도 SVG 배경
 * 필리핀 중심의 간소화된 지도 렌더링
 */
const MapSVG: React.FC = () => {
  const { viewBox } = MAP_CONFIG

  return (
    <svg
      viewBox={`0 0 ${viewBox.width} ${viewBox.height}`}
      className="absolute inset-0 w-full h-full"
      preserveAspectRatio="xMidYMid meet"
    >
      {/* 그라디언트 정의 */}
      <defs>
        {/* 바다 그라디언트 */}
        <linearGradient id="ocean-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#0a192f" stopOpacity="0.95" />
          <stop offset="50%" stopColor="#1e3a5f" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#0f2744" stopOpacity="0.95" />
        </linearGradient>

        {/* 섬 그라디언트 */}
        <linearGradient id="island-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#4a5568" />
          <stop offset="100%" stopColor="#2d3748" />
        </linearGradient>

        {/* 발광 효과 */}
        <radialGradient id="glow-gradient">
          <stop offset="0%" stopColor="#64ffda" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#64ffda" stopOpacity="0" />
        </radialGradient>

        {/* 물결 패턴 */}
        <pattern id="wave-pattern" x="0" y="0" width="100" height="20" patternUnits="userSpaceOnUse">
          <path
            d="M0,10 Q25,5 50,10 T100,10"
            fill="none"
            stroke="#64ffda"
            strokeWidth="0.5"
            opacity="0.1"
          />
        </pattern>
      </defs>

      {/* 바다 배경 */}
      <rect x="0" y="0" width={viewBox.width} height={viewBox.height} fill="url(#ocean-gradient)" />

      {/* 물결 패턴 오버레이 */}
      <rect x="0" y="0" width={viewBox.width} height={viewBox.height} fill="url(#wave-pattern)" />

      {/* 발광 효과 (장식) */}
      <g opacity="0.3" className="pointer-events-none">
        <circle cx="200" cy="150" r="100" fill="url(#glow-gradient)" />
        <circle cx="1000" cy="650" r="120" fill="url(#glow-gradient)" />
        <circle cx="800" cy="300" r="80" fill="url(#glow-gradient)" />
      </g>

      {/* 동남아시아 섬 그룹 (간소화된 형태) */}
      <g opacity="0.8">
        {/* 필리핀 (동쪽) */}
        <g id="philippines">
          <ellipse cx="820" cy="350" rx="50" ry="80" fill="url(#island-gradient)" stroke="#64ffda" strokeWidth="1" opacity="0.7" />
          <ellipse cx="860" cy="430" rx="30" ry="20" fill="url(#island-gradient)" stroke="#64ffda" strokeWidth="1" opacity="0.7" />
          <ellipse cx="800" cy="550" rx="60" ry="40" fill="url(#island-gradient)" stroke="#64ffda" strokeWidth="1" opacity="0.7" />
        </g>

        {/* 보르네오 (중앙 - 코타키나발루 위치) */}
        <g id="borneo">
          <path
            d="M 450,500 L 650,520 L 680,680 L 550,720 L 400,650 Z"
            fill="url(#island-gradient)"
            stroke="#64ffda"
            strokeWidth="1"
            opacity="0.7"
          />
        </g>

        {/* 자바 / 발리 (남쪽) */}
        <g id="indonesia-south">
          <rect x="200" y="740" width="400" height="30" rx="15" fill="url(#island-gradient)" stroke="#64ffda" strokeWidth="1" opacity="0.7" />
          <ellipse cx="520" cy="755" rx="20" ry="15" fill="url(#island-gradient)" stroke="#64ffda" strokeWidth="1" opacity="0.7" />
        </g>
      </g>

      {/* 그리드 라인 (선택적 - 좌표 확인용) */}
      {/* 개발 완료 후 제거 가능 */}
      {/* <g opacity="0.1" stroke="#64ffda" strokeWidth="0.5">
        {Array.from({ length: 12 }).map((_, i) => (
          <line key={`v-${i}`} x1={i * 100} y1="0" x2={i * 100} y2={viewBox.height} />
        ))}
        {Array.from({ length: 8 }).map((_, i) => (
          <line key={`h-${i}`} x1="0" y1={i * 100} x2={viewBox.width} y2={i * 100} />
        ))}
      </g> */}
    </svg>
  )
}

export default React.memo(MapSVG)
