import React, { useRef, useState, useEffect } from 'react'
import { useLocation, useSearchParams } from 'react-router-dom'
import { DIVING_LOCATIONS } from '../data/diving-locations'
import { REVIEW_DATA } from '../data/reviewData'
import { PRICING_DATA } from '../data/pricingData'
import { CenterId } from '../types/center.types'
// Note: Tabs are now managed by the Navigation component in Tier 2

const BranchPage: React.FC = () => {
  const { pathname } = useLocation()
  const [searchParams] = useSearchParams()
  const activeTab = searchParams.get('tab') || 'intro'
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

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
    return <div className="pt-24 text-center text-white">지점을 찾을 수 없습니다.</div>
  }

  const gallery = BRANCH_GALLERIES[currentBranch.id]

  return (
    <div className="pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Branch Header */}
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-4">
            <span className="text-4xl">{currentBranch.icon}</span>
            <span className="text-sm font-bold text-parks-gold uppercase tracking-widest">
              {pathname.split('/')[1]}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
            {currentBranch.nameKo} ({currentBranch.name})
          </h1>
          {currentBranch.id === 'bali' && (
            <p className="text-parks-gold font-medium">발리에는 4개의 지점이 운영되고 있습니다.</p>
          )}
        </div>

        {/* Content Area (Tabs are in the Navigation bar) */}

        {/* Tab Content */}
        <div className="min-h-[400px]">
          {activeTab === 'intro' && (
            <div className="animate-fade-in space-y-8">
              <div className="glass-card p-8 rounded-2xl border border-white/10">
                <h3 className="text-2xl font-bold text-white mb-4">지점 특징 및 갤러리</h3>
                <p className="text-slate-400 leading-relaxed mb-6">
                  {currentBranch.nameKo}의 멋진 다이빙 스팟과 시설을 소개합니다. (상세 내용은 추후 업데이트 예정)
                </p>

                <div className="relative group">
                  <div
                    ref={scrollContainerRef}
                    className="flex overflow-x-auto gap-4 pb-6 scrollbar-hide snap-x snap-mandatory"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                  >
                    {gallery && gallery.length > 0 ? (
                      gallery.map((item, index) => (
                        <div key={index} className="flex-none w-full md:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-0.67rem)] aspect-video bg-white/5 rounded-xl border border-white/5 overflow-hidden snap-start">
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
                          Photo Placeholder
                        </div>
                        <div className="flex-none w-full md:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-0.67rem)] aspect-video bg-white/5 rounded-xl border border-white/5 flex items-center justify-center text-slate-600 font-medium snap-start">
                          Photo Placeholder
                        </div>
                        <div className="flex-none w-full md:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-0.67rem)] aspect-video bg-white/5 rounded-xl border border-white/5 flex items-center justify-center text-slate-600 font-medium snap-start">
                          Video Placeholder
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
                            ? 'opacity-0 group-hover:opacity-100 hover:bg-parks-gold hover:text-black cursor-pointer'
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
                            ? 'opacity-0 group-hover:opacity-100 hover:bg-parks-gold hover:text-black cursor-pointer'
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
            <div className="animate-fade-in space-y-8">
              <div className="glass-card p-8 rounded-2xl border border-white/10">
                <h3 className="text-2xl font-bold text-white mb-4">투어 일정 및 옵션 별 가격</h3>
                <p className="text-slate-400 leading-relaxed mb-6">
                  {currentBranch.nameKo}의 투어 프로그램 가격표입니다. (2025년 기준)
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-left bg-white/5 rounded-xl overflow-hidden">
                    <thead>
                      <tr className="bg-white/10 text-white">
                        <th className="py-4 px-6 font-bold">프로그램</th>
                        <th className="py-4 px-6 text-right font-bold text-slate-300">예약금 (KRW)</th>
                        <th className="py-4 px-6 text-right font-bold text-parks-gold">현지지불 (KRW)</th>
                      </tr>
                    </thead>
                    <tbody className="text-slate-300 divide-y divide-white/5">
                      {PRICING_DATA[currentBranch.id as CenterId]?.map((item, index) => (
                        <tr key={index} className="hover:bg-white/5 transition-colors">
                          <td className="py-4 px-6 font-medium">{item.program}</td>
                          <td className="py-4 px-6 text-right tabular-nums text-slate-400">
                            {item.deposit > 0 ? `₩${item.deposit.toLocaleString()}` : '-'}
                          </td>
                          <td className="py-4 px-6 text-right tabular-nums text-parks-gold font-bold">
                            ₩{item.balance.toLocaleString()}
                          </td>
                        </tr>
                      )) || (
                          <tr>
                            <td colSpan={3} className="py-8 text-center text-slate-500 italic">
                              가격 정보가 준비 중입니다.
                            </td>
                          </tr>
                        )}
                    </tbody>
                  </table>
                </div>
                <div className="mt-6 p-4 bg-parks-gold/10 border border-parks-gold/20 rounded-lg">
                  <p className="text-sm text-parks-gold/90">
                    * 예약금은 계좌 입금, 잔금은 현지에서 지불해주시면 됩니다.<br />
                    * 포함 내역: 다이빙 장비 렌탈, 중식 포함 (체험/펀 다이빙 기준)
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="animate-fade-in space-y-8">
              <div className="glass-card p-8 rounded-2xl border border-white/10">
                <h3 className="text-2xl font-bold text-white mb-4">리뷰</h3>
                <p className="text-slate-400 leading-relaxed mb-6">
                  {currentBranch.nameKo}의 생생한 실제 이용 후기입니다.
                </p>

                {(() => {
                  const reviews = REVIEW_DATA[currentBranch.id as CenterId] || []

                  return (
                    <div className="relative group">
                      <div
                        ref={scrollContainerRef}
                        className="flex overflow-x-auto gap-4 pb-6 scrollbar-hide snap-x snap-mandatory"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                      >
                        {reviews.length > 0 ? (
                          reviews.map((review, i) => (
                            <div key={i} className="flex-none w-[85vw] md:w-[400px] bg-white/5 rounded-xl border border-white/5 p-6 break-keep snap-start flex flex-col h-[300px]">
                              <div className="flex justify-between items-start mb-4">
                                <span className="text-xs text-slate-500 font-medium">Registered Review</span>
                                <div className="text-parks-gold flex gap-1 text-sm">
                                  {Array.from({ length: 5 }).map((_, i) => (
                                    <span key={i}>⭐</span>
                                  ))}
                                </div>
                              </div>
                              <p className="text-slate-300 text-sm leading-relaxed flex-1 overflow-y-auto custom-scrollbar">{review}</p>
                            </div>
                          ))
                        ) : (
                          <div className="w-full text-center text-slate-500 italic py-12">
                            등록된 리뷰가 없습니다.
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
                                ? 'opacity-0 group-hover:opacity-100 hover:bg-parks-gold hover:text-black cursor-pointer'
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
                                ? 'opacity-0 group-hover:opacity-100 hover:bg-parks-gold hover:text-black cursor-pointer'
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
    </div>
  )
}

export default BranchPage
