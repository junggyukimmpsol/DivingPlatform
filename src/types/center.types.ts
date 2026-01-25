/**
 * 센터 데이터 타입 정의
 */

export type CenterId = 'cebu' | 'bohol' | 'kota-kinabalu' | 'bali'

export interface Center {
  id: CenterId
  name: string
  nameKo: string
  country: 'philippines' | 'malaysia' | 'indonesia'
  countryNameKo: string
  countryIcon: string
  icon: string
  color: string
  coordinates: {
    lat: number
    lng: number
    x: number  // SVG 좌표
    y: number  // SVG 좌표
  }
  description: string
}

export interface CenterOutletContext {
  center: Center
}
