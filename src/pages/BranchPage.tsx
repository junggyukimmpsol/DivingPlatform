import React, { useRef, useState, useEffect } from 'react'
import { Link, useLocation, useSearchParams } from 'react-router-dom'
import { DIVING_LOCATIONS } from '../data/diving-locations'
import { REVIEW_DATA } from '../data/reviewData'
import { CenterId } from '../types/center.types'
import { useLanguage } from '../contexts/LanguageContext'
import { useAuth } from '../contexts/AuthContext'
import {
  FaCamera,
  FaCar,
  FaCalendarAlt,
  FaCertificate,
  FaCheckCircle,
  FaChevronLeft,
  FaChevronRight,
  FaClock,
  FaCreditCard,
  FaMapMarkedAlt,
  FaMinus,
  FaPlus,
  FaShoppingCart,
  FaStar,
  FaSuitcase,
  FaTimes,
  FaTrash,
  FaUtensils,
  FaUsers,
} from 'react-icons/fa'
// Note: Tabs are now managed by the Navigation component in Tier 2

type TourProduct = {
  program: string
  balance: number
  priceKrw?: number
}

type BranchContentCard = {
  icon: React.ElementType
  title: string
  text: string
}

type BranchReviewMeta = {
  nickname: string
  visitedAt: string
  product: string
  groupType: string
  highlight: string
}

type BranchPresentation = {
  includedTitle: string
  includedDescription: string
  includedItems: string[]
  refundItems: { label: string; value: string }[]
  heroBadge: string
  heroTitle: string
  heroAccent: string
  heroDescription: string
  heroNote: string
  featureCards: BranchContentCard[]
  scheduleTitle: string
  scheduleNote: string
  scheduleItems: { time: string; label: string }[]
  scheduleFootnote?: string
  pointMap?: {
    title: string
    note: string
    src: string
    alt: string
  }
  topPointsTitle: string
  topPoints: { name: string; text: string }[]
  photoBenefitText: string
  mixedDivingText: string
  priceNote: string
  productCopy: {
    discovery: string
    fun: string
    snorkeling?: string
  }
  mealNotice?: {
    title: string
    description: string
    items: { label: string; detail: string }[]
  }
  pickupNotice?: {
    title: string
    description: string
    items: { label: string; detail: string }[]
  }
  reviewTitle: string
  reviewSubtitle: string
  reviewHighlights: { label: string; value: string }[]
  reviewMeta: BranchReviewMeta[]
}

type CartItem = {
  id: string
  locationId: string
  locationName: string
  program: string
  tourDate: string
  guests: number
  unitPriceKrw: number
}

type CheckoutCustomer = {
  name: string
  email: string
  phone: string
  certificationAgency: string
  certificationLevel: string
  heightCm: string
  weightKg: string
  footSizeMm: string
  preferredSuitSize: string
  memo: string
}

type PortOnePaymentResponse = {
  code?: string
  error_msg?: string
  imp_uid?: string
  message?: string
  merchant_uid?: string
  paymentId?: string
  success?: boolean
}

type PortOnePaymentRequest = {
  channelKey: string
  pay_method: 'card'
  merchant_uid: string
  name: string
  amount: number
  buyer_email?: string
  buyer_name?: string
  buyer_tel?: string
  m_redirect_url?: string
}

type PaymentPrepareResponse = {
  channelKey?: string
  customerCode?: string
  customer?: {
    email?: string
    fullName?: string
    phoneNumber?: string
  }
  error?: string
  orderName?: string
  paymentId?: string
  provider?: string
  storeId?: string
  totalAmount?: number
}

declare global {
  interface Window {
    IMP?: {
      init: (customerCode: string) => void
      request_pay: (request: PortOnePaymentRequest, callback: (response: PortOnePaymentResponse) => void) => void
    }
  }
}

const KRW_PER_USD = 1550
const KAKAO_CHAT_URL = 'http://pf.kakao.com/_xhhbxcn/chat'

const usdToKrw = (usd: number) => Math.round(usd * KRW_PER_USD)

const formatKrw = (amount: number) => `${Math.round(amount).toLocaleString('ko-KR')}원`

const getProductPriceKrw = (product: TourProduct) => product.priceKrw ?? usdToKrw(product.balance)

const isDiscoveryProduct = (program: string) => /체험|Discovery|体验/.test(program)

const isSnorkelingProduct = (program: string) => /스노|Snorkeling|浮潜/.test(program)

const isBoholFullMealProduct = (program: string) =>
  /발리카삭|파밀라칸|Balicasag|Pamilacan|巴里卡萨|帕米拉坎|스노|Snorkeling|浮潜/.test(program)

const getProductMealNote = (branchId: CenterId, program: string) => {
  if (branchId !== 'bohol') return null

  return isBoholFullMealProduct(program)
    ? '식사 포함: 선상 바베큐 + 밥 제공'
    : '간식 포함: 열대과일 제공'
}

const BRANCH_PRESENTATION: Record<CenterId, BranchPresentation> = {
  cebu: {
    includedTitle: '세부 투어 포함사항',
    includedDescription: '아래 항목은 투어 필수 구성에 포함되어 있어 현장에서 별도 추가금 걱정 없이 예약할 수 있습니다. 투어 당일 캐리어도 무료로 보관해드립니다.',
    includedItems: ['장비 렌탈', '막탄 픽드랍', '캐리어 무료 보관', '점심 한식', '환경세·입장료', '수중 사진/영상', '보트 다이빙'],
    refundItems: [
      { label: '7일 전', value: '100% 환불' },
      { label: '5일 전', value: '50% 환불' },
      { label: '3일 전', value: '0% 환불' },
    ],
    heroBadge: '세부 막탄 올 인클루시브 투어',
    heroTitle: '결제한 금액 그대로,',
    heroAccent: '필수 추가금 ZERO.',
    heroDescription: '세부 1호점은 막탄 주요 다이빙 포인트를 중심으로 체험다이빙, 펀다이빙, 스노클링, 해양 스포츠를 운영합니다. 처음 바다에 들어가는 분도 한국어 안내와 현지 가이드 케어를 통해 교육부터 입수까지 천천히 적응할 수 있게 진행합니다.',
    heroNote: '장비 렌탈, 막탄 내 픽드랍, 보트 다이빙, 점심 한식, 환경세, 입장료, 수중 사진/영상 촬영과 캐리어 무료 보관까지 투어 필수 항목에 포함됩니다.',
    featureCards: [
      { icon: FaCheckCircle, title: '투어 필수 항목 추가금 ZERO', text: '장비 렌탈, 막탄 내 픽드랍, 다이빙, 점심 한식, 환경세, 입장료, 수중 사진/영상 촬영 포함' },
      { icon: FaClock, title: '1회 다이빙 35분 이상', text: '짧게 사진만 찍는 체험이 아니라 교육과 수중 적응 시간을 포함해 여유 있게 진행' },
      { icon: FaUsers, title: '2,000회 이상 진행 가이드', text: '현지 바다 상황과 포인트를 잘 아는 가이드가 당일 컨디션에 맞춰 안전하게 안내' },
      { icon: FaCertificate, title: 'PADI · SSI 공식 샵 구성', text: '공식 등록된 다이빙샵과 강사, 가이드 기준으로 초보자도 믿고 맡길 수 있게 구성' },
      { icon: FaSuitcase, title: '캐리어 무료 보관', text: '체크아웃 후 바로 투어에 참여하는 고객도 캐리어를 맡기고 편하게 다이빙 가능' },
    ],
    scheduleTitle: '세부 다이빙 투어 일정',
    scheduleNote: '상품과 당일 해양 상황에 따라 시간은 조정될 수 있습니다.',
    scheduleItems: [
      { time: '08:00', label: '막탄 호텔 픽업' },
      { time: '09:00', label: '다이빙 교육' },
      { time: '10:00', label: '1번째 보트 다이빙' },
      { time: '11:00', label: '2번째 보트 다이빙' },
      { time: '12:00', label: '점심 식사' },
      { time: '14:30', label: '3회 상품 종료/드랍' },
    ],
    pointMap: {
      title: '세부 다이빙 포인트 지도',
      note: '당일 기상과 해양 상황에 따라 다이빙샵에서 포인트를 지정합니다.',
      src: '/assets/cebu/cebu-dive-point-map.png',
      alt: '세부 막탄과 올랑고 섬 다이빙 포인트 지도',
    },
    topPointsTitle: '세부 포인트 Top 3',
    topPoints: [
      { name: '콘티키', text: '정어리떼를 자주 볼 수 있는 인기 포인트' },
      { name: '올랑고 섬', text: '산호와 열대어가 많은 해양국립공원' },
      { name: '마리곤돈 동굴', text: '해저 동굴을 경험할 수 있는 대표 포인트' },
    ],
    photoBenefitText: '투어 중 최신 고프로로 사진 약 50장과 영상 약 5개를 공유해드립니다. 사진 리뷰 이벤트 참여 시 추가 혜택도 받을 수 있습니다.',
    mixedDivingText: '자격증 보유자는 펀다이빙, 미보유자는 체험다이빙으로 같은 일정과 같은 보트 안에서 각자 수준에 맞게 즐길 수 있습니다.',
    priceNote: '세부 상품은 원화 고정 결제 금액이며, 막탄 내 픽드랍과 캐리어 무료 보관이 가능합니다.',
    productCopy: {
      discovery: '처음 다이빙하는 고객도 교육부터 입수까지 천천히 진행하는 기본 추천 상품입니다.',
      fun: '자격증 보유 다이버가 막탄 포인트를 여유 있게 즐기기 좋은 상품입니다.',
    },
    reviewTitle: '세부 실제 이용 고객 후기',
    reviewSubtitle: '닉네임은 마스킹하고, 고객이 남긴 원문 말투는 최대한 유지했습니다.',
    reviewHighlights: [
      { label: '처음 다이빙', value: '초보자 안심' },
      { label: '사진/영상', value: '충분히 촬영' },
      { label: '동행 유형', value: '커플·친구·혼자' },
      { label: '재방문', value: '다음에도 예약' },
    ],
    reviewMeta: [
      { nickname: 'tnsd****', visitedAt: '2026.07 방문', product: '보트 체험다이빙 2회', groupType: '부부 여행', highlight: '처음이라 걱정했는데 1:1로 호흡과 이퀄라이징을 봐줘서 안심됐어요.' },
      { nickname: '23살 한국인', visitedAt: '2026.07 방문', product: '보트 펀다이빙 3회', groupType: '친구 여행', highlight: '사진도 많이 찍어주고 전날 컨디션까지 챙겨줘서 진짜 고마웠어요.' },
      { nickname: 'mactan****', visitedAt: '2026.06 방문', product: '보트 펀다이빙 2회', groupType: '펀다이버', highlight: '막탄은 초보자와 복귀 다이버가 부담 없이 즐기기 좋은 포인트였어요.' },
      { nickname: 'girwns****', visitedAt: '2026.06 방문', product: '보트 펀다이빙 2회', groupType: '복귀 다이버', highlight: '몇 년 만의 다이빙이었는데 물살도 괜찮고 다음에도 다시 예약하고 싶어요.' },
      { nickname: 'solo****', visitedAt: '2026.05 방문', product: '보트 체험다이빙 2회', groupType: '혼자 여행', highlight: '여자 혼자라 걱정했는데 설명도 좋고 점심도 맛있어서 즐겁게 다녀왔어요.' },
    ],
  },
  bohol: {
    includedTitle: '보홀 투어 포함사항',
    includedDescription: '보홀은 픽드랍을 제공하지 않지만 알로나비치 메인에 위치해 직접 방문이 쉽습니다. 포인트별 포함사항과 식사 제공 기준도 예약 전 한 번에 확인할 수 있습니다.',
    includedItems: ['장비 렌탈', '알로나비치 메인 위치', '캐리어 무료 보관', '포인트 예약', '환경세·입장료', '수중 사진/영상', '상품별 식사·과일'],
    refundItems: [
      { label: '7일 전', value: '100% 환불' },
      { label: '5일 전', value: '50% 환불' },
      { label: '3일 전', value: '0% 환불' },
    ],
    heroBadge: '보홀 알로나비치 메인 위치',
    heroTitle: '거북이, 산호 절벽, 섬 투어까지',
    heroAccent: '보홀 바다를 제대로 즐깁니다.',
    heroDescription: '보홀 지점은 알로나비치 메인에 위치해 픽드랍 없이도 접근성이 좋습니다. 알로나 비치 산호 절벽 포인트부터 나팔링, 발리카삭, 파밀라칸까지 원하는 포인트와 일정에 맞춰 체험다이빙과 펀다이빙을 선택할 수 있습니다.',
    heroNote: '보홀은 픽드랍을 제공하지 않지만 샵 위치가 좋아 직접 방문이 쉽고, 투어 당일 캐리어 무료 보관이 가능합니다. 발리카삭·파밀라칸처럼 인기 있는 포인트는 사전 예약 기준으로 안정적으로 준비합니다.',
    featureCards: [
      { icon: FaCheckCircle, title: '포인트별 포함사항 한눈에 확인', text: '알로나, 나팔링, 발리카삭, 파밀라칸 상품별 포함사항과 준비 항목을 예약 전에 안내' },
      { icon: FaMapMarkedAlt, title: '알로나비치 메인 위치', text: '보홀은 픽드랍 미제공 지점이지만 샵이 알로나비치 메인에 있어 직접 방문이 편리' },
      { icon: FaSuitcase, title: '캐리어 무료 보관', text: '체크아웃 후 투어에 참여하거나 투어 후 이동 일정이 있어도 캐리어를 무료로 보관 가능' },
      { icon: FaClock, title: '1회 다이빙 40분 내외', text: '펀다이빙은 여유 있는 수중 시간을 기준으로, 체험다이빙은 교육 후 안전하게 진행' },
      { icon: FaMapMarkedAlt, title: '원하는 포인트 선택 가능', text: '거북이, 산호 절벽, 물고기떼 등 여행 목적에 맞춰 포인트를 선택' },
      { icon: FaCertificate, title: 'PADI · SSI 공식 샵 구성', text: '공식 등록된 샵과 가이드 기준으로 장비 점검과 안전 브리핑을 진행' },
    ],
    scheduleTitle: '보홀 다이빙 투어 일정',
    scheduleNote: '발리카삭/파밀라칸 다이빙은 최소 1달 전 예약을 권장합니다.',
    scheduleItems: [
      { time: '09:00', label: '알로나비치 메인 샵 도착' },
      { time: '09:00', label: '다이빙 교육' },
      { time: '10:00', label: '1번째 보트 다이빙' },
      { time: '11:00', label: '2번째 보트 다이빙' },
      { time: '12:00', label: '점심 식사' },
      { time: '14:30', label: '3회 상품 종료' },
    ],
    scheduleFootnote: '선상 바베큐 + 밥은 발리카삭/파밀라칸 펀다이빙과 스노쿨링 호핑투어에 제공되며, 그 외 보홀 상품은 열대과일을 제공합니다.',
    pointMap: {
      title: '보홀 다이빙 포인트 지도',
      note: '원하는 포인트로 선택 예약이 가능하며, 당일 해양 상황에 따라 조정될 수 있습니다.',
      src: '/assets/bohol/bohol-dive-point-map.png',
      alt: '보홀 발리카삭, 팡라오, 파밀라칸 다이빙 포인트 지도',
    },
    topPointsTitle: '보홀 포인트 Top 3',
    topPoints: [
      { name: '파밀라칸', text: '수만 마리 물고기떼와 거북이를 만날 수 있는 인기 포인트' },
      { name: '발리카삭', text: '하루 100명 제한이 있는 보홀 대표 섬 다이빙' },
      { name: '알로나 비치 리프', text: '알로나 해변에 길게 펼쳐진 산호 절벽 포인트' },
    ],
    photoBenefitText: '투어 중 최신 고프로로 사진 약 50장과 영상 약 5개를 무료로 공유해드립니다. 사진 리뷰 이벤트 참여 시 네이버 포인트 혜택도 받을 수 있습니다.',
    mixedDivingText: '자격증 보유자는 펀다이빙, 미보유자는 체험다이빙으로 같은 일정 안에서 연인/친구/가족이 함께 즐길 수 있습니다.',
    priceNote: '보홀 상품은 달러 환산 없이 원화 고정 결제 금액으로 표시됩니다. 픽드랍은 제공하지 않으며, 알로나비치 메인 샵에서 캐리어 무료 보관이 가능합니다.',
    productCopy: {
      discovery: '보홀 바다가 처음인 고객도 교육부터 입수까지 차분하게 진행하는 체험 추천 상품입니다.',
      fun: '거북이와 산호 포인트를 여유 있게 보고 싶은 자격증 보유 다이버에게 추천합니다.',
      snorkeling: '다이빙을 하지 않아도 보홀 바다와 섬 분위기를 함께 즐길 수 있는 호핑투어입니다.',
    },
    mealNotice: {
      title: '보홀 식사/간식 제공 기준',
      description: '보홀은 포인트별 이동 동선이 달라 상품에 따라 제공 방식이 다릅니다. 예약 전 아래 기준으로 확인해주세요.',
      items: [
        { label: '선상 바베큐 + 밥 제공', detail: '파밀라칸 펀다이빙, 발리카삭 펀다이빙, 스노쿨링 호핑투어' },
        { label: '열대과일 제공', detail: '알로나 체험다이빙, 나팔링 체험다이빙, 알로나 펀다이빙, 나팔링 펀다이빙' },
      ],
    },
    reviewTitle: '보홀 실제 이용 고객 후기',
    reviewSubtitle: '거북이, 발리카삭, 가족 체험 후기를 중심으로 실제 이용감을 살렸습니다.',
    reviewHighlights: [
      { label: '대표 포인트', value: '발리카삭·알로나' },
      { label: '고객 유형', value: '가족·커플' },
      { label: '수중 경험', value: '거북이·산호' },
      { label: '예약 포인트', value: '카드·원화 결제' },
    ],
    reviewMeta: [
      { nickname: 'bohol****', visitedAt: '2026.07 방문', product: '알로나 비치 펀다이빙 2회', groupType: '복귀 다이버', highlight: '3년 만의 펀다이빙이었는데 마스터가 잘 리드해줘서 편하게 들어갔어요.' },
      { nickname: 'victor****', visitedAt: '2026.07 방문', product: '알로나 비치 체험다이빙 2회', groupType: '커플 여행', highlight: '스노클링으로는 볼 수 없는 산호와 물고기를 가까이 볼 수 있어서 만족도가 높았어요.' },
      { nickname: 'family****', visitedAt: '2026.06 방문', product: '보트 체험다이빙 2회', groupType: '가족 여행', highlight: '수영을 못해도 쉬운 설명과 바디랭귀지로 따라갈 수 있어서 좋았어요.' },
      { nickname: 'license****', visitedAt: '2026.06 방문', product: '자격증 상담', groupType: '가족 여행', highlight: '체험 후 자격증까지 이어질 만큼 아이가 재미있어 했어요.' },
    ],
  },
  'kota-kinabalu': {
    includedTitle: '코타키나발루 투어 포함사항',
    includedDescription: '해상국립공원 이동, 다이빙, 점심까지 하루 일정에 필요한 항목을 한 번에 확인할 수 있습니다.',
    includedItems: ['장비 렌탈', '섬 이동 보트', '해상국립공원', '다이빙 교육', '점심 메뉴', '수중 사진/영상'],
    refundItems: [
      { label: '7일 전', value: '100% 환불' },
      { label: '5일 전', value: '50% 환불' },
      { label: '3일 전', value: '0% 환불' },
    ],
    heroBadge: '코타키나발루 해상국립공원 투어',
    heroTitle: '도심과 가까운 섬에서',
    heroAccent: '부담 없이 시작하는 다이빙.',
    heroDescription: '코타키나발루 지점은 툰쿠 압둘 라만 해상국립공원 주변 포인트를 중심으로 운영합니다. 여행 일정 안에 넣기 쉬운 동선과 초보자도 따라가기 쉬운 교육 흐름이 장점입니다.',
    heroNote: '오전 중 2회 다이빙을 먼저 진행하고 점심 식사 후 펀다이빙 3회 상품은 오후 3번째 다이빙까지 이어집니다. 체험다이빙 2회와 펀다이빙 3회 모두 18만원 원화 고정가입니다.',
    featureCards: [
      { icon: FaCheckCircle, title: '하루 일정으로 편하게 진행', text: '도심에서 가까운 섬 포인트를 중심으로 이동 부담을 줄인 투어 구성' },
      { icon: FaClock, title: '오전 2회 + 오후 3회차', text: '오전 중 2회 다이빙 후 점심 식사, 펀다이빙 3회 상품은 오후 3번째 다이빙 진행' },
      { icon: FaUsers, title: '가족·커플 체험에 적합', text: '수영을 못하거나 깊은 물이 걱정되는 고객도 단계별로 케어' },
      { icon: FaCertificate, title: 'PADI · SSI 공식 샵 구성', text: '공식 등록된 샵과 가이드를 기준으로 안전 브리핑과 장비 점검을 진행' },
    ],
    scheduleTitle: '코타키나발루 다이빙 투어 일정',
    scheduleNote: '섬 이동 시간과 당일 바다 상황에 따라 순서는 조정될 수 있습니다.',
    scheduleItems: [
      { time: '08:30', label: '선착장 미팅' },
      { time: '09:00', label: '섬 이동' },
      { time: '10:00', label: '1번째 다이빙' },
      { time: '11:00', label: '2번째 다이빙' },
      { time: '12:30', label: '점심 식사' },
      { time: '14:00', label: '3번째 다이빙/복귀' },
    ],
    scheduleFootnote: '펀다이빙 3회 상품은 점심 식사 후 3번째 다이빙을 진행합니다. 체험다이빙 2회 상품은 오전 2회 다이빙 후 점심 식사와 섬 휴식 일정으로 진행됩니다.',
    topPointsTitle: '코타키나발루 포인트 Top 3',
    topPoints: [
      { name: '사피섬', text: '초보자 체험 다이빙과 스노클링을 함께 즐기기 좋은 포인트' },
      { name: '가야섬', text: '점심과 휴식 동선을 함께 잡기 좋은 대표 섬 포인트' },
      { name: '툰쿠 압둘 라만 해상국립공원', text: '도심과 가까워 짧은 여행 일정에도 넣기 좋은 해양공원' },
    ],
    photoBenefitText: '수중 적응 장면부터 열대어 포인트까지 여행 기록으로 남기기 좋은 사진과 영상을 챙겨드립니다.',
    mixedDivingText: '자격증 보유자는 펀다이빙, 미보유자는 체험다이빙으로 같은 일정 안에서 가족/친구가 함께 참여할 수 있습니다.',
    priceNote: '코타키나발루 상품은 달러 환산 없이 원화 고정 결제 금액으로 표시됩니다. 체험다이빙 2회와 펀다이빙 3회 모두 1인 18만원입니다.',
    productCopy: {
      discovery: '가족, 커플, 첫 다이빙 고객이 오전 2회 체험다이빙과 점심 식사를 함께 즐기기 좋은 기본 추천 상품입니다.',
      fun: '오전 2회 다이빙 후 점심을 먹고 오후 3번째 다이빙까지 이어지는 해상국립공원 펀다이빙 상품입니다.',
    },
    reviewTitle: '코타키나발루 실제 이용 고객 후기',
    reviewSubtitle: '가족 체험, 첫 다이빙, 섬 투어 만족 후기를 보기 쉽게 정리했습니다.',
    reviewHighlights: [
      { label: '주요 고객', value: '가족·커플' },
      { label: '초보자 케어', value: '얕은 곳 연습' },
      { label: '일정 장점', value: '섬 투어 동선' },
      { label: '만족 포인트', value: '친절한 가이드' },
    ],
    reviewMeta: [
      { nickname: 'lily****', visitedAt: '2026.07 방문', product: '아일랜드 보트 체험다이빙 2회', groupType: '가족 여행', highlight: '아이들이 가이드님을 계속 칭찬할 정도로 친절하게 케어해줬어요.' },
      { nickname: 'sapi****', visitedAt: '2026.07 방문', product: '체험다이빙 2회', groupType: '부부 여행', highlight: '수영을 못해도 얕은 곳에서 연습하고 들어가서 여행 중 가장 만족한 체험이 됐어요.' },
      { nickname: 'nemo****', visitedAt: '2026.06 방문', product: '아일랜드 보트 체험다이빙 2회', groupType: '친구 여행', highlight: '언어가 걱정됐지만 알아듣기 쉽게 설명해줘서 수월하게 진행했어요.' },
      { nickname: 'jeff****', visitedAt: '2026.06 방문', product: '체험다이빙 2회', groupType: '모녀 여행', highlight: '엄마와 처음 다이빙했는데 니모도 보고 제일 기억에 남는 하루였어요.' },
    ],
  },
  'nha-trang': {
    includedTitle: '나트랑 투어 포함사항',
    includedDescription: '나트랑 시내 무료 픽드랍, 장비렌탈, 당일 배정 허가 포인트 2회 보트 다이빙, 선상 점심, 수중 사진/영상 촬영까지 하루 투어에 필요한 항목을 한 번에 포함합니다.',
    includedItems: ['시내 무료 픽드랍', '장비 렌탈', '2회 보트 다이빙', '선상 점심', '수중 사진/영상', '외곽 픽드랍 가능'],
    refundItems: [
      { label: '7일 전', value: '100% 환불' },
      { label: '5일 전', value: '50% 환불' },
      { label: '3일 전', value: '0% 환불' },
    ],
    heroBadge: '베트남 나트랑 보트 다이빙',
    heroTitle: '시내 픽업부터 보트 다이빙까지,',
    heroAccent: '나트랑 바다를 편하게 즐깁니다.',
    heroDescription: '나트랑 지점은 오전 7:00~7:30 호텔 픽업 후 항구로 이동하고, 보트로 약 1시간 이동합니다. 다이빙 포인트는 당일 바다 상황에 따라 Dam Bay(Tre Island) 또는 Madonna Rock(Rom Island) 중 한 곳으로 배정됩니다.',
    heroNote: '나트랑 시내 픽드랍, 장비렌탈, 2회 보트 다이빙, 선상 점심, 수중 사진/영상 촬영까지 포함되어 처음 예약하는 고객도 추가 준비 없이 참여할 수 있습니다.',
    featureCards: [
      { icon: FaCar, title: '오전 7:00~7:30 픽업', text: '나트랑 시내는 무료 픽업, 외곽 지역은 그룹별 왕복 추가요금으로 진행' },
      { icon: FaMapMarkedAlt, title: '허가 포인트 중 1곳 배정', text: 'Dam Bay 또는 Madonna Rock 중 당일 해양 상황에 맞는 포인트에서 2회 다이빙' },
      { icon: FaCheckCircle, title: '핵심 포함사항 한 번에', text: '픽드랍, 장비렌탈, 보트 다이빙, 선상 점심, 수중 사진/영상 촬영 포함' },
      { icon: FaUsers, title: '다이버와 비다이버 동행 가능', text: '펀다이빙, 체험다이빙, 스노쿨링 호핑투어를 같은 일정 안에서 선택 가능' },
    ],
    scheduleTitle: '나트랑 다이빙 투어 일정',
    scheduleNote: '기본 픽업은 오전 7:00~7:30이며, 지역별 픽드랍 추가요금은 그룹당 왕복 기준입니다.',
    scheduleItems: [
      { time: '07:00~07:30', label: '호텔 픽업' },
      { time: '08:00', label: '항구 도착 후 보트 탑승' },
      { time: '09:00', label: '배정 포인트 1번째 다이빙' },
      { time: '09:40', label: '수면 휴식 및 포인트 이동' },
      { time: '11:00', label: '배정 포인트 2번째 다이빙' },
      { time: '12:00', label: '2번째 다이빙 후 선상 점심' },
      { time: '14:00', label: '항구 복귀 후 호텔 드랍' },
    ],
    scheduleFootnote: '나트랑 스쿠버다이빙은 Dam Bay(Tre Island) 또는 Madonna Rock(Rom Island) 중 당일 해양 상황에 맞는 한 포인트에서 2회 진행됩니다. 나트랑 시내는 무료 픽드랍이며, 깜란 공항 근처 35,000원, 다이아몬드 베이 30,000원, 아미아나 리조트 20,000원이 그룹당 왕복 기준으로 추가됩니다.',
    topPointsTitle: '나트랑 허가 다이빙 포인트',
    topPoints: [
      { name: 'Dam Bay (Tre Island)', text: '나트랑에서 스쿠버 허가 운영되는 대표 보트 다이빙 포인트' },
      { name: 'Madonna Rock (Rom Island)', text: '당일 해양 상황에 따라 배정될 수 있는 허가 스쿠버 포인트' },
      { name: '운영 포인트 안내', text: '하루에 두 곳을 모두 방문하는 방식이 아니라, 둘 중 한 포인트에서 2회 다이빙을 진행합니다' },
    ],
    photoBenefitText: '투어 중 수중 사진과 영상을 촬영해 나트랑 바다에서의 장면을 여행 기록으로 남길 수 있게 도와드립니다.',
    mixedDivingText: '자격증 보유자는 펀다이빙, 처음인 고객은 체험다이빙, 다이빙을 원하지 않는 동행자는 스노쿨링 호핑투어로 같은 일정 안에서 함께 참여할 수 있습니다.',
    priceNote: '나트랑 상품은 원화 고정 결제 금액입니다. 나트랑 시내 픽드랍은 무료이며 외곽 지역은 그룹당 왕복 추가요금이 발생합니다.',
    productCopy: {
      discovery: '처음 다이빙하는 고객도 교육 후 당일 배정된 나트랑 허가 포인트에서 보트 다이빙 2회를 경험할 수 있는 추천 상품입니다.',
      fun: '자격증 보유 다이버가 Dam Bay 또는 Madonna Rock 중 당일 배정 포인트에서 2회 보트 다이빙을 즐기는 상품입니다.',
      snorkeling: '다이빙을 하지 않아도 보트 이동, 선상 점심, 바다 시간을 함께 즐길 수 있는 호핑투어입니다.',
    },
    mealNotice: {
      title: '나트랑 선상 점심 안내',
      description: '2번째 다이빙이 끝난 뒤 보트 위에서 점심을 제공합니다.',
      items: [
        { label: '제공 메뉴', detail: '밥, 치킨, 돼지고기, 달걀, 누들, 당근 수프' },
        { label: '제공 시점', detail: '2번째 다이빙 종료 후 선상 점심 제공' },
      ],
    },
    pickupNotice: {
      title: '나트랑 픽드랍 안내',
      description: '오전 7:00~7:30 호텔 픽업 기준입니다. 나트랑 시내는 무료이며, 외곽 지역은 그룹당 왕복 추가요금이 발생합니다.',
      items: [
        { label: '나트랑 시내', detail: '무료 픽드랍' },
        { label: '깜란 공항 근처', detail: '그룹당 왕복 35,000원' },
        { label: '다이아몬드 베이 지역', detail: '그룹당 왕복 30,000원' },
        { label: '아미아나 리조트 지역', detail: '그룹당 왕복 20,000원' },
      ],
    },
    reviewTitle: '나트랑 실제 이용 고객 후기',
    reviewSubtitle: '나트랑 지점 후기는 준비 중입니다.',
    reviewHighlights: [
      { label: '기본 픽업', value: '7:00~7:30' },
      { label: '대표 포인트', value: '둘 중 1곳' },
      { label: '동행 선택', value: '스노쿨링 가능' },
      { label: '포함사항', value: '선상 점심·촬영' },
    ],
    reviewMeta: [],
  },
  bali: {
    includedTitle: '발리 투어 포함사항',
    includedDescription: '포인트별 이동과 장비, 식사 포함 여부를 예약 전에 확인해 발리 다이빙을 깔끔하게 준비할 수 있습니다.',
    includedItems: ['장비 렌탈', '포인트 이동', '보트/차량 동선', '다이빙 교육', '점심 제공 상품', '수중 사진/영상'],
    refundItems: [
      { label: '7일 전', value: '100% 환불' },
      { label: '5일 전', value: '50% 환불' },
      { label: '3일 전', value: '0% 환불' },
    ],
    heroBadge: '발리 누사페니다·뚤람벤 투어',
    heroTitle: '만타가오리부터 난파선까지',
    heroAccent: '발리 대표 포인트를 한 번에.',
    heroDescription: '발리 지점은 누사페니다, 누사두아, 뚤람벤 등 목적이 분명한 포인트를 중심으로 운영합니다. 만타가오리, 산호, 난파선처럼 보고 싶은 장면에 맞춰 상품을 고를 수 있습니다.',
    heroNote: '지역별 이동 시간이 긴 편이라 예약 전 포인트와 일정 동선을 확인하고, 체험다이빙과 펀다이빙 모두 안전 브리핑 후 진행합니다.',
    featureCards: [
      { icon: FaCheckCircle, title: '포인트별 목적이 명확한 상품', text: '만타가오리, 난파선, 산호 포인트 등 원하는 장면에 맞춰 상품 선택' },
      { icon: FaClock, title: '긴 이동도 고려한 일정 안내', text: '누사페니다와 뚤람벤 등 지역별 이동 시간을 예약 전에 미리 안내' },
      { icon: FaMapMarkedAlt, title: '발리 대표 포인트 운영', text: '누사페니다, 누사두아, 뚤람벤 등 발리 핵심 다이빙 지역 구성' },
      { icon: FaCertificate, title: 'PADI · SSI 공식 샵 구성', text: '공식 등록된 샵과 가이드 기준으로 안전하게 투어를 진행' },
    ],
    scheduleTitle: '발리 다이빙 투어 일정',
    scheduleNote: '포인트별 이동 시간이 달라 예약 후 확정 일정으로 안내됩니다.',
    scheduleItems: [
      { time: '07:00', label: '숙소/미팅 픽업' },
      { time: '08:30', label: '포인트 이동' },
      { time: '10:00', label: '다이빙 교육/브리핑' },
      { time: '11:00', label: '1번째 다이빙' },
      { time: '12:30', label: '점심 및 휴식' },
      { time: '14:00', label: '2~3번째 다이빙' },
    ],
    scheduleFootnote: '누사페니다, 누사두아, 뚤람벤은 이동 동선과 출발 시간이 서로 다를 수 있습니다.',
    topPointsTitle: '발리 포인트 Top 3',
    topPoints: [
      { name: '누사페니다', text: '만타가오리를 기대할 수 있는 발리 대표 펀다이빙 포인트' },
      { name: '뚤람벤', text: '난파선과 잔잔한 포인트로 체험과 펀다이빙 모두 인기' },
      { name: '누사두아', text: '초보자 체험다이빙과 짧은 일정에 넣기 좋은 포인트' },
    ],
    photoBenefitText: '만타가오리, 산호, 난파선 등 포인트별 장면을 여행 기록으로 남길 수 있도록 사진과 영상을 챙겨드립니다.',
    mixedDivingText: '자격증 보유자는 펀다이빙, 미보유자는 체험다이빙으로 같은 여행 일정 안에서 각자 수준에 맞게 즐길 수 있습니다.',
    priceNote: '1 USD = 1,550원 기준으로 환산한 원화 결제 금액입니다.',
    productCopy: {
      discovery: '발리에서 체험다이빙을 시작하고 싶은 고객이 포인트별 특징에 맞춰 선택하기 좋은 상품입니다.',
      fun: '만타가오리, 난파선, 산호 등 목적이 분명한 포인트를 찾는 자격증 보유 다이버에게 추천합니다.',
    },
    reviewTitle: '발리 실제 이용 고객 후기',
    reviewSubtitle: '누사페니다 만타, 뚤람벤, 합리적인 가격 후기를 보기 쉽게 정리했습니다.',
    reviewHighlights: [
      { label: '대표 장면', value: '만타가오리' },
      { label: '포인트', value: '누사페니다·뚤람벤' },
      { label: '일정 만족', value: '식사·간식 제공' },
      { label: '가격', value: '합리적 구성' },
    ],
    reviewMeta: [
      { nickname: 'manta****', visitedAt: '2026.07 방문', product: '누사 페니다 펀다이빙 3회', groupType: '펀다이버', highlight: '3회 다이빙 모두 만타가오리를 만나서 버킷리스트를 제대로 이뤘어요.' },
      { nickname: 'penida****', visitedAt: '2026.07 방문', product: '누사 페니다 체험다이빙 2회', groupType: '커플 여행', highlight: '교육을 먼저 충분히 해줘서 바다에서 더 편하게 릴렉스할 수 있었어요.' },
      { nickname: 'bali****', visitedAt: '2026.06 방문', product: '누사페니다 일일투어', groupType: '친구 여행', highlight: '전날 급하게 예약했는데 상담과 당일 진행 모두 친절했어요.' },
      { nickname: 'turtle****', visitedAt: '2026.06 방문', product: '뚤람벤 펀다이빙 2회', groupType: '펀다이버', highlight: '장비와 보트 관리가 잘 되어 있고 거북이도 많이 봐서 만족했습니다.' },
    ],
  },
}

const dateToInputValue = (date: Date) => {
  const year = date.getFullYear()
  const month = `${date.getMonth() + 1}`.padStart(2, '0')
  const day = `${date.getDate()}`.padStart(2, '0')
  return `${year}-${month}-${day}`
}

const addMonths = (date: Date, months: number) => {
  const nextDate = new Date(date)
  nextDate.setMonth(nextDate.getMonth() + months)
  return nextDate
}

const addDays = (date: Date, days: number) => {
  const nextDate = new Date(date)
  nextDate.setDate(nextDate.getDate() + days)
  return nextDate
}

const toMonthStart = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1)

const getMonthKey = (date: Date) => date.getFullYear() * 12 + date.getMonth()

const loadPortOneSdk = () =>
  new Promise<void>((resolve, reject) => {
    if (window.IMP) {
      resolve()
      return
    }

    const existingScript = document.querySelector<HTMLScriptElement>('script[data-portone-v1-sdk="true"]')
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(), { once: true })
      existingScript.addEventListener('error', () => reject(new Error('결제 SDK를 불러오지 못했습니다.')), { once: true })
      return
    }

    const script = document.createElement('script')
    script.src = 'https://cdn.iamport.kr/v1/iamport.js'
    script.async = true
    script.dataset.portoneV1Sdk = 'true'
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('결제 SDK를 불러오지 못했습니다.'))
    document.head.appendChild(script)
  })

const requestPortOneV1Payment = (request: PortOnePaymentRequest) =>
  new Promise<PortOnePaymentResponse>((resolve, reject) => {
    if (!window.IMP) {
      reject(new Error('결제 SDK가 준비되지 않았습니다.'))
      return
    }
    window.IMP.request_pay(request, (response) => resolve(response))
  })

const BranchPage: React.FC = () => {
  const { pathname } = useLocation()
  const { t, language } = useLanguage()
  const { user } = useAuth()
  const [searchParams] = useSearchParams()
  const activeTab = searchParams.get('tab') || 'intro'
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<TourProduct | null>(null)
  const [tourDate, setTourDate] = useState('')
  const [guestCount, setGuestCount] = useState(1)
  const [calendarMonth, setCalendarMonth] = useState(() => toMonthStart(new Date()))
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [checkoutStatus, setCheckoutStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [checkoutMessage, setCheckoutMessage] = useState('')
  const [checkoutCustomer, setCheckoutCustomer] = useState<CheckoutCustomer>({
    name: '',
    email: '',
    phone: '',
    certificationAgency: '',
    certificationLevel: '',
    heightCm: '',
    weightKg: '',
    footSizeMm: '',
    preferredSuitSize: '',
    memo: '',
  })

  const checkScrollLimits = () => {
    if (!scrollContainerRef.current) return
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
    setCanScrollLeft(scrollLeft > 10)
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
  }

  useEffect(() => {
    const container = scrollContainerRef.current
    if (container) {
      checkScrollLimits()
      container.addEventListener('scroll', checkScrollLimits)
      window.addEventListener('resize', checkScrollLimits)
      return () => {
        container.removeEventListener('scroll', checkScrollLimits)
        window.removeEventListener('resize', checkScrollLimits)
      }
    }
  }, [activeTab]) // Re-run when tab changes as content might change

  useEffect(() => {
    if (!user) return
    setCheckoutCustomer({
      name: user.name,
      email: user.email,
      phone: user.profile.phone || '',
      certificationAgency: user.profile.certificationAgency || '',
      certificationLevel: user.profile.certificationLevel || '',
      heightCm: String(user.profile.heightCm || ''),
      weightKg: String(user.profile.weightKg || ''),
      footSizeMm: String(user.profile.footSizeMm || ''),
      preferredSuitSize: user.profile.preferredSuitSize || '',
      memo: user.profile.memo || '',
    })
  }, [user])

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return
    const scrollAmount = scrollContainerRef.current.clientWidth * 0.8
    scrollContainerRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    })
  }

  const currentBranch = DIVING_LOCATIONS.find(loc => loc.path === pathname)

  const BRANCH_GALLERIES: Record<string, { type: 'image' | 'video', src: string, alt?: string }[]> = {
    cebu: [
      { type: 'image', src: '/assets/cebu/cebu-intro-1.jpeg', alt: 'Cebu 1' },
      { type: 'image', src: '/assets/cebu/cebu-intro-2.jpeg', alt: 'Cebu 2' },
      { type: 'image', src: '/assets/cebu/cebu-intro-3.jpeg', alt: 'Cebu 3' },
      { type: 'video', src: '/assets/cebu/cebu-intro-video-1.mp4' },
      { type: 'video', src: '/assets/cebu/cebu-intro-video-2.mp4' },
      { type: 'video', src: '/assets/cebu/cebu-intro-video-3.mp4' },
    ],
    bohol: [
      { type: 'image', src: '/assets/bohol/bohol-intro-1.jpeg', alt: 'Bohol 1' },
      { type: 'image', src: '/assets/bohol/bohol-intro-2.jpeg', alt: 'Bohol 2' },
      { type: 'video', src: '/assets/bohol/bohol-intro-video-1.mp4' },
      { type: 'video', src: '/assets/bohol/bohol-intro-video-2.mp4' },
    ],
    'kota-kinabalu': [
      { type: 'image', src: '/assets/kota-kinabalu/kk-intro-1.jpeg', alt: 'Kota Kinabalu 1' },
      { type: 'image', src: '/assets/kota-kinabalu/kk-intro-2.jpeg', alt: 'Kota Kinabalu 2' },
      { type: 'video', src: '/assets/kota-kinabalu/kk-intro-video-1.mp4' },
      { type: 'video', src: '/assets/kota-kinabalu/kk-intro-video-2.mp4' },
    ],
    bali: [
      { type: 'video', src: '/assets/bali/bali-intro-video-1.mp4' },
      { type: 'video', src: '/assets/bali/bali-intro-video-2.mp4' },
      { type: 'video', src: '/assets/bali/bali-intro-video-3.mp4' },
      { type: 'video', src: '/assets/bali/bali-intro-video-4.mp4' },
    ],
    'nha-trang': [
      { type: 'image', src: '/assets/nha-trang/nha-trang-real-dive-20260721-01-photo.jpeg', alt: '나트랑 다이빙 고객 수중 촬영' },
      { type: 'image', src: '/assets/nha-trang/nha-trang-real-dive-20260706-02-photo.jpeg', alt: '나트랑 보트 다이빙 수중 사진' },
      { type: 'image', src: '/assets/nha-trang/nha-trang-real-dive-20260727-03-photo.jpeg', alt: '나트랑 다이버 수중 사진' },
      { type: 'video', src: '/assets/nha-trang/nha-trang-real-dive-20260721-01-video.mp4' },
      { type: 'video', src: '/assets/nha-trang/nha-trang-real-dive-20260721-02-video.mp4' },
    ],
  }

  if (!currentBranch) {
    return <div className="pt-24 text-center text-white">{t.branchPage.notFound}</div>
  }

  const branchId = currentBranch.id as CenterId
  const locationIndex = DIVING_LOCATIONS.findIndex(loc => loc.id === currentBranch.id)
  const locT = t.locations.locations[locationIndex]
  const displayName = language === 'en' ? currentBranch.name : locT.nameKo
  const gallery = BRANCH_GALLERIES[currentBranch.id]
  const branchContent = BRANCH_PRESENTATION[branchId]
  const instantPaymentStartDate = dateToInputValue(addDays(new Date(), 2))
  const bookingEndDate = dateToInputValue(addMonths(new Date(), 3))
  const bookingStartMonth = toMonthStart(new Date())
  const bookingEndMonth = toMonthStart(addMonths(new Date(), 3))
  const calendarMonthLabel = `${calendarMonth.getFullYear()}년 ${calendarMonth.getMonth() + 1}월`
  const firstDayOfMonth = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), 1)
  const daysInMonth = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 0).getDate()
  const calendarDays = Array.from({ length: firstDayOfMonth.getDay() + daysInMonth }, (_, index) => {
    const day = index - firstDayOfMonth.getDay() + 1
    return day > 0 ? new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), day) : null
  })
  const canGoPreviousMonth = getMonthKey(calendarMonth) > getMonthKey(bookingStartMonth)
  const canGoNextMonth = getMonthKey(calendarMonth) < getMonthKey(bookingEndMonth)
  const selectedProductPriceKrw = selectedProduct ? getProductPriceKrw(selectedProduct) : 0
  const totalAmount = selectedProductPriceKrw * guestCount
  const cartTotalAmount = cartItems.reduce((sum, item) => sum + item.unitPriceKrw * item.guests, 0)
  const cartTotalGuests = cartItems.reduce((sum, item) => sum + item.guests, 0)
  const leadTimeBlockedItems = cartItems.filter((item) => item.tourDate < instantPaymentStartDate)
  const branchProducts = (t.branchPricing[branchId] as TourProduct[]) ?? []
  const recommendedProductIndex = Math.max(branchProducts.findIndex((item) => isDiscoveryProduct(item.program)), 0)
  const branchProductEntries = branchProducts.map((product, index) => ({ product, index }))
  const getProductDescription = (program: string) => {
    if (isSnorkelingProduct(program)) {
      return branchContent.productCopy.snorkeling ?? '다이빙 없이 바다와 포인트를 함께 즐기는 투어입니다.'
    }

    return isDiscoveryProduct(program) ? branchContent.productCopy.discovery : branchContent.productCopy.fun
  }
  const productSections = [
    {
      eyebrow: 'Discovery',
      title: '자격증이 없는 분들을 위한 코스',
      subtitle: '체험다이빙',
      description: '스쿠버 자격증 없이도 교육 후 강사와 함께 안전하게 들어가는 입문 코스입니다.',
      entries: branchProductEntries.filter(({ product }) => isDiscoveryProduct(product.program)),
    },
    {
      eyebrow: 'Fun Diving',
      title: '자격증이 있는 분들을 위한 코스',
      subtitle: '펀다이빙',
      description: '오픈워터 이상 자격증 보유자가 각 지점의 대표 포인트를 여유 있게 즐기는 코스입니다.',
      entries: branchProductEntries.filter(({ product }) => !isDiscoveryProduct(product.program) && !isSnorkelingProduct(product.program)),
    },
    {
      eyebrow: 'Snorkeling',
      title: '다이버가 아니어도 함께 즐기는 코스',
      subtitle: '스노쿨링 호핑투어',
      description: '다이빙을 하지 않는 동행자도 바다와 선상 투어를 함께 즐길 수 있는 코스입니다.',
      entries: branchProductEntries.filter(({ product }) => isSnorkelingProduct(product.program)),
    },
  ].filter((section) => section.entries.length > 0)

  const openPaymentModal = (product: TourProduct) => {
    setSelectedProduct(product)
    setGuestCount(1)
    setTourDate('')
    setCalendarMonth(toMonthStart(new Date()))
  }

  const closePaymentModal = () => {
    setSelectedProduct(null)
  }

  const addSelectedProductToCart = () => {
    if (!selectedProduct) return
    if (!tourDate) {
      setCheckoutStatus('error')
      setCheckoutMessage('투어 날짜를 먼저 선택해주세요.')
      return
    }
    if (tourDate < instantPaymentStartDate) {
      setCheckoutStatus('error')
      setCheckoutMessage(`오늘/내일 투어는 먼저 문의해주세요. 온라인 즉시결제는 ${instantPaymentStartDate} 이후 날짜부터 가능합니다.`)
      return
    }

    setCartItems((items) => [
      ...items,
      {
        id: crypto.randomUUID(),
        locationId: currentBranch.id,
        locationName: displayName,
        program: selectedProduct.program,
        tourDate,
        guests: guestCount,
        unitPriceKrw: selectedProductPriceKrw,
      },
    ])
    setCheckoutStatus('idle')
    setCheckoutMessage('장바구니에 상품을 담았습니다.')
    closePaymentModal()
  }

  const updateCartGuests = (itemId: string, nextGuests: number) => {
    setCartItems((items) =>
      items.map((item) => (item.id === itemId ? { ...item, guests: Math.min(20, Math.max(1, nextGuests)) } : item)),
    )
  }

  const removeCartItem = (itemId: string) => {
    setCartItems((items) => items.filter((item) => item.id !== itemId))
  }

  const updateCheckoutCustomer = (field: keyof CheckoutCustomer, value: string) => {
    setCheckoutCustomer((current) => ({ ...current, [field]: value }))
  }

  const submitCartPayment = async () => {
    if (!checkoutCustomer.name.trim() || !checkoutCustomer.email.trim() || !checkoutCustomer.phone.trim()) {
      setCheckoutStatus('error')
      setCheckoutMessage('비회원 예약을 위해 이름, 이메일, 연락처를 입력해주세요.')
      return
    }
    if (cartItems.length === 0) {
      setCheckoutStatus('error')
      setCheckoutMessage('장바구니에 담긴 상품이 없습니다.')
      return
    }
    if (leadTimeBlockedItems.length > 0) {
      setCheckoutStatus('error')
      setCheckoutMessage(`투어 하루 전 예약은 먼저 문의해주세요. 온라인 즉시결제는 ${instantPaymentStartDate} 이후 날짜부터 가능합니다.`)
      return
    }

    setCheckoutStatus('sending')
    setCheckoutMessage('NHN KCP 카드 결제창을 준비하는 중입니다.')

    try {
      const prepareResponse = await fetch('/api/payments/prepare', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          totalAmount: cartTotalAmount,
          items: cartItems,
          customer: checkoutCustomer,
        }),
      })
      const prepared = await prepareResponse.json() as PaymentPrepareResponse
      if (
        !prepareResponse.ok ||
        !prepared.customerCode ||
        !prepared.channelKey ||
        !prepared.paymentId ||
        !prepared.orderName ||
        !prepared.totalAmount
      ) {
        throw new Error(prepared.error || '결제 주문을 생성하지 못했습니다.')
      }

      await loadPortOneSdk()
      if (!window.IMP) throw new Error('결제 SDK가 준비되지 않았습니다.')
      window.IMP.init(prepared.customerCode)

      const payment = await requestPortOneV1Payment({
        channelKey: prepared.channelKey,
        pay_method: 'card',
        merchant_uid: prepared.paymentId,
        name: prepared.orderName,
        amount: prepared.totalAmount,
        buyer_name: prepared.customer?.fullName || checkoutCustomer.name,
        buyer_email: prepared.customer?.email || checkoutCustomer.email,
        buyer_tel: prepared.customer?.phoneNumber || checkoutCustomer.phone,
        m_redirect_url: `${window.location.origin}${window.location.pathname}`,
      })

      if (payment.success === false || payment.code) {
        throw new Error(payment.error_msg || payment.message || '결제가 취소되었거나 실패했습니다.')
      }

      setCheckoutMessage('결제 완료 여부를 확인하는 중입니다.')

      const response = await fetch('/api/payments/complete', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          paymentId: payment.merchant_uid || payment.paymentId || prepared.paymentId,
          impUid: payment.imp_uid,
        }),
      })
      const data = await response.json() as { error?: string; message?: string }

      if (!response.ok) throw new Error(data.error || '결제 확인에 실패했습니다.')

      setCheckoutStatus('sent')
      setCheckoutMessage(data.message || '결제가 완료되었습니다.')
      setCartItems([])
    } catch (caught) {
      setCheckoutStatus('error')
      setCheckoutMessage(caught instanceof Error ? caught.message : '결제 처리에 실패했습니다.')
    }
  }

  return (
    <div className="bg-gradient-to-b from-[#dff9ff] via-[#f8fdff] to-[#e6fbf4] pt-32 text-slate-900 md:pt-40 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Content Area (Tabs are in the Navigation bar) */}

        {/* Tab Content */}
        <div className="min-h-[400px]">
          {activeTab === 'intro' && (
            <div className="space-y-8 animate-fade-in">
              <div className="beach-panel p-8 rounded-2xl">
                <h3 className="text-2xl font-bold text-[#06334a] mb-4">{t.branchDetails[branchId].title}</h3>
                <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {t.branchDetails[branchId].features.map((feature, idx) => (
                    <div key={idx} className="rounded-xl border border-cyan-100 bg-white p-4 shadow-sm">
                      <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-[#06334a] text-xs font-black text-white">
                        {String(idx + 1).padStart(2, '0')}
                      </div>
                      <p className="text-sm font-bold leading-6 text-slate-700">{feature}</p>
                    </div>
                  ))}
                </div>

                <div className="mb-8 space-y-6">
                  <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
                    <div className="rounded-2xl bg-[#06334a] p-6 text-white shadow-[0_24px_70px_rgba(3,51,74,0.2)]">
                      <p className="mb-3 inline-flex rounded-full bg-parks-gold px-4 py-2 text-xs font-black text-[#06334a]">
                        {branchContent.heroBadge}
                      </p>
                      <h4 className="text-3xl font-black leading-tight">
                        {branchContent.heroTitle}
                        <span className="block text-parks-gold">{branchContent.heroAccent}</span>
                      </h4>
                      <p className="mt-4 text-sm font-semibold leading-7 text-cyan-50/90">
                        {branchContent.heroDescription}
                      </p>
                      <p className="mt-4 rounded-xl bg-white/10 p-4 text-sm font-bold leading-6 text-white">
                        {branchContent.heroNote}
                      </p>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      {branchContent.featureCards.map((item, index) => {
                        const Icon = item.icon
                        return (
                          <div key={item.title} className="rounded-2xl border border-cyan-100 bg-white p-5 shadow-[0_14px_36px_rgba(8,145,178,0.1)]">
                            <div className="mb-4 flex items-center justify-between gap-3">
                              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#ffe66d] text-sm font-black text-[#06334a]">
                                {String(index + 1).padStart(2, '0')}
                              </div>
                              <Icon className="text-cyan-600" size={22} />
                            </div>
                            <h5 className="text-lg font-black leading-6 text-[#06334a]">{item.title}</h5>
                            <p className="mt-2 text-sm font-semibold leading-6 text-slate-700">{item.text}</p>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-sky-100 bg-white p-6">
                    <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                      <div>
                        <p className="text-sm font-black uppercase tracking-[0.2em] text-ocean-accent">Tour Schedule</p>
                        <h4 className="mt-1 text-2xl font-black text-[#06334a]">{branchContent.scheduleTitle}</h4>
                      </div>
                      <p className="text-sm text-slate-500">{branchContent.scheduleNote}</p>
                    </div>
                    <div className="grid gap-3 md:grid-cols-3 xl:grid-cols-6">
                      {branchContent.scheduleItems.map((item, index) => (
                        <div key={`${item.time}-${item.label}`} className="rounded-xl border border-cyan-100 bg-white p-4 shadow-sm">
                          <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-[#06334a] text-xs font-black text-white">
                            {String(index + 1).padStart(2, '0')}
                          </div>
                          <p className="font-black text-cyan-600">{item.time}</p>
                          <p className="mt-1 text-sm font-bold text-slate-700">{item.label}</p>
                        </div>
                      ))}
                    </div>
                  {branchContent.scheduleFootnote && (
                    <p className="mt-4 text-sm font-semibold leading-6 text-amber-600">
                      {branchContent.scheduleFootnote}
                    </p>
                  )}
                  </div>

                  {branchContent.pickupNotice && (
                    <div className="rounded-2xl border border-sky-100 bg-sky-50 p-6">
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                        <div className="flex gap-4">
                          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-[#06334a] text-white">
                            <FaCar size={20} />
                          </div>
                          <div>
                            <p className="text-sm font-black uppercase tracking-[0.2em] text-ocean-teal">Pickup Guide</p>
                            <h4 className="mt-1 text-2xl font-black text-[#06334a]">{branchContent.pickupNotice.title}</h4>
                            <p className="mt-2 text-sm font-semibold leading-6 text-slate-700">
                              {branchContent.pickupNotice.description}
                            </p>
                          </div>
                        </div>
                        <div className="grid gap-3 sm:grid-cols-2 lg:w-[52%]">
                          {branchContent.pickupNotice.items.map((item, index) => (
                            <div key={item.label} className="rounded-xl bg-white p-4 shadow-sm">
                              <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-full bg-[#06334a] text-xs font-black text-white">
                                {String(index + 1).padStart(2, '0')}
                              </div>
                              <p className="text-sm font-black text-cyan-700">{item.label}</p>
                              <p className="mt-2 text-sm font-bold leading-6 text-slate-700">{item.detail}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {branchContent.mealNotice && (
                    <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-6">
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                        <div className="flex gap-4">
                          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white">
                            <FaUtensils size={20} />
                          </div>
                          <div>
                            <p className="text-sm font-black uppercase tracking-[0.2em] text-emerald-700">Meal Guide</p>
                            <h4 className="mt-1 text-2xl font-black text-[#06334a]">{branchContent.mealNotice.title}</h4>
                            <p className="mt-2 text-sm font-semibold leading-6 text-slate-700">
                              {branchContent.mealNotice.description}
                            </p>
                          </div>
                        </div>
                        <div className="grid gap-3 sm:grid-cols-2 lg:w-[48%]">
                          {branchContent.mealNotice.items.map((item, index) => (
                            <div key={item.label} className="rounded-xl bg-white p-4 shadow-sm">
                              <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-full bg-[#06334a] text-xs font-black text-white">
                                {String(index + 1).padStart(2, '0')}
                              </div>
                              <p className="text-sm font-black text-emerald-700">{item.label}</p>
                              <p className="mt-2 text-sm font-bold leading-6 text-slate-700">{item.detail}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {branchContent.pointMap && (
                    <div className="overflow-hidden rounded-2xl border border-sky-100 bg-white shadow-sm">
                      <div className="flex flex-col gap-2 p-6 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                          <p className="text-sm font-black uppercase tracking-[0.2em] text-ocean-accent">Dive Point Map</p>
                          <h4 className="mt-1 text-2xl font-black text-[#06334a]">{branchContent.pointMap.title}</h4>
                        </div>
                        <p className="text-sm text-slate-500">{branchContent.pointMap.note}</p>
                      </div>
                      <img
                        src={branchContent.pointMap.src}
                        alt={branchContent.pointMap.alt}
                        className="w-full bg-sky-100 object-cover"
                      />
                    </div>
                  )}

                  <div className="grid gap-4 lg:grid-cols-3">
                    <div className="rounded-2xl bg-white p-6 shadow-sm">
                      <div className="mb-4 flex items-center justify-between">
                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#06334a] text-sm font-black text-white">01</div>
                        <FaMapMarkedAlt className="text-cyan-600" size={26} />
                      </div>
                      <h4 className="text-xl font-black text-[#06334a]">{branchContent.topPointsTitle}</h4>
                      <div className="mt-4 space-y-3 text-sm leading-6 text-slate-700">
                        {branchContent.topPoints.map((point, index) => (
                          <div key={point.name} className="flex gap-3 rounded-xl bg-cyan-50 p-3">
                            <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-cyan-600 text-xs font-black text-white">
                              {index + 1}
                            </span>
                            <p><strong>{point.name}</strong> - {point.text}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="rounded-2xl bg-white p-6 shadow-sm">
                      <div className="mb-4 flex items-center justify-between">
                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#06334a] text-sm font-black text-white">02</div>
                        <FaCamera className="text-amber-500" size={26} />
                      </div>
                      <h4 className="text-xl font-black text-[#06334a]">사진/영상 혜택</h4>
                      <p className="mt-4 text-sm font-semibold leading-6 text-slate-700">
                        {branchContent.photoBenefitText}
                      </p>
                    </div>
                    <div className="rounded-2xl bg-white p-6 shadow-sm">
                      <div className="mb-4 flex items-center justify-between">
                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#06334a] text-sm font-black text-white">03</div>
                        <FaStar className="text-blue-500" size={26} />
                      </div>
                      <h4 className="text-xl font-black text-[#06334a]">펀다이빙 + 체험다이빙 동행 가능</h4>
                      <p className="mt-4 text-sm font-semibold leading-6 text-slate-700">
                        {branchContent.mixedDivingText}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="relative group">
                  <div
                    ref={scrollContainerRef}
                    className="flex overflow-x-auto gap-4 pb-6 scrollbar-hide snap-x snap-mandatory"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                  >
                    {gallery && gallery.length > 0 ? (
                      gallery.map((item, index) => (
                        <div key={index} className="flex-none w-full md:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-0.67rem)] aspect-video bg-white rounded-xl border border-sky-100 overflow-hidden snap-start shadow-lg">
                          {item.type === 'video' ? (
                            <video
                              src={item.src}
                              className="w-full h-full object-cover"
                              controls
                              muted
                              loop
                              playsInline
                            />
                          ) : (
                            <img
                              src={item.src}
                              alt={item.alt}
                              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                            />
                          )}
                        </div>
                      ))
                    ) : (
                      <>
                        <div className="flex-none w-full md:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-0.67rem)] aspect-video bg-white/5 rounded-xl border border-white/5 flex items-center justify-center text-slate-600 font-medium snap-start">
                          {t.common.photoPlaceholder}
                        </div>
                        <div className="flex-none w-full md:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-0.67rem)] aspect-video bg-white/5 rounded-xl border border-white/5 flex items-center justify-center text-slate-600 font-medium snap-start">
                          {t.common.photoPlaceholder}
                        </div>
                        <div className="flex-none w-full md:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-0.67rem)] aspect-video bg-white/5 rounded-xl border border-white/5 flex items-center justify-center text-slate-600 font-medium snap-start">
                          {t.common.videoPlaceholder}
                        </div>
                      </>
                    )}
                  </div>

                  {gallery && gallery.length > 3 && (
                    <>
                      <button
                        onClick={() => scroll('left')}
                        disabled={!canScrollLeft}
                        className={`absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white transition-all duration-300 z-10
                          ${canScrollLeft
                            ? 'opacity-100 hover:bg-parks-gold hover:text-black cursor-pointer'
                            : 'opacity-50 grayscale pointer-events-none'}`}
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      <button
                        onClick={() => scroll('right')}
                        disabled={!canScrollRight}
                        className={`absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white transition-all duration-300 z-10
                          ${canScrollRight
                            ? 'opacity-100 hover:bg-parks-gold hover:text-black cursor-pointer'
                            : 'opacity-50 grayscale pointer-events-none'}`}
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}


          {activeTab === 'tours' && (
            <div className="space-y-8 animate-fade-in">
              <div className="beach-panel p-8 rounded-2xl">
                <h3 className="text-2xl font-bold text-[#06334a] mb-4">{t.branchPricing.title}</h3>
                <div className="mb-5 space-y-4">
                  <div className="rounded-2xl border border-cyan-100 bg-white p-5 shadow-sm">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                      <div>
                        <p className="text-sm font-black uppercase tracking-[0.2em] text-ocean-teal">Included</p>
                        <h4 className="mt-1 text-xl font-black text-[#06334a]">{branchContent.includedTitle}</h4>
                      </div>
                      <p className="max-w-xl text-sm font-bold leading-6 text-slate-600">
                        {branchContent.includedDescription}
                      </p>
                    </div>
                    <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
                      {branchContent.includedItems.map((item, index) => (
                        <div key={item} className="rounded-xl bg-cyan-50 p-3 text-center">
                          <div className="mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-[#06334a] text-xs font-black text-white">
                            {String(index + 1).padStart(2, '0')}
                          </div>
                          <p className="text-sm font-black text-[#06334a]">{item}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {branchContent.pickupNotice && (
                    <div className="rounded-2xl border border-sky-100 bg-sky-50 p-5">
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex gap-4">
                          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-[#06334a] text-white">
                            <FaCar size={20} />
                          </div>
                          <div>
                            <p className="text-sm font-black uppercase tracking-[0.2em] text-ocean-teal">Pickup Guide</p>
                            <h4 className="mt-1 text-xl font-black text-[#06334a]">{branchContent.pickupNotice.title}</h4>
                            <p className="mt-2 text-sm font-semibold leading-6 text-slate-700">
                              {branchContent.pickupNotice.description}
                            </p>
                          </div>
                        </div>
                        <div className="grid gap-2 sm:grid-cols-2 lg:w-[52%]">
                          {branchContent.pickupNotice.items.map((item) => (
                            <div key={item.label} className="rounded-xl bg-white px-4 py-3 shadow-sm">
                              <p className="text-sm font-black text-cyan-700">{item.label}</p>
                              <p className="mt-1 text-xs font-bold leading-5 text-slate-600">{item.detail}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="rounded-2xl border border-cyan-200 bg-[#e8fbff] p-5">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <div className="flex gap-4">
                        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-[#06334a] text-white">
                          <FaUsers size={20} />
                        </div>
                        <div>
                          <p className="text-sm font-black uppercase tracking-[0.2em] text-ocean-teal">Together</p>
                          <h4 className="mt-1 text-xl font-black text-[#06334a]">펀다이빙 + 체험다이빙 동행 가능</h4>
                          <p className="mt-2 text-sm font-semibold leading-6 text-slate-700">
                            {branchContent.mixedDivingText}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 md:justify-end">
                        <span className="rounded-full bg-white px-3 py-2 text-xs font-black text-[#06334a] shadow-sm">자격증 보유자</span>
                        <span className="rounded-full bg-white px-3 py-2 text-xs font-black text-[#06334a] shadow-sm">다이빙 처음</span>
                        <span className="rounded-full bg-white px-3 py-2 text-xs font-black text-[#06334a] shadow-sm">같은 일정</span>
                      </div>
                    </div>
                  </div>

                  {branchContent.mealNotice && (
                    <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-5">
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex gap-4">
                          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white">
                            <FaUtensils size={20} />
                          </div>
                          <div>
                            <p className="text-sm font-black uppercase tracking-[0.2em] text-emerald-700">Meal Guide</p>
                            <h4 className="mt-1 text-xl font-black text-[#06334a]">{branchContent.mealNotice.title}</h4>
                            <p className="mt-2 text-sm font-semibold leading-6 text-slate-700">
                              {branchContent.mealNotice.description}
                            </p>
                          </div>
                        </div>
                        <div className="grid gap-2 sm:grid-cols-2 lg:w-[46%]">
                          {branchContent.mealNotice.items.map((item) => (
                            <div key={item.label} className="rounded-xl bg-white px-4 py-3 shadow-sm">
                              <p className="text-sm font-black text-emerald-700">{item.label}</p>
                              <p className="mt-1 text-xs font-bold leading-5 text-slate-600">{item.detail}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="rounded-2xl border border-amber-200 bg-[#fff8df] p-5">
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                      <div>
                        <p className="flex items-center gap-2 text-sm font-black text-amber-700">
                          <FaCalendarAlt />
                          오늘/내일 출발은 카카오톡 문의
                        </p>
                        <p className="mt-2 text-sm font-semibold leading-6 text-slate-700">
                          온라인 즉시결제는 투어 2일 전부터 3개월 이내 일정만 가능합니다. 급한 일정은 가능 여부를 먼저 확인해주세요.
                        </p>
                      </div>
                      <a
                        href={KAKAO_CHAT_URL}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center justify-center rounded-full bg-[#06334a] px-5 py-3 text-sm font-black text-white transition hover:bg-cyan-700"
                      >
                        카카오톡 문의
                      </a>
                    </div>
                  </div>
                </div>

                {branchProducts.length > 0 ? (
                  <div className="space-y-5">
                    {productSections.map((section) => (
                      <section
                        key={section.title || 'all-products'}
                        className={section.title ? 'rounded-2xl border border-cyan-100 bg-white/70 p-4 shadow-sm' : ''}
                      >
                        {section.title && (
                          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                            <div>
                              <p className="text-xs font-black uppercase tracking-[0.18em] text-ocean-teal">{section.eyebrow}</p>
                              <h4 className="mt-1 text-xl font-black text-[#06334a]">{section.title}</h4>
                              <span className="mt-2 inline-flex rounded-full bg-cyan-100 px-3 py-1 text-sm font-black text-cyan-800">
                                {section.subtitle}
                              </span>
                            </div>
                            <p className="max-w-xl text-sm font-semibold leading-6 text-slate-600">{section.description}</p>
                          </div>
                        )}

                        <div className="grid gap-4 lg:grid-cols-3">
                          {section.entries.map(({ product: item, index }) => {
                            const isBeginnerPick = index === recommendedProductIndex && isDiscoveryProduct(item.program)
                            const mealNote = getProductMealNote(branchId, item.program)
                            return (
                              <div
                                key={item.program}
                                className={`flex h-full flex-col rounded-2xl border bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg ${
                                  isBeginnerPick ? 'border-parks-gold ring-2 ring-parks-gold/30' : 'border-cyan-100'
                                }`}
                              >
                                <div className="mb-4 flex items-start justify-between gap-3">
                                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#06334a] text-sm font-black text-white">
                                    {String(index + 1).padStart(2, '0')}
                                  </div>
                                  {isBeginnerPick && (
                                    <span className="rounded-full bg-parks-gold px-3 py-1 text-xs font-black text-[#06334a]">
                                      초보자 추천
                                    </span>
                                  )}
                                </div>
                                <h4 className="min-h-[3.5rem] text-lg font-black leading-7 text-[#06334a]">{item.program}</h4>
                                <p className="mt-3 text-sm font-semibold leading-6 text-slate-600">
                                  {getProductDescription(item.program)}
                                </p>
                                {mealNote && (
                                  <p className="mt-3 rounded-xl bg-emerald-50 px-3 py-2 text-xs font-black leading-5 text-emerald-800">
                                    {mealNote}
                                  </p>
                                )}
                                <div className="mt-auto pt-5">
                                  <div className="rounded-xl bg-cyan-50 p-4">
                                    <p className="text-xs font-black uppercase tracking-[0.18em] text-ocean-teal">1인 결제금액</p>
                                    <p className="mt-1 text-3xl font-black text-[#06334a]">{formatKrw(getProductPriceKrw(item))}</p>
                                    <p className="mt-1 text-xs font-bold text-slate-500">
                                      {item.priceKrw ? '원화 고정가' : '1 USD = 1,550원 기준'}
                                    </p>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => openPaymentModal(item)}
                                    className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-parks-gold px-4 py-3 text-sm font-black text-ocean-dark transition hover:bg-[#06334a] hover:text-white"
                                  >
                                    <FaShoppingCart size={14} />
                                    장바구니 담기
                                  </button>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </section>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-2xl border border-sky-100 bg-white p-8 text-center text-slate-500">
                    {t.branchPricing.empty}
                  </div>
                )}
                <p className="mt-3 text-xs text-slate-500">
                  {branchContent.priceNote}
                </p>

                <div className="mt-5 rounded-2xl border border-sky-100 bg-white p-5 shadow-sm">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <p className="text-sm font-black uppercase tracking-[0.2em] text-ocean-teal">Refund</p>
                      <h4 className="mt-1 text-xl font-black text-[#06334a]">환불 규정</h4>
                    </div>
                    <p className="text-sm font-semibold text-slate-500">투어 시작일 기준으로 적용됩니다.</p>
                  </div>
                  <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    {branchContent.refundItems.map((item) => (
                      <div key={item.label} className="rounded-xl bg-cyan-50 p-4">
                        <p className="text-sm font-black text-cyan-700">{item.label}</p>
                        <p className="mt-1 text-lg font-black text-[#06334a]">{item.value}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 rounded-2xl border border-sky-100 bg-white p-5 shadow-sm">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-[0.2em] text-ocean-teal">
                        <FaShoppingCart />
                        Cart
                      </p>
                      <h4 className="mt-1 text-xl font-black text-[#06334a]">예약 장바구니</h4>
                    </div>
                    <div className="text-sm font-bold text-slate-500">
                      총 {cartItems.length}개 상품 · {cartTotalGuests}명
                    </div>
                  </div>

                  {cartItems.length > 0 ? (
                    <div className="mt-5 space-y-3">
                      {cartItems.map((item) => (
                        <div key={item.id} className="rounded-xl border border-sky-100 bg-cyan-50/60 p-4">
                          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                            <div>
                              <p className="text-xs font-bold text-ocean-teal">{item.locationName} · {item.tourDate}</p>
                              <p className="mt-1 font-bold text-slate-800">{item.program}</p>
                              <p className="mt-1 text-sm font-black text-parks-gold">{formatKrw(item.unitPriceKrw * item.guests)}</p>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="flex items-center rounded-full border border-sky-100 bg-white p-1">
                                <button
                                  type="button"
                                  onClick={() => updateCartGuests(item.id, item.guests - 1)}
                                  className="flex h-8 w-8 items-center justify-center rounded-full text-slate-600 transition hover:bg-sky-50"
                                  aria-label="인원 줄이기"
                                >
                                  <FaMinus size={12} />
                                </button>
                                <span className="w-10 text-center text-sm font-black text-slate-800">{item.guests}</span>
                                <button
                                  type="button"
                                  onClick={() => updateCartGuests(item.id, item.guests + 1)}
                                  className="flex h-8 w-8 items-center justify-center rounded-full text-slate-600 transition hover:bg-sky-50"
                                  aria-label="인원 늘리기"
                                >
                                  <FaPlus size={12} />
                                </button>
                              </div>
                              <button
                                type="button"
                                onClick={() => removeCartItem(item.id)}
                                className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-400 transition hover:bg-red-50 hover:text-red-500"
                                aria-label="상품 삭제"
                              >
                                <FaTrash size={13} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}

                      <div className="rounded-2xl border border-sky-100 bg-slate-50 p-5">
                        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                          <div>
                            <p className="text-sm font-black uppercase tracking-[0.2em] text-ocean-teal">Guest checkout</p>
                            <h5 className="mt-1 text-lg font-black text-[#06334a]">예약자 정보</h5>
                          </div>
                          <p className="text-xs text-slate-500">
                            로그인 없이도 예약/결제가 가능합니다.
                          </p>
                        </div>
                        <div className="grid gap-3 md:grid-cols-3">
                          <label className="block">
                            <span className="mb-1 block text-xs font-bold text-slate-500">이름 *</span>
                            <input
                              value={checkoutCustomer.name}
                              onChange={(event) => updateCheckoutCustomer('name', event.currentTarget.value)}
                              className="w-full rounded-lg border border-sky-100 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-ocean-teal"
                              placeholder="홍길동"
                            />
                          </label>
                          <label className="block">
                            <span className="mb-1 block text-xs font-bold text-slate-500">이메일 *</span>
                            <input
                              type="email"
                              value={checkoutCustomer.email}
                              onChange={(event) => updateCheckoutCustomer('email', event.currentTarget.value)}
                              className="w-full rounded-lg border border-sky-100 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-ocean-teal"
                              placeholder="diver@example.com"
                            />
                          </label>
                          <label className="block">
                            <span className="mb-1 block text-xs font-bold text-slate-500">연락처 *</span>
                            <input
                              value={checkoutCustomer.phone}
                              onChange={(event) => updateCheckoutCustomer('phone', event.currentTarget.value)}
                              className="w-full rounded-lg border border-sky-100 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-ocean-teal"
                              placeholder="010-0000-0000"
                            />
                          </label>
                        </div>
                        <div className="mt-3 grid gap-3 md:grid-cols-3">
                          <label className="block">
                            <span className="mb-1 block text-xs font-bold text-slate-500">키(cm)</span>
                            <input
                              type="number"
                              value={checkoutCustomer.heightCm}
                              onChange={(event) => updateCheckoutCustomer('heightCm', event.currentTarget.value)}
                              className="w-full rounded-lg border border-sky-100 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-ocean-teal"
                              placeholder="175"
                            />
                          </label>
                          <label className="block">
                            <span className="mb-1 block text-xs font-bold text-slate-500">몸무게(kg)</span>
                            <input
                              type="number"
                              value={checkoutCustomer.weightKg}
                              onChange={(event) => updateCheckoutCustomer('weightKg', event.currentTarget.value)}
                              className="w-full rounded-lg border border-sky-100 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-ocean-teal"
                              placeholder="70"
                            />
                          </label>
                          <label className="block">
                            <span className="mb-1 block text-xs font-bold text-slate-500">발 사이즈(mm)</span>
                            <input
                              type="number"
                              value={checkoutCustomer.footSizeMm}
                              onChange={(event) => updateCheckoutCustomer('footSizeMm', event.currentTarget.value)}
                              className="w-full rounded-lg border border-sky-100 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-ocean-teal"
                              placeholder="270"
                            />
                          </label>
                        </div>
                        <div className="mt-3 grid gap-3 md:grid-cols-3">
                          <label className="block">
                            <span className="mb-1 block text-xs font-bold text-slate-500">자격증 단체</span>
                            <input
                              value={checkoutCustomer.certificationAgency}
                              onChange={(event) => updateCheckoutCustomer('certificationAgency', event.currentTarget.value)}
                              className="w-full rounded-lg border border-sky-100 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-ocean-teal"
                              placeholder="PADI, SSI..."
                            />
                          </label>
                          <label className="block">
                            <span className="mb-1 block text-xs font-bold text-slate-500">자격증 레벨</span>
                            <input
                              value={checkoutCustomer.certificationLevel}
                              onChange={(event) => updateCheckoutCustomer('certificationLevel', event.currentTarget.value)}
                              className="w-full rounded-lg border border-sky-100 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-ocean-teal"
                              placeholder="Open Water"
                            />
                          </label>
                          <label className="block">
                            <span className="mb-1 block text-xs font-bold text-slate-500">선호 수트 사이즈</span>
                            <input
                              value={checkoutCustomer.preferredSuitSize}
                              onChange={(event) => updateCheckoutCustomer('preferredSuitSize', event.currentTarget.value)}
                              className="w-full rounded-lg border border-sky-100 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-ocean-teal"
                              placeholder="M, ML, L"
                            />
                          </label>
                        </div>
                        <label className="mt-3 block">
                          <span className="mb-1 block text-xs font-bold text-slate-500">장비 준비 메모</span>
                          <textarea
                            rows={3}
                            value={checkoutCustomer.memo}
                            onChange={(event) => updateCheckoutCustomer('memo', event.currentTarget.value)}
                            className="w-full resize-none rounded-lg border border-sky-100 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-ocean-teal"
                            placeholder="시력, 사이즈, 걱정되는 점 등"
                          />
                        </label>
                      </div>

                      <div className="flex flex-col gap-3 border-t border-sky-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="text-sm font-bold text-slate-500">총 예상 결제금액</p>
                          <p className="text-2xl font-black text-[#06334a]">{formatKrw(cartTotalAmount)}</p>
                        </div>
                        <button
                          type="button"
                          onClick={submitCartPayment}
                          disabled={checkoutStatus === 'sending'}
                          className="inline-flex items-center justify-center gap-2 rounded-full bg-[#06334a] px-5 py-3 text-sm font-black text-white transition hover:bg-ocean-teal disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          <FaCreditCard />
                          {checkoutStatus === 'sending' ? '결제 처리 중' : 'NHN KCP 카드 결제하기'}
                        </button>
                      </div>
                      <p className="rounded-xl bg-cyan-50 p-4 text-sm leading-6 text-slate-600">
                        온라인 즉시결제는 투어 2일 전부터 3개월 이내 일정만 가능합니다. 오늘/내일 출발 건은{' '}
                        <a
                          href={KAKAO_CHAT_URL}
                          target="_blank"
                          rel="noreferrer"
                          className="font-black text-ocean-teal underline underline-offset-4"
                        >
                          카카오톡 문의
                        </a>
                        로 가능 여부를 먼저 확인해주세요.
                      </p>
                    </div>
                  ) : (
                    <p className="mt-4 rounded-xl border border-dashed border-sky-200 bg-cyan-50/60 p-4 text-sm text-slate-500">
                      상품의 담기 버튼을 누르면 날짜와 인원을 선택한 뒤 여러 상품을 한 번에 결제할 수 있습니다.
                    </p>
                  )}

                  {!user && (
                    <p className="mt-4 text-sm text-slate-500">
                      다음 예약 때 정보를 자동으로 불러오려면{' '}
                      <Link to="/auth" className="font-black text-ocean-teal underline underline-offset-4">
                        로그인 / 회원가입
                      </Link>
                      을 이용할 수 있습니다.
                    </p>
                  )}

                  {checkoutMessage && (
                    <p className={`mt-4 rounded-xl px-4 py-3 text-sm font-bold ${
                      checkoutStatus === 'error'
                        ? 'bg-red-50 text-red-600'
                        : checkoutStatus === 'sent'
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-amber-50 text-amber-700'
                    }`}>
                      {checkoutMessage}
                    </p>
                  )}
                </div>

              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-8 animate-fade-in">
              <div className="beach-panel p-8 rounded-2xl">
                <h3 className="text-2xl font-bold text-[#06334a] mb-4">{t.branchPage.reviewsTitle}</h3>
                <p className="text-slate-600 leading-relaxed mb-6">
                  {displayName}{t.branchPage.reviewsSubtitle}
                </p>

                {(() => {
                  const reviews = REVIEW_DATA[language]?.[branchId] || []

                  return (
                    <div className="relative group">
                      <div className="mb-6 rounded-2xl border border-cyan-100 bg-white p-5 shadow-sm">
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                          <div>
                            <p className="text-sm font-black uppercase tracking-[0.2em] text-ocean-teal">Real Reviews</p>
                            <h4 className="mt-1 text-xl font-black text-[#06334a]">{branchContent.reviewTitle}</h4>
                            <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">
                              {branchContent.reviewSubtitle}
                            </p>
                          </div>
                          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:min-w-[520px]">
                            {branchContent.reviewHighlights.map((item) => (
                              <div key={item.label} className="rounded-xl bg-cyan-50 p-3">
                                <p className="text-xs font-black text-cyan-700">{item.label}</p>
                                <p className="mt-1 text-sm font-black text-[#06334a]">{item.value}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div
                        ref={scrollContainerRef}
                        className="flex overflow-x-auto gap-4 pb-6 no-scrollbar snap-x snap-mandatory"
                      >
                        {reviews.length > 0 ? (
                          reviews.map((review: string, i: number) => {
                            const reviewMeta = branchContent.reviewMeta[i % branchContent.reviewMeta.length]

                            return (
                              <div
                                key={i}
                                className="flex-none w-[86vw] rounded-2xl border border-sky-100 bg-white p-5 snap-start shadow-sm sm:w-[420px] md:w-[470px] lg:w-[520px]"
                              >
                                {reviewMeta ? (
                                  <>
                                    <div className="mb-4 flex items-start justify-between gap-4 border-b border-sky-100 pb-4">
                                      <div className="flex gap-3">
                                        <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-[#06334a] text-sm font-black text-white">
                                          {String(i + 1).padStart(2, '0')}
                                        </div>
                                        <div>
                                          <div className="flex flex-wrap items-center gap-2">
                                            <p className="font-black text-[#06334a]">{reviewMeta.nickname}</p>
                                            <span className="rounded-full bg-cyan-50 px-2 py-1 text-xs font-black text-cyan-700">
                                              예약 고객
                                            </span>
                                          </div>
                                          <p className="mt-1 text-xs font-bold text-slate-500">
                                            {reviewMeta.visitedAt} · {reviewMeta.product}
                                          </p>
                                        </div>
                                      </div>
                                      <div className="flex flex-shrink-0 items-center gap-1 text-sm text-parks-gold">
                                        {Array.from({ length: 5 }).map((_, starIndex) => (
                                          <FaStar key={starIndex} />
                                        ))}
                                      </div>
                                    </div>

                                    <div className="mb-4 flex flex-wrap gap-2">
                                      <span className="rounded-full bg-[#fff8df] px-3 py-1 text-xs font-black text-amber-700">
                                        {reviewMeta.groupType}
                                      </span>
                                      <span className="rounded-full bg-cyan-50 px-3 py-1 text-xs font-black text-cyan-700">
                                        원문 후기
                                      </span>
                                    </div>

                                    <div className="mb-4 rounded-xl bg-slate-50 p-4">
                                      <p className="text-xs font-black uppercase tracking-[0.16em] text-ocean-teal">
                                        고객이 말한 핵심
                                      </p>
                                      <p className="mt-2 text-sm font-black leading-6 text-[#06334a]">
                                        {reviewMeta.highlight}
                                      </p>
                                    </div>

                                    <p className="max-h-[210px] overflow-y-auto pr-2 text-sm font-medium leading-7 text-slate-700 custom-scrollbar break-words hyphens-auto">
                                      {review}
                                    </p>
                                  </>
                                ) : (
                                  <>
                                    <div className="mb-4 flex items-start justify-between">
                                      <span className="text-xs font-medium text-slate-500">{t.branchTabs.registeredReview}</span>
                                      <div className="flex flex-shrink-0 gap-1 text-sm text-parks-gold">
                                        {Array.from({ length: 5 }).map((_, starIndex) => (
                                          <FaStar key={starIndex} />
                                        ))}
                                      </div>
                                    </div>
                                    <p className="max-h-[300px] overflow-y-auto text-sm leading-relaxed text-slate-600 custom-scrollbar break-words hyphens-auto">
                                      {review}
                                    </p>
                                  </>
                                )}
                              </div>
                            )
                          })
                        ) : (
                          <div className="w-full text-center text-slate-500 italic py-12">
                            {t.branchPage.noReviews}
                          </div>
                        )}
                      </div>

                      {reviews.length > 0 && (
                        <>
                          <button
                            onClick={() => scroll('left')}
                            disabled={!canScrollLeft}
                            className={`absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white transition-all duration-300 z-10
                              ${canScrollLeft
                                ? 'opacity-100 hover:bg-parks-gold hover:text-black cursor-pointer'
                                : 'opacity-50 grayscale pointer-events-none'}`}
                          >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                          </button>
                          <button
                            onClick={() => scroll('right')}
                            disabled={!canScrollRight}
                            className={`absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white transition-all duration-300 z-10
                              ${canScrollRight
                                ? 'opacity-100 hover:bg-parks-gold hover:text-black cursor-pointer'
                                : 'opacity-50 grayscale pointer-events-none'}`}
                          >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </button>
                        </>
                      )}
                    </div>
                  )
                })()}
              </div>
            </div>
          )}
        </div>
      </div>

      {selectedProduct && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-white/10 bg-slate-950 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-parks-gold">Reservation</p>
                <h2 className="mt-1 text-xl font-black text-white">예약 및 결제</h2>
              </div>
              <button
                type="button"
                onClick={closePaymentModal}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-slate-300 transition hover:bg-white/10 hover:text-white"
                aria-label="닫기"
              >
                <FaTimes />
              </button>
            </div>

            <div className="space-y-5 px-6 py-6">
              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm text-slate-400">{displayName}</p>
                <p className="mt-1 text-lg font-bold text-white">{selectedProduct.program}</p>
                <p className="mt-3 text-2xl font-black text-parks-gold">
                  {formatKrw(selectedProductPriceKrw)}
                  <span className="ml-1 text-sm font-bold text-slate-400">/ 1인</span>
                </p>
                <p className="mt-2 text-xs text-slate-500">
                  {selectedProduct.priceKrw ? '원화 고정가' : '1 USD = 1,550원 기준'}
                </p>
              </div>

              <div className="grid gap-4">
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="block text-sm font-bold text-slate-200">투어 날짜</span>
                    <span className="inline-flex items-center gap-2 text-xs font-bold text-parks-gold">
                      <FaCalendarAlt size={12} />
                      {tourDate || '날짜 선택'}
                    </span>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                    <div className="mb-4 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => setCalendarMonth(toMonthStart(addMonths(calendarMonth, -1)))}
                        disabled={!canGoPreviousMonth}
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-slate-300 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-30"
                        aria-label="이전 달"
                      >
                        <FaChevronLeft size={14} />
                      </button>
                      <p className="text-sm font-black text-white">{calendarMonthLabel}</p>
                      <button
                        type="button"
                        onClick={() => setCalendarMonth(toMonthStart(addMonths(calendarMonth, 1)))}
                        disabled={!canGoNextMonth}
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-slate-300 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-30"
                        aria-label="다음 달"
                      >
                        <FaChevronRight size={14} />
                      </button>
                    </div>
                    <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold text-slate-500">
                      {['일', '월', '화', '수', '목', '금', '토'].map((day) => (
                        <span key={day} className="py-2">{day}</span>
                      ))}
                    </div>
                    <div className="mt-1 grid grid-cols-7 gap-1">
                      {calendarDays.map((date, index) => {
                        if (!date) {
                          return <span key={`empty-${index}`} className="h-10" />
                        }

                        const dateValue = dateToInputValue(date)
                        const disabled = dateValue < instantPaymentStartDate || dateValue > bookingEndDate
                        const selected = dateValue === tourDate

                        return (
                          <button
                            key={dateValue}
                            type="button"
                            disabled={disabled}
                            onClick={() => setTourDate(dateValue)}
                            className={`flex h-10 items-center justify-center rounded-lg text-sm font-bold transition ${
                              selected
                                ? 'bg-parks-gold text-ocean-dark'
                                : 'bg-white/5 text-slate-200 hover:bg-white/10'
                            } disabled:cursor-not-allowed disabled:bg-transparent disabled:text-slate-700`}
                          >
                            {date.getDate()}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                  <span className="mt-2 block text-xs leading-5 text-slate-500">
                    온라인 즉시결제는 {instantPaymentStartDate} 이후부터 가능합니다. 오늘/내일 투어는 카카오톡 문의 후 예약해주세요.
                  </span>
                </div>
                <label className="block">
                  <span className="mb-2 block text-sm font-bold text-slate-200">인원</span>
                  <div className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-3 py-2">
                    <button
                      type="button"
                      onClick={() => setGuestCount((count) => Math.max(1, count - 1))}
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-slate-200 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
                      disabled={guestCount <= 1}
                      aria-label="인원 줄이기"
                    >
                      <FaMinus size={13} />
                    </button>
                    <span className="text-lg font-black text-white">{guestCount}명</span>
                    <button
                      type="button"
                      onClick={() => setGuestCount((count) => Math.min(20, count + 1))}
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-slate-200 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
                      disabled={guestCount >= 20}
                      aria-label="인원 늘리기"
                    >
                      <FaPlus size={13} />
                    </button>
                  </div>
                </label>
              </div>

              <div className="rounded-xl bg-ocean-teal/10 p-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-bold text-slate-300">예상 결제금액</span>
                  <span className="text-2xl font-black text-white">{formatKrw(totalAmount)}</span>
                </div>
                <p className="mt-2 text-xs leading-6 text-slate-400">
                  선택한 날짜와 인원 기준 결제 금액입니다. 장바구니에서 여러 상품을 한 번에 NHN KCP 카드 결제로 진행할 수 있습니다.
                </p>
              </div>

              <button
                type="button"
                onClick={addSelectedProductToCart}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-parks-gold px-5 py-4 text-base font-black text-ocean-dark transition hover:bg-white"
              >
                <FaShoppingCart />
                장바구니에 담기
              </button>

              <p className="text-center text-xs text-slate-500">
                장바구니에서 여러 상품을 한 번에 구매 요청할 수 있습니다.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default BranchPage
