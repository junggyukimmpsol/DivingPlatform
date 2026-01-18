import React from 'react'
import { FaCamera, FaVideo, FaUserFriends, FaCheckCircle, FaGift, FaTrophy, FaStar, FaUsers, FaGlobeAsia, FaPercent } from 'react-icons/fa'

const EventsSection = () => {
  const events = [
    {
      icon: FaCamera,
      title: '포토 리뷰 이벤트 1',
      description: '사진 리뷰 1개당',
      highlight: '네이버 포인트 1000원',
      highlightText: '지급',
      bgColor: 'from-cyan-400 to-blue-500',
    },
    {
      icon: FaVideo,
      title: '포토 리뷰 이벤트 2',
      description: '다이빙 투어중 최신',
      highlight: '고프로 사진 약 50개 및 영상 약 5개',
      highlightText: '를 무료로 공유드립니다!',
      bgColor: 'from-blue-500 to-blue-600',
    },
    {
      icon: FaUserFriends,
      title: '처음이어도 함께하는 연인/친구 다이빙',
      description: '자격증 소지자(펀 다이빙) + 자격증 미보유(체험 다이빙)',
      highlight: '함께 진행 가능',
      highlightText: '',
      bgColor: 'from-indigo-500 to-purple-600',
    },
  ]

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-ocean-dark to-slate-950 py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <div className="mb-4 inline-block rounded-full bg-parks-gold/10 border border-parks-gold/20 px-6 py-2 text-sm font-bold text-parks-gold">
            Only Parks 로컬 다이빙에서만
          </div>
          <h2 className="mb-6 text-4xl font-display font-bold text-white md:text-5xl lg:text-6xl">
            Special Event
          </h2>
          <p className="text-xl font-light text-slate-300 md:text-2xl">
            <span className="font-semibold text-white">Parks 로컬 다이빙</span>이 드리는 혜택
          </p>
        </div>

        {/* Events Grid */}
        <div className="mb-16 grid gap-8 md:grid-cols-3">
          {events.map((event, index) => (
            <div
              key={index}
              className="glass-card transform overflow-hidden rounded-2xl transition-all duration-300 hover:scale-105 hover:bg-white/10"
            >
              {/* Icon Section */}
              <div className={`bg-gradient-to-br ${event.bgColor} p-8 text-center bg-opacity-80 backdrop-blur-md`}>
                <div className="mb-4 text-6xl flex justify-center drop-shadow-lg">
                  <event.icon className="text-white" />
                </div>
                <h3 className="text-xl font-bold text-white font-display">{event.title}</h3>
              </div>

              {/* Content Section */}
              <div className="p-6">
                <p className="mb-4 text-center text-slate-300">{event.description}</p>
                <div className="rounded-lg bg-white/5 border border-white/10 p-4 text-center">
                  <p className="text-lg font-bold text-parks-gold">{event.highlight}</p>
                  {event.highlightText && (
                    <p className="text-sm font-semibold text-slate-400">{event.highlightText}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="glass-card rounded-3xl p-8 shadow-2xl md:p-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-ocean-teal/5 pointer-events-none"></div>

          <div className="text-center relative z-10">
            <h3 className="mb-6 text-3xl font-bold text-white md:text-4xl font-display">
              지금 바로 예약하세요!
            </h3>
            <p className="mb-8 text-lg text-slate-300">
              자격증이 없어도 <span className="font-bold text-ocean-teal">연인/친구와 함께 진행 가능</span>
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row mb-8">
              <a
                href="https://pf.kakao.com/_xhhbxcn"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full transform rounded-full bg-[#FEE500] px-8 py-4 text-lg font-bold text-[#3C1E1E] shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-[#FEE500]/50 sm:w-auto flex items-center justify-center gap-2"
              >
                카카오톡 문의하기
              </a>
              <a
                href="https://www.instagram.com/parks_local_diving"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full transform rounded-full bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 px-8 py-4 text-lg font-bold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-pink-500/50 sm:w-auto flex items-center justify-center gap-2"
              >
                인스타그램 DM
              </a>
            </div>

            {/* Additional Benefits */}
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-xl bg-white/5 border border-white/10 p-4 hover:bg-white/10 transition-colors">
                <FaCheckCircle className="mb-2 text-2xl text-ocean-teal mx-auto" />
                <p className="font-semibold text-white">즉시 예약 확정</p>
                <p className="text-sm text-slate-400">24시간 내 답변</p>
              </div>
              <div className="rounded-xl bg-white/5 border border-white/10 p-4 hover:bg-white/10 transition-colors">
                <FaGift className="mb-2 text-2xl text-parks-gold mx-auto" />
                <p className="font-semibold text-white">특별 할인 제공</p>
                <p className="text-sm text-slate-400">단체 예약 시 추가 할인</p>
              </div>
              <div className="rounded-xl bg-white/5 border border-white/10 p-4 hover:bg-white/10 transition-colors">
                <FaTrophy className="mb-2 text-2xl text-yellow-500 mx-auto" />
                <p className="font-semibold text-white">만족도 보장</p>
                <p className="text-sm text-slate-400">5점 만점 리뷰 인증</p>
              </div>
            </div>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mt-12 text-center">
          <div className="inline-flex flex-wrap items-center justify-center gap-6 rounded-2xl bg-white/5 border border-white/10 p-6 backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <FaStar className="text-2xl text-parks-gold" />
              <span className="font-bold text-white">PADI 5 Star</span>
            </div>
            <div className="h-6 w-px bg-white/20"></div>
            <div className="flex items-center gap-2">
              <FaUsers className="text-2xl text-white" />
              <span className="font-bold text-white">1,000+ 고객</span>
            </div>
            <div className="h-6 w-px bg-white/20"></div>
            <div className="flex items-center gap-2">
              <FaGlobeAsia className="text-2xl text-white" />
              <span className="font-bold text-white">4개 지점</span>
            </div>
            <div className="h-6 w-px bg-white/20"></div>
            <div className="flex items-center gap-2">
              <FaPercent className="text-2xl text-white" />
              <span className="font-bold text-white">최저가 보장</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default EventsSection
