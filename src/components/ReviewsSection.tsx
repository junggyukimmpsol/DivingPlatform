import React, { useState, useEffect, useRef } from 'react'
import { FaStar, FaQuoteLeft, FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import StarRating from './common/StarRating'
import { useLanguage } from '../contexts/LanguageContext'

const ReviewsSection: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const containerRef = useRef<HTMLDivElement>(null)
  const { t } = useLanguage()

  const reviews = t.reviews.reviews

  // Auto-play carousel
  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % reviews.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [isAutoPlaying, reviews.length])

  const goToPrev = () => {
    setIsAutoPlaying(false)
    setActiveIndex((prev) => (prev - 1 + reviews.length) % reviews.length)
  }

  const goToNext = () => {
    setIsAutoPlaying(false)
    setActiveIndex((prev) => (prev + 1) % reviews.length)
  }

  const goToIndex = (index: number) => {
    setIsAutoPlaying(false)
    setActiveIndex(index)
  }

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-ocean-dark via-slate-950 to-ocean-dark py-20 md:py-32">
      {/* Decorative Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-0 w-[600px] h-[600px] bg-gradient-radial from-purple-500/10 via-purple-500/5 to-transparent rounded-full blur-[80px]"></div>
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-gradient-radial from-ocean-teal/10 via-ocean-teal/5 to-transparent rounded-full blur-[80px]"></div>
        <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-gradient-radial from-parks-gold/5 via-parks-gold/2 to-transparent rounded-full blur-[60px]"></div>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <div className="mb-6 inline-block animate-fade-up">
            <span className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-parks-gold/10 to-transparent border border-parks-gold/20 px-6 py-2.5 backdrop-blur-sm">
              <FaStar className="text-parks-gold animate-pulse" />
              <span className="font-body text-sm font-semibold tracking-wider text-parks-gold uppercase">
                {t.reviews.badge}
              </span>
            </span>
          </div>

          <h2 className="mb-6 font-display text-4xl font-bold text-white md:text-5xl lg:text-6xl tracking-tight animate-fade-up" style={{ animationDelay: '0.1s' }}>
            {t.reviews.title}{' '}
            <span className="relative inline-block">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-ocean-teal via-cyan-300 to-ocean-accent">
                {t.reviews.titleHighlight}
              </span>
              <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 12" fill="none">
                <path d="M2 10C50 2 150 2 198 10" stroke="url(#underline-gradient)" strokeWidth="3" strokeLinecap="round"/>
                <defs>
                  <linearGradient id="underline-gradient" x1="0" y1="0" x2="200" y2="0">
                    <stop offset="0%" stopColor="#2DD4BF" stopOpacity="0"/>
                    <stop offset="50%" stopColor="#2DD4BF"/>
                    <stop offset="100%" stopColor="#0EA5E9" stopOpacity="0"/>
                  </linearGradient>
                </defs>
              </svg>
            </span>
          </h2>

          {/* Rating Display */}
          <div className="mt-8 flex flex-col items-center justify-center gap-4 animate-fade-up" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className="text-2xl md:text-3xl text-parks-gold drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]" />
                ))}
              </div>
              <span className="font-display text-4xl md:text-5xl font-bold text-white">5.0</span>
            </div>
            <p className="font-body text-slate-400">
              {t.reviews.ratingText} <span className="text-parks-gold font-semibold">{t.reviews.ratingHighlight}</span>{t.reviews.ratingEnd}
            </p>
          </div>
        </div>

        {/* Featured Review Carousel */}
        <div className="relative mb-12">
          {/* Navigation Arrows */}
          <button
            onClick={goToPrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-20 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white transition-all hover:bg-white/20 hover:scale-110 hidden md:flex"
            aria-label={t.reviews.prevReview}
          >
            <FaChevronLeft />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-20 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white transition-all hover:bg-white/20 hover:scale-110 hidden md:flex"
            aria-label={t.reviews.nextReview}
          >
            <FaChevronRight />
          </button>

          {/* Carousel Container */}
          <div
            ref={containerRef}
            className="relative overflow-hidden rounded-3xl"
          >
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${activeIndex * 100}%)` }}
            >
              {reviews.map((review, index) => (
                <div
                  key={review.id}
                  className="w-full flex-shrink-0 px-4 md:px-8"
                >
                  <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white/[0.08] to-white/[0.02] border border-white/10 p-8 md:p-12 backdrop-blur-sm">
                    {/* Quote Icon */}
                    <div className="absolute top-6 left-8 text-white/5">
                      <FaQuoteLeft className="text-6xl md:text-8xl" />
                    </div>

                    {/* Decorative gradient */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-radial from-ocean-teal/10 to-transparent rounded-full blur-[60px]"></div>

                    <div className="relative z-10">
                      {/* User Info */}
                      <div className="flex items-center gap-4 mb-6">
                        <div className="relative">
                          <div className="absolute inset-0 bg-gradient-to-br from-ocean-teal to-blue-500 rounded-full blur-md opacity-50"></div>
                          <div className="relative h-14 w-14 rounded-full bg-gradient-to-br from-ocean-teal to-blue-500 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                            {review.username[0].toUpperCase()}
                          </div>
                        </div>
                        <div>
                          <p className="font-display text-xl font-bold text-white">{review.username}</p>
                          <div className="flex items-center gap-1 mt-1">
                            <StarRating rating={review.rating} />
                          </div>
                        </div>
                      </div>

                      {/* Review Text */}
                      <p className="font-body text-lg md:text-xl leading-relaxed text-slate-200">
                        "{review.text}"
                      </p>

                      {/* Verified Badge */}
                      <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-green-500/10 border border-green-500/20 px-4 py-2">
                        <span className="text-green-400 text-sm">✓</span>
                        <span className="text-sm font-medium text-green-400">{t.reviews.verifiedBadge}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pagination Dots */}
          <div className="flex justify-center gap-2 mt-6">
            {reviews.map((_, index) => (
              <button
                key={index}
                onClick={() => goToIndex(index)}
                className={`transition-all duration-300 rounded-full ${
                  activeIndex === index
                    ? 'w-8 h-2 bg-parks-gold'
                    : 'w-2 h-2 bg-white/30 hover:bg-white/50'
                }`}
                aria-label={t.reviews.goToReview.replace('{index}', String(index + 1))}
              />
            ))}
          </div>
        </div>

        {/* Review Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {t.reviews.stats.map((stat, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-2xl bg-white/5 border border-white/10 p-6 text-center backdrop-blur-sm transition-all duration-300 hover:bg-white/10 hover:border-white/20"
            >
              <span className="text-3xl mb-2 block">{stat.icon}</span>
              <p className="font-display text-2xl md:text-3xl font-bold text-white mb-1">{stat.value}</p>
              <p className="text-sm text-slate-400">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Platform Reviews */}
        <div className="flex flex-wrap items-center justify-center gap-6">
          <a
            href="#"
            className="group flex items-center gap-3 rounded-2xl bg-white/5 border border-white/10 px-6 py-4 backdrop-blur-sm transition-all duration-300 hover:bg-white/10 hover:border-white/20 hover:scale-105"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-500/20">
              <span className="text-2xl">N</span>
            </div>
            <div className="text-left">
              <p className="text-sm text-slate-400">{t.reviews.platforms.naver.label}</p>
              <p className="font-display text-lg font-bold text-white flex items-center gap-1">
                <FaStar className="text-parks-gold" />
                {t.reviews.platforms.naver.rating}
              </p>
            </div>
          </a>

          <a
            href="#"
            className="group flex items-center gap-3 rounded-2xl bg-white/5 border border-white/10 px-6 py-4 backdrop-blur-sm transition-all duration-300 hover:bg-white/10 hover:border-white/20 hover:scale-105"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/20">
              <span className="text-2xl">G</span>
            </div>
            <div className="text-left">
              <p className="text-sm text-slate-400">{t.reviews.platforms.google.label}</p>
              <p className="font-display text-lg font-bold text-white flex items-center gap-1">
                <FaStar className="text-parks-gold" />
                {t.reviews.platforms.google.rating}
              </p>
            </div>
          </a>

          <a
            href="https://www.instagram.com/parks_local_diving"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-3 rounded-2xl bg-white/5 border border-white/10 px-6 py-4 backdrop-blur-sm transition-all duration-300 hover:bg-white/10 hover:border-white/20 hover:scale-105"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20">
              <span className="text-2xl">📸</span>
            </div>
            <div className="text-left">
              <p className="text-sm text-slate-400">{t.reviews.platforms.instagram.label}</p>
              <p className="font-display text-lg font-bold text-white">
                {t.reviews.platforms.instagram.handle}
              </p>
            </div>
          </a>
        </div>
      </div>
    </section>
  )
}

export default ReviewsSection
