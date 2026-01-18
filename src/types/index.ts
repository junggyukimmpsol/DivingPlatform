import { IconType } from 'react-icons'

// Review Types
export interface Review {
  id: string
  username: string
  rating: number
  text: string
}

// Location Types
export interface LocationFeature {
  icon: string
  text: string
}

export interface Location {
  id: string
  name: string
  nameEn: string
  description: string
  features: LocationFeature[]
  gradient: string
}

// Timeline Types
export interface TimelineItem {
  time: string
  activity: string
  icon: string
}

export interface Schedule {
  type: string
  timeline: TimelineItem[]
}

export interface DivingPoint {
  name: string
  description: string
}

export interface DivingPoints {
  cebu: DivingPoint[]
  bohol: DivingPoint[]
  bali: DivingPoint[]
}

// Event Types
export interface Event {
  icon: IconType
  title: string
  description: string
  highlight: string
  highlightText: string
  bgColor: string
}

// Price Types
export interface PriceRow {
  region: string
  product: string
  competitor: string
  parks: string
  discount: string
}

// WhyUs Types
export interface Feature {
  icon: string
  title: string
  highlight: string
  description: string
  subHighlight?: string
  subText?: string
}

export interface InclusiveItem {
  icon: string
  text: string
  badge?: string
}

// Navigation Types
export interface NavTab {
  id: string
  label: string
  icon: IconType
}

// Contact Types
export interface SocialLink {
  platform: 'instagram' | 'facebook' | 'email' | 'kakao'
  url: string
  label: string
}
