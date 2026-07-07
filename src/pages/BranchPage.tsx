import React, { useRef, useState, useEffect } from 'react'
import { Link, useLocation, useSearchParams } from 'react-router-dom'
import { DIVING_LOCATIONS } from '../data/diving-locations'
import { REVIEW_DATA } from '../data/reviewData'
import { CenterId } from '../types/center.types'
import { useLanguage } from '../contexts/LanguageContext'
import { useAuth } from '../contexts/AuthContext'
import {
  FaCamera,
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
  FaTimes,
  FaTrash,
  FaUsers,
} from 'react-icons/fa'
// Note: Tabs are now managed by the Navigation component in Tier 2

type TourProduct = {
  program: string
  balance: number
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

type PortOnePaymentResponse = {
  code?: string
  message?: string
  paymentId?: string
}

type PortOnePaymentRequest = {
  storeId: string
  channelKey: string
  paymentId: string
  orderName: string
  totalAmount: number
  currency: 'CURRENCY_KRW'
  payMethod: 'CARD'
  customer?: {
    fullName?: string
    email?: string
    phoneNumber?: string
  }
}

declare global {
  interface Window {
    PortOne?: {
      requestPayment: (request: PortOnePaymentRequest) => Promise<PortOnePaymentResponse>
    }
  }
}

const KRW_PER_USD = 1550

const usdToKrw = (usd: number) => Math.round(usd * KRW_PER_USD)

const formatKrw = (amount: number) => `${Math.round(amount).toLocaleString('ko-KR')}원`

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

const toMonthStart = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1)

const getMonthKey = (date: Date) => date.getFullYear() * 12 + date.getMonth()

const loadPortOneSdk = () =>
  new Promise<void>((resolve, reject) => {
    if (window.PortOne) {
      resolve()
      return
    }

    const existingScript = document.querySelector<HTMLScriptElement>('script[data-portone-sdk="true"]')
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(), { once: true })
      existingScript.addEventListener('error', () => reject(new Error('결제 SDK를 불러오지 못했습니다.')), { once: true })
      return
    }

    const script = document.createElement('script')
    script.src = 'https://cdn.portone.io/v2/browser-sdk.js'
    script.async = true
    script.dataset.portoneSdk = 'true'
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('결제 SDK를 불러오지 못했습니다.'))
    document.head.appendChild(script)
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
  }

  if (!currentBranch) {
    return <div className="pt-24 text-center text-white">{t.branchPage.notFound}</div>
  }

  const locationIndex = DIVING_LOCATIONS.findIndex(loc => loc.id === currentBranch.id)
  const locT = t.locations.locations[locationIndex]
  const displayName = language === 'en' ? currentBranch.name : locT.nameKo
  const gallery = BRANCH_GALLERIES[currentBranch.id]
  const bookingStartDate = dateToInputValue(new Date())
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
  const selectedProductPriceKrw = selectedProduct ? usdToKrw(selectedProduct.balance) : 0
  const totalAmount = selectedProductPriceKrw * guestCount
  const cartTotalAmount = cartItems.reduce((sum, item) => sum + item.unitPriceKrw * item.guests, 0)
  const cartTotalGuests = cartItems.reduce((sum, item) => sum + item.guests, 0)

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

  const submitCartPayment = async () => {
    if (!user) {
      setCheckoutStatus('error')
      setCheckoutMessage('장바구니 결제를 진행하려면 로그인이 필요합니다.')
      return
    }
    if (cartItems.length === 0) {
      setCheckoutStatus('error')
      setCheckoutMessage('장바구니에 담긴 상품이 없습니다.')
      return
    }

    setCheckoutStatus('sending')
    setCheckoutMessage('결제창을 준비하는 중입니다.')

    try {
      const configResponse = await fetch('/api/payments/config', { credentials: 'include' })
      const config = await configResponse.json() as { storeId?: string; channelKey?: string; error?: string }
      if (!configResponse.ok || !config.storeId || !config.channelKey) {
        throw new Error(config.error || '결제 설정을 불러오지 못했습니다.')
      }

      await loadPortOneSdk()
      if (!window.PortOne) throw new Error('결제 SDK가 준비되지 않았습니다.')

      const paymentId = `parks-${Date.now()}-${crypto.randomUUID().slice(0, 8)}`
      const orderName =
        cartItems.length === 1
          ? cartItems[0].program
          : `${cartItems[0].program} 외 ${cartItems.length - 1}건`

      const payment = await window.PortOne.requestPayment({
        storeId: config.storeId,
        channelKey: config.channelKey,
        paymentId,
        orderName,
        totalAmount: cartTotalAmount,
        currency: 'CURRENCY_KRW',
        payMethod: 'CARD',
        customer: {
          fullName: user.name,
          email: user.email,
          phoneNumber: user.profile.phone || undefined,
        },
      })

      if (payment.code) {
        throw new Error(payment.message || '결제가 취소되었거나 실패했습니다.')
      }

      setCheckoutMessage('결제 완료 여부를 확인하는 중입니다.')

      const response = await fetch('/api/payments/complete', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          paymentId: payment.paymentId || paymentId,
          totalAmount: cartTotalAmount,
          items: cartItems,
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
                <h3 className="text-2xl font-bold text-[#06334a] mb-4">{t.branchDetails[currentBranch.id as CenterId].title}</h3>
                <div className="text-slate-600 leading-relaxed mb-6 space-y-4">
                  <ul className="list-disc list-inside space-y-2">
                    {t.branchDetails[currentBranch.id as CenterId].features.map((feature, idx) => (
                      <li key={idx}>{feature}</li>
                    ))}
                  </ul>
                </div>

                {currentBranch.id === 'cebu' && (
                  <div className="mb-8 space-y-6">
                    <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
                      <div className="rounded-2xl bg-[#06334a] p-6 text-white">
                        <p className="mb-3 inline-flex rounded-full bg-parks-gold px-4 py-2 text-xs font-black text-[#06334a]">
                          세부 막탄 올 인클루시브 투어
                        </p>
                        <h4 className="text-3xl font-black leading-tight">
                          가격, 픽업, 장비, 촬영까지
                          <span className="block text-parks-gold">한 번에 준비합니다.</span>
                        </h4>
                        <p className="mt-4 text-sm leading-7 text-cyan-50/80">
                          세부 1호점은 막탄 주요 다이빙 포인트를 중심으로 체험다이빙, 펀다이빙,
                          스노클링, 해양 스포츠를 운영합니다. 처음 바다에 들어가는 분도 교육부터
                          입수까지 천천히 적응할 수 있게 진행합니다.
                        </p>
                      </div>

                      <div className="grid gap-3 sm:grid-cols-2">
                        {[
                          { icon: FaCheckCircle, title: '추가금 걱정 최소화', text: '장비 렌탈, 픽드랍, 다이빙, 점심 한식, 환경세, 입장료, 수중 사진/영상 촬영 포함' },
                          { icon: FaClock, title: '1회 35분 이상', text: '체험다이빙도 짧은 촬영이 아니라 교육과 수중 적응을 포함해 여유 있게 진행' },
                          { icon: FaUsers, title: '전문 로컬 가이드', text: '2,000회 이상 진행 경험을 바탕으로 당일 바다 상황에 맞춰 안전하게 안내' },
                          { icon: FaCertificate, title: 'PADI 5 Star 기준', text: '장비 점검과 안전 브리핑을 우선으로 하는 공식 다이빙샵 운영 기준' },
                        ].map((item) => {
                          const Icon = item.icon
                          return (
                            <div key={item.title} className="rounded-2xl border border-sky-100 bg-white p-5 shadow-sm">
                              <Icon className="mb-3 text-cyan-600" size={22} />
                              <h5 className="font-black text-[#06334a]">{item.title}</h5>
                              <p className="mt-2 text-sm leading-6 text-slate-600">{item.text}</p>
                            </div>
                          )
                        })}
                      </div>
                    </div>

                    <div className="rounded-2xl border border-sky-100 bg-white p-6">
                      <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                          <p className="text-sm font-black uppercase tracking-[0.2em] text-ocean-accent">Tour Schedule</p>
                          <h4 className="mt-1 text-2xl font-black text-[#06334a]">세부 다이빙 투어 일정</h4>
                        </div>
                        <p className="text-sm text-slate-500">상품과 당일 해양 상황에 따라 시간은 조정될 수 있습니다.</p>
                      </div>
                      <div className="grid gap-3 md:grid-cols-3 xl:grid-cols-6">
                        {[
                          ['08:00', '막탄 호텔 픽업'],
                          ['09:00', '다이빙 교육'],
                          ['10:00', '1번째 보트 다이빙'],
                          ['11:00', '2번째 보트 다이빙'],
                          ['12:00', '점심 식사'],
                          ['14:30', '3회 상품 종료/드랍'],
                        ].map(([time, label], index) => (
                          <div key={`${time}-${label}`} className="rounded-xl bg-cyan-50 p-4">
                            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-[#06334a] text-xs font-black text-white">
                              {index + 1}
                            </div>
                            <p className="font-black text-cyan-600">{time}</p>
                            <p className="mt-1 text-sm font-bold text-slate-700">{label}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid gap-4 lg:grid-cols-3">
                      <div className="rounded-2xl bg-[#e8fbff] p-6">
                        <FaMapMarkedAlt className="mb-4 text-cyan-600" size={26} />
                        <h4 className="text-xl font-black text-[#06334a]">세부 포인트 Top 3</h4>
                        <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-700">
                          <li><strong>콘티키</strong> - 정어리떼를 자주 볼 수 있는 인기 포인트</li>
                          <li><strong>올랑고 섬</strong> - 산호와 열대어가 많은 해양국립공원</li>
                          <li><strong>마리곤돈 동굴</strong> - 해저 동굴을 경험할 수 있는 대표 포인트</li>
                        </ul>
                      </div>
                      <div className="rounded-2xl bg-[#fff7d6] p-6">
                        <FaCamera className="mb-4 text-amber-500" size={26} />
                        <h4 className="text-xl font-black text-[#06334a]">사진/영상 혜택</h4>
                        <p className="mt-4 text-sm leading-6 text-slate-700">
                          투어 중 최신 고프로로 사진 약 50장과 영상 약 5개를 공유해드립니다.
                          사진 리뷰 이벤트 참여 시 추가 혜택도 받을 수 있습니다.
                        </p>
                      </div>
                      <div className="rounded-2xl bg-[#eef4ff] p-6">
                        <FaStar className="mb-4 text-blue-500" size={26} />
                        <h4 className="text-xl font-black text-[#06334a]">동행자도 함께</h4>
                        <p className="mt-4 text-sm leading-6 text-slate-700">
                          자격증 보유자는 펀다이빙, 미보유자는 체험다이빙으로 같은 일정 안에서
                          연인/친구/가족이 함께 즐길 수 있습니다.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

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
                <p className="text-slate-600 leading-relaxed mb-6">
                  {displayName}{t.branchPricing.subtitle}
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-left bg-white rounded-xl overflow-hidden shadow-sm">
                    <thead>
                      <tr className="bg-[#06334a] text-white">
                        <th className="py-4 px-6 font-bold">{t.branchPricing.headers.program}</th>
                        <th className="py-4 px-6 text-right font-bold text-parks-gold">{t.branchPricing.headers.price}</th>
                        <th className="py-4 px-6 text-right font-bold">장바구니</th>
                      </tr>
                    </thead>
                    <tbody className="text-slate-700 divide-y divide-sky-100">
                      {(t.branchPricing[currentBranch.id as CenterId] as TourProduct[])?.map((item, index) => (
                        <tr key={index} className="hover:bg-cyan-50 transition-colors">
                          <td className="py-4 px-6 font-medium">{item.program}</td>
                          <td className="py-4 px-6 text-right tabular-nums text-parks-gold font-bold">
                            {formatKrw(usdToKrw(item.balance))}
                          </td>
                          <td className="py-4 px-6 text-right">
                            <button
                              type="button"
                              onClick={() => openPaymentModal(item)}
                              className="inline-flex items-center justify-center gap-2 rounded-full bg-parks-gold px-4 py-2 text-sm font-black text-ocean-dark transition hover:bg-white"
                            >
                              <FaShoppingCart size={14} />
                              담기
                            </button>
                          </td>
                        </tr>
                      )) || (
                          <tr>
                            <td colSpan={3} className="py-8 text-center text-slate-500 italic">
                              {t.branchPricing.empty}
                            </td>
                          </tr>
                        )}
                    </tbody>
                  </table>
                </div>
                <p className="mt-3 text-xs text-slate-500">
                  1 USD = 1,550원 기준으로 환산한 원화 결제 금액입니다.
                </p>

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
                          {checkoutStatus === 'sending' ? '결제 처리 중' : '장바구니 결제하기'}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="mt-4 rounded-xl border border-dashed border-sky-200 bg-cyan-50/60 p-4 text-sm text-slate-500">
                      상품의 담기 버튼을 누르면 날짜와 인원을 선택한 뒤 여러 상품을 한 번에 결제할 수 있습니다.
                    </p>
                  )}

                  {!user && (
                    <p className="mt-4 text-sm text-slate-500">
                      회원정보와 장비 정보를 함께 보내려면{' '}
                      <Link to="/auth" className="font-black text-ocean-teal underline underline-offset-4">
                        로그인 / 회원가입
                      </Link>
                      이 필요합니다.
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
                  const reviews = REVIEW_DATA[language]?.[currentBranch.id as CenterId] || []

                  return (
                    <div className="relative group">
                      <div
                        ref={scrollContainerRef}
                        className="flex overflow-x-auto gap-4 pb-6 no-scrollbar snap-x snap-mandatory"
                      >
                        {reviews.length > 0 ? (
                          reviews.map((review: string, i: number) => (
                            <div key={i} className="flex-none w-[85vw] sm:w-[400px] md:w-[450px] lg:w-[500px] bg-white rounded-xl border border-sky-100 p-6 snap-start flex flex-col min-h-[300px] max-h-[400px] shadow-sm">
                              <div className="flex justify-between items-start mb-4">
                                <span className="text-xs text-slate-500 font-medium">{t.branchTabs.registeredReview}</span>
                                <div className="text-parks-gold flex gap-1 text-sm flex-shrink-0">
                                  {Array.from({ length: 5 }).map((_, i) => (
                                    <span key={i}>⭐</span>
                                  ))}
                                </div>
                              </div>
                              <p className="text-slate-600 text-sm leading-relaxed flex-1 overflow-y-auto custom-scrollbar break-words hyphens-auto">{review}</p>
                            </div>
                          ))
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
                <p className="mt-2 text-xs text-slate-500">1 USD = 1,550원 기준</p>
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
                        const disabled = dateValue < bookingStartDate || dateValue > bookingEndDate
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
                  <span className="mt-2 block text-xs text-slate-500">오늘부터 3개월 이내 날짜만 선택 가능합니다.</span>
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
                  실제 결제 연동 전 미리보기 화면입니다. 온라인 결제 연동이 완료되면 이 버튼에서 결제 화면으로 이동합니다.
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
