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
  // 필리핀 - 세부 (Cebu)
  {
    id: 'cebu',
    name: 'Cebu',
    nameKo: '세부',
    coordinates: {
      lat: 10.3157,
      lng: 123.8854,
      x: 820, // SVG X 좌표 (동쪽)
      y: 380, // SVG Y 좌표
    },
    color: 'from-blue-500 to-blue-700',
    icon: '🏝️',
    description: 'PADI 5 Star 공식 리조트',
    path: '/philippines/cebu',
  },

  // 필리핀 - 보홀 (Bohol)
  {
    id: 'bohol',
    name: 'Bohol',
    nameKo: '보홀',
    coordinates: {
      lat: 9.8500,
      lng: 124.1435,
      x: 860, // SVG X 좌표
      y: 430, // SVG Y 좌표
    },
    color: 'from-purple-500 to-purple-700',
    icon: '🌊',
    description: '청정 다이빙 포인트',
    path: '/philippines/bohol',
  },

  // 말레이시아 - 코타키나발루 (Kota Kinabalu)
  {
    id: 'kota-kinabalu',
    name: 'Kota Kinabalu',
    nameKo: '코타키나발루',
    coordinates: {
      lat: 5.9804,
      lng: 116.0735,
      x: 550, // SVG X 좌표 (서남쪽)
      y: 580, // SVG Y 좌표
    },
    color: 'from-emerald-500 to-emerald-700',
    icon: '🐠',
    description: '선셋과 다이빙의 조화',
    path: '/malaysia/kota-kinabalu',
  },

  // 인도네시아 - 발리 (Bali)
  {
    id: 'bali',
    name: 'Bali',
    nameKo: '발리',
    coordinates: {
      lat: -8.3405,
      lng: 115.092,
      x: 520, // SVG X 좌표 (최남단)
      y: 750, // SVG Y 좌표
    },
    color: 'from-orange-500 to-orange-700',
    icon: '🐢',
    description: '4개의 지점 운영 중',
    path: '/indonesia/bali',
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
