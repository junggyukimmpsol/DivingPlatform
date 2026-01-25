/**
 * 다이빙 지도 관련 타입 정의
 */

export interface Coordinates {
  // 실제 위도/경도
  lat: number
  lng: number
  // SVG 좌표 (viewBox 기준)
  x: number
  y: number
}

export interface DivingLocation {
  id: string
  name: string
  nameKo: string
  coordinates: Coordinates
  color: string // Tailwind gradient class (e.g., 'from-blue-500 to-blue-700')
  icon: string // Emoji or icon
  description: string
  path: string // URL path for navigation
  detailsRef?: number // Optional for legacy support
}

export interface MapConfig {
  viewBox: {
    width: number
    height: number
    centerX: number
    centerY: number
  }
  // 동남아시아 지리적 범위
  geoBounds: {
    north: number
    south: number
    east: number
    west: number
  }
  // 3D 효과 설정
  perspective: {
    value: number // px
    rotateX: number // deg
    rotateZ: number // deg
  }
}
