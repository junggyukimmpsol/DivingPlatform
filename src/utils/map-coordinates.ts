/**
 * 지도 좌표 변환 유틸리티
 */

import { MapConfig } from '../types/map.types'

/**
 * Tailwind gradient 클래스를 실제 색상으로 변환
 */
export const COLOR_MAP: Record<string, { start: string; end: string }> = {
  'from-blue-500 to-blue-700': { start: '#3b82f6', end: '#1d4ed8' },
  'from-purple-500 to-purple-700': { start: '#a855f7', end: '#7e22ce' },
  'from-emerald-500 to-emerald-700': { start: '#10b981', end: '#047857' },
  'from-orange-500 to-orange-700': { start: '#f97316', end: '#c2410c' },
}

export const getGradientColors = (colorClass: string) => {
  return COLOR_MAP[colorClass] || COLOR_MAP['from-blue-500 to-blue-700']
}

/**
 * 위도/경도를 SVG 좌표로 변환
 * 나중에 실제 지도 데이터를 사용할 때 활용
 */
export const geoToSVG = (
  lat: number,
  lng: number,
  config: MapConfig
): { x: number; y: number } => {
  const { viewBox, geoBounds } = config

  // 경도를 X 좌표로 변환
  const x =
    ((lng - geoBounds.west) / (geoBounds.east - geoBounds.west)) *
    viewBox.width

  // 위도를 Y 좌표로 변환 (위도는 북쪽이 큰 값이므로 반전)
  const y =
    ((geoBounds.north - lat) / (geoBounds.north - geoBounds.south)) *
    viewBox.height

  return { x, y }
}

/**
 * SVG 좌표를 위도/경도로 변환
 */
export const svgToGeo = (
  x: number,
  y: number,
  config: MapConfig
): { lat: number; lng: number } => {
  const { viewBox, geoBounds } = config

  const lng = (x / viewBox.width) * (geoBounds.east - geoBounds.west) + geoBounds.west
  const lat = geoBounds.north - (y / viewBox.height) * (geoBounds.north - geoBounds.south)

  return { lat, lng }
}

/**
 * 두 지점 간의 거리 계산 (픽셀)
 */
export const calculateDistance = (
  x1: number,
  y1: number,
  x2: number,
  y2: number
): number => {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))
}

/**
 * 마커가 화면 영역 내에 있는지 확인
 */
export const isInViewport = (
  x: number,
  y: number,
  viewBox: { width: number; height: number }
): boolean => {
  return x >= 0 && x <= viewBox.width && y >= 0 && y <= viewBox.height
}
