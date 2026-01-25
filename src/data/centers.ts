/**
 * 다이빙 센터 데이터
 *
 * 4개 센터: 세부, 보홀, 코타키나발루, 발리
 */

import { Center, CenterId } from '../types/center.types'

export const CENTERS: Center[] = [
  {
    id: 'cebu',
    name: 'Cebu',
    nameKo: '세부',
    country: 'philippines',
    countryNameKo: '필리핀',
    countryIcon: '🇵🇭',
    icon: '🏝️',
    color: 'from-blue-500 to-blue-700',
    coordinates: {
      lat: 10.3157,
      lng: 123.8854,
      x: 640,
      y: 380,
    },
    description: 'PADI 5 Star 공식 리조트',
  },
  {
    id: 'bohol',
    name: 'Bohol',
    nameKo: '보홀',
    country: 'philippines',
    countryNameKo: '필리핀',
    countryIcon: '🇵🇭',
    icon: '🌊',
    color: 'from-purple-500 to-purple-700',
    coordinates: {
      lat: 9.8500,
      lng: 124.1435,
      x: 680,
      y: 430,
    },
    description: '청정 다이빙 포인트',
  },
  {
    id: 'kota-kinabalu',
    name: 'Kota Kinabalu',
    nameKo: '코타키나발루',
    country: 'malaysia',
    countryNameKo: '말레이시아',
    countryIcon: '🇲🇾',
    icon: '🐠',
    color: 'from-emerald-500 to-emerald-700',
    coordinates: {
      lat: 5.9804,
      lng: 116.0735,
      x: 400,
      y: 520,
    },
    description: '열대 해양 생태계',
  },
  {
    id: 'bali',
    name: 'Bali',
    nameKo: '발리',
    country: 'indonesia',
    countryNameKo: '인도네시아',
    countryIcon: '🇮🇩',
    icon: '🐢',
    color: 'from-orange-500 to-orange-700',
    coordinates: {
      lat: -8.4095,
      lng: 115.1889,
      x: 320,
      y: 620,
    },
    description: '4개 지점 운영',
  },
]

/**
 * ID로 센터 찾기
 */
export const getCenterById = (id: string): Center | undefined => {
  return CENTERS.find(center => center.id === id)
}

/**
 * 유효한 센터 ID인지 확인
 */
export const isValidCenterId = (id: string): id is CenterId => {
  return CENTERS.some(center => center.id === id)
}
