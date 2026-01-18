import React from 'react'

const WhyUsSection = () => {
  const features = [
    {
      icon: '📉',
      title: '올 인클루시브 다이빙',
      highlight: '(추가금 X)',
      description: '장비 렌탈, 막탄내 픽드랍, 전 일정 보트 다이빙, 점심 한식, 환경세, 입장료, 수중 사진 영상 촬영 등',
      highlight2: '모든 비용이 포함',
      highlight3: '되어 추가 비용이 없습니다!',
    },
    {
      icon: '⏰',
      title: '1회 다이빙시',
      highlight: '최소 35분 이상',
      description: '사진만 찍기 위한 다이빙이 아닌 "진짜" 다이빙 투어를 진행합니다.',
      highlight2: '1회 다이빙시 35분 ~ 45분',
      highlight3: '의 다이빙 타임이며, 2회시 1시간 20분 이상 다이빙',
    },
    {
      icon: '🌍',
      title: '전세계 4개 지점',
      highlight: '다이빙 샵 운영',
      description: '',
      highlight2: '고객 만족도 1위, 재구매율 1위',
      highlight3: '다이빙샵을 운영하여 소중한 여행을 저희에게 맡겨주세요!!',
    },
    {
      icon: '⭐',
      title: 'PADI 5 Star',
      highlight: '다이빙샵',
      description: '수많은 다이빙샵 중 강사진, 다이빙샵의 시설, 안전한 투어 진행 등을',
      highlight2: '종합하여 선정되는 PADI 5 Star Diving Shop',
      highlight3: '입니다!',
    },
  ]

  const inclusiveItems = [
    { name: '무료 픽드랍 제공', icon: '🚗', isFree: true },
    { name: '점심 식사', icon: '🍽️', isFree: true },
    { name: '수중 촬영 제공', icon: '📷', isFree: true },
    { name: '다이빙 장비 풀렌탈', icon: '🤿', isFree: true },
    { name: '체험다이빙 매뉴얼 (한국어)', icon: '📋', isFree: true },
    { name: '환경세, 입장료 무료', icon: '🎫', isFree: true },
  ]

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 to-ocean-dark py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <div className="mb-4 inline-block rounded-full bg-parks-gold/10 border border-parks-gold/20 px-6 py-2 text-sm font-bold text-parks-gold">
            올 인클루시브 다이빙 투어!
          </div>
          <h2 className="mb-6 text-4xl font-display font-bold text-white md:text-5xl lg:text-6xl">
            Why us?
          </h2>
          <p className="text-xl font-light text-slate-300 md:text-2xl">
            <span className="font-semibold text-white">Parks 로컬 다이빙</span>과 함께 해야하는 이유
          </p>
        </div>

        {/* Features Grid */}
        <div className="mb-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <div
              key={index}
              className="glass-card transform rounded-2xl p-6 transition-all duration-300 hover:scale-105 hover:bg-white/10"
            >
              <div className="mb-4 flex items-center gap-3">
                <span className="text-4xl filter drop-shadow-lg">{feature.icon}</span>
              </div>
              <h3 className="mb-2 text-xl font-bold text-white">
                {feature.title}
              </h3>
              <p className="mb-3 text-lg font-bold text-parks-gold">
                {feature.highlight}
              </p>
              {feature.description && (
                <p className="mb-2 text-sm leading-relaxed text-slate-400">
                  {feature.description}
                </p>
              )}
              <p className="text-sm leading-relaxed">
                <span className="font-bold text-parks-gold">{feature.highlight2}</span>
                <span className="text-slate-400">{feature.highlight3}</span>
              </p>
            </div>
          ))}
        </div>

        {/* All-Inclusive Items */}
        <div className="glass-card rounded-3xl p-8 md:p-12 relative overflow-hidden">
          {/* Glow effect */}
          <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-ocean-teal/20 rounded-full blur-[80px]"></div>

          <h3 className="mb-8 text-center text-2xl font-display font-bold text-white md:text-3xl relative z-10">
            올 인클루시브 다이빙 투어 포함 사항
          </h3>
          <p className="mb-8 text-center text-lg text-slate-300 relative z-10">
            투어는 1년 365일 운영하고 있습니다.
            <br />
            <span className="font-bold text-parks-gold">주말/추석/설날/공휴일도 운영됩니다!!</span>
          </p>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 relative z-10">
            {inclusiveItems.map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/5 p-4 hover:bg-white/10 transition-colors"
              >
                <span className="text-3xl">{item.icon}</span>
                <div className="flex-1">
                  <p className="font-semibold text-white">{item.name}</p>
                  <p className="text-sm font-bold text-parks-gold">무료</p>
                </div>
              </div>
            ))}
          </div>

          {/* Additional Info */}
          <div className="mt-8 rounded-xl bg-ocean-dark/50 border border-white/5 p-6 relative z-10">
            <h4 className="mb-3 font-bold text-white">투어 불포함사항:</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>• 모든 비용이 포함되어 불포함사항이 없습니다!!</li>
              <li>• 택시 대신 전원 무료 픽드랍을 제공하며, 투어 후 호텔까지 안전하게 모셔다 드립니다!</li>
            </ul>
          </div>
        </div>

        {/* Tour Package Highlights */}
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl bg-gradient-to-br from-parks-gold/20 to-parks-gold/5 border border-parks-gold/20 p-8 shadow-lg backdrop-blur-sm">
            <h3 className="mb-4 text-2xl font-bold text-parks-gold">투어 포함 사항</h3>
            <ul className="space-y-3 text-slate-200">
              <li className="flex items-start gap-2">
                <span className="mt-1 text-parks-gold">✓</span>
                <span>POINT #1: 고래상어를 만날 수 있는 오슬롭 또는 세부의 숨겨진 보석</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 text-parks-gold">✓</span>
                <span>POINT #2: 거북이와 함께 수영할 수 있는 아포섬</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 text-parks-gold">✓</span>
                <span>물고기 떼와 산호초가 아름다운 다이빙 포인트</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 text-parks-gold">✓</span>
                <span>전문 강사진의 안전한 가이드</span>
              </li>
            </ul>
          </div>

          <div className="rounded-2xl bg-gradient-to-br from-ocean-teal/20 to-ocean-blue/5 border border-ocean-teal/20 p-8 shadow-lg backdrop-blur-sm">
            <h3 className="mb-4 text-2xl font-bold text-ocean-teal">안전 & 품질 보장</h3>
            <ul className="space-y-3 text-slate-200">
              <li className="flex items-start gap-2">
                <span className="mt-1">🏆</span>
                <span>2,000회 이상 다이빙 경력의 전문 가이드</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1">🚤</span>
                <span>10인승 넓은 보트로 편안한 이동</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1">🛡️</span>
                <span>최신 안전 장비 완비</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1">📸</span>
                <span>수중 촬영 고프로 영상 무료 제공</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

export default WhyUsSection
