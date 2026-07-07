import React, { useRef, useState, useEffect } from 'react'
import { useLocation, useSearchParams } from 'react-router-dom'
import { DIVING_LOCATIONS } from '../data/diving-locations'
import { REVIEW_DATA } from '../data/reviewData'
import { CenterId } from '../types/center.types'
import { useLanguage } from '../contexts/LanguageContext'
import { FaCreditCard, FaTimes } from 'react-icons/fa'
// Note: Tabs are now managed by the Navigation component in Tier 2

type TourProduct = {
  program: string
  balance: number
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

const BranchPage: React.FC = () => {
  const { pathname } = useLocation()
  const { t, language } = useLanguage()
  const [searchParams] = useSearchParams()
  const activeTab = searchParams.get('tab') || 'intro'
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<TourProduct | null>(null)
  const [tourDate, setTourDate] = useState('')
  const [guestCount, setGuestCount] = useState(1)

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
  const selectedProductPriceKrw = selectedProduct ? usdToKrw(selectedProduct.balance) : 0
  const totalAmount = selectedProductPriceKrw * guestCount

  const openPaymentModal = (product: TourProduct) => {
    setSelectedProduct(product)
    setGuestCount(1)
    setTourDate('')
  }

  const closePaymentModal = () => {
    setSelectedProduct(null)
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
                        <th className="py-4 px-6 text-right font-bold">예약</th>
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
                              <FaCreditCard size={14} />
                              예약/결제
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
          <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-slate-950 shadow-2xl">
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

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-sm font-bold text-slate-200">투어 날짜</span>
                  <input
                    type="date"
                    min={bookingStartDate}
                    max={bookingEndDate}
                    value={tourDate}
                    onChange={(event) => setTourDate(event.currentTarget.value)}
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition focus:border-parks-gold"
                  />
                  <span className="mt-2 block text-xs text-slate-500">오늘부터 3개월 이내 날짜만 선택 가능합니다.</span>
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-bold text-slate-200">인원</span>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={guestCount}
                    onChange={(event) => setGuestCount(Math.max(1, Number(event.currentTarget.value) || 1))}
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition focus:border-parks-gold"
                  />
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
                onClick={() => {
                  alert('온라인 결제 연동 준비 화면입니다. 심사 완료 후 실제 결제 화면으로 전환됩니다.')
                }}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-parks-gold px-5 py-4 text-base font-black text-ocean-dark transition hover:bg-white"
              >
                <FaCreditCard />
                예약 결제 진행
              </button>

              <p className="text-center text-xs text-slate-500">
                결제 전 이용약관 및 환불정책을 확인해주세요.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default BranchPage
