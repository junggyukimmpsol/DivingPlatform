/**
 * 다이빙 지점 데이터
 *
 * 이 파일을 수정하여 지도에 표시되는 위치를 변경할 수 있습니다.
 *
 * 수정 방법:
 * 1. coordinates.lat, lng: 실제 위도/경도 (Google Maps에서 확인 가능)
 * 2. coordinates.x, y: SVG 지도상의 위치 (0-1200, 0-800 범위)
 * 3. color: Tailwind gradient 클래스명
 * 4. detailsRef: LocationsSection의 locations 배열 인덱스 (0부터 시작)
 */

import { DivingLocation, MapConfig } from '../types/map.types'

// 지도 설정 (전체적인 뷰 조정)
export const MAP_CONFIG: MapConfig = {
  viewBox: {
    width: 1200,
    height: 800,
    centerX: 600,
    centerY: 400,
  },
  geoBounds: {
    north: 20, // 북위 20도
    south: 5,  // 북위 5도
    east: 125, // 동경 125도
    west: 115, // 동경 115도
  },
  perspective: {
    value: 1500, // perspective 값 (px)
    rotateX: 25, // X축 회전 (도)
    rotateZ: -2, // Z축 회전 (도)
  },
}

// 다이빙 지점 데이터
export const DIVING_LOCATIONS: DivingLocation[] = [
  // 세부 (Cebu)
  {
    id: 'cebu',
    name: 'Cebu',
    nameKo: '세부',
    coordinates: {
      lat: 10.3157,
      lng: 123.8854,
      x: 640, // SVG X 좌표
      y: 380, // SVG Y 좌표
    },
    color: 'from-blue-500 to-blue-700',
    icon: '🏝️',
    description: 'PADI 5 Star 공식 리조트',
    detailsRef: 0, // LocationsSection의 첫 번째 카드
  },

  // 보홀 (Bohol)
  {
    id: 'bohol',
    name: 'Bohol',
    nameKo: '보홀',
    coordinates: {
      lat: 9.8500,
      lng: 124.1435,
      x: 680, // SVG X 좌표
      y: 430, // SVG Y 좌표
    },
    color: 'from-purple-500 to-purple-700',
    icon: '🌊',
    description: '청정 다이빙 포인트',
    detailsRef: 1, // LocationsSection의 두 번째 카드
  },

  // 막탄 (Mactan)
  {
    id: 'mactan',
    name: 'Mactan',
    nameKo: '막탄',
    coordinates: {
      lat: 10.3117,
      lng: 123.9625,
      x: 660, // SVG X 좌표
      y: 385, // SVG Y 좌표
    },
    color: 'from-emerald-500 to-emerald-700',
    icon: '🐠',
    description: '접근성 좋은 다이빙',
    detailsRef: 2, // LocationsSection의 세 번째 카드
  },

  // 모알보알 (Moalboal)
  {
    id: 'moalboal',
    name: 'Moalboal',
    nameKo: '모알보알',
    coordinates: {
      lat: 9.9467,
      lng: 123.3947,
      x: 600, // SVG X 좌표
      y: 420, // SVG Y 좌표
    },
    color: 'from-orange-500 to-orange-700',
    icon: '🐢',
    description: '정어리 런 명소',
    detailsRef: 3, // LocationsSection의 네 번째 카드
  },
]

/**
 * 위치 ID로 지점 찾기
 */
export const getLocationById = (id: string): DivingLocation | undefined => {
  return DIVING_LOCATIONS.find(location => location.id === id)
}

/**
 * 인덱스로 지점 찾기
 */
export const getLocationByIndex = (index: number): DivingLocation | undefined => {
  return DIVING_LOCATIONS[index]
}
