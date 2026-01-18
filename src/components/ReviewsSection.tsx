import React from 'react'
import { FaStar } from 'react-icons/fa'
import StarRating from './common/StarRating'
import type { Review } from '../types'

const ReviewsSection: React.FC = () => {
  const reviews: Review[] = [
    {
      id: 'tnsd',
      username: 'tnsd****',
      rating: 5,
      text: '처음 체험 다이빙 하는 거라 걱정이 많았는데 정말 너무 친절하시고 물속에서도 계속 신경 써주셔서 너무 감사했어요! 1인 60만원 내고 온 친구 말로는 40분밖에 못했다고 하던데 여기는 1시간 정도를 물 속에서 있었어요..!',
    },
    {
      id: 'wnsg',
      username: 'wnsg****',
      rating: 5,
      text: '인원이 많아서 걱정을 많이했는데 정말 한 명 한 명 신경 써주시고 안전에 대해 철저히 챙겨주셔서 너무나도 즐겁고 안전하게 다녀올 수 있었습니다!! 가격도 타업체 대비 저렴한데 시간도 더 오래 할 수 있고 정말 최고였습니다!',
    },
    {
      id: 'girwns',
      username: 'girwns****',
      rating: 5,
      text: '세부 패키지 여행 중 다이빙 따로 예약 하고 가족들이랑 같이 했는데 너무 좋았어요. 물 속에서 찍어주신 사진도 너무 예쁘고 시간도 넉넉하게 줘서 충분히 즐길 수 있었습니다. 다음에 또 세부 오면 여기서 할게요!',
    },
    {
      id: 'lej1',
      username: 'lej1****',
      rating: 5,
      text: '여행 일정 중 가장 기대했던 다이빙이었는데 기대 이상이었습니다! 강사님들 정말 친절하시고 안전하게 잘 케어해주셨어요. 물 속 세상이 정말 아름다워서 시간 가는 줄 몰랐습니다. 최고였습니다!!',
    },
  ]

  return (
    <section className="relative overflow-hidden bg-ocean-dark py-20 md:py-32">
      {/* Decorative Background */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-ocean-teal/20 rounded-full blur-[100px]"></div>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <div className="mb-6 inline-block">
            <span className="inline-block rounded-full bg-white/5 px-6 py-2 font-display text-sm font-semibold text-parks-gold backdrop-blur-md border border-white/10">
              고객님들이 증명하는
            </span>
          </div>
          <h2 className="mb-6 font-display text-5xl font-bold text-white md:text-6xl lg:text-7xl tracking-tight">
            후기{' '}
            <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-ocean-teal to-ocean-accent">
              맛집!
            </span>
          </h2>
          <div className="mt-6 flex flex-col items-center justify-center gap-3">
            <div className="flex items-center gap-2">
              <StarRating rating={5} />
              <span className="font-display text-4xl font-bold text-white">5.0</span>
            </div>
            <p className="font-body text-slate-400">
              누적 <span className="text-parks-gold font-semibold">1,000명 이상</span>의 고객 인증
            </p>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:gap-8">
          {reviews.map((review, index) => (
            <div
              key={review.id}
              className="glass-card group relative transform rounded-3xl p-8 transition-all duration-500 hover:-translate-y-2 hover:bg-white/10 md:p-10"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Quote Mark */}
              <div className="absolute top-6 right-8 font-serif text-6xl text-white/5 leading-none">"</div>

              <div className="relative">
                <div className="mb-5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-ocean-teal to-blue-500 flex items-center justify-center text-white font-bold text-sm">
                      {review.username[0].toUpperCase()}
                    </div>
                    <span className="font-display text-lg font-bold text-white">{review.username}</span>
                  </div>
                  <StarRating rating={review.rating} />
                </div>
                <p className="font-body leading-relaxed text-slate-300 text-base md:text-lg">{review.text}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Trust Badge */}
        <div className="mt-16 text-center">
          <div className="inline-flex flex-wrap items-center justify-center gap-4 rounded-full bg-white/5 px-8 py-4 backdrop-blur-sm border border-white/10">
            <span className="font-body text-base font-semibold text-slate-200 md:text-lg flex items-center gap-2">
              <FaStar className="text-xl text-parks-gold" />
              네이버 리뷰 평점 4.9
            </span>
            <span className="text-slate-600">|</span>
            <span className="font-body text-base font-semibold text-slate-200 md:text-lg flex items-center gap-2">
              <FaStar className="text-xl text-parks-gold" />
              구글 리뷰 평점 5.0
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ReviewsSection
