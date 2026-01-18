import React from 'react'

const LocationsSection = () => {
  const locations = [
    {
      number: '1호점',
      name: 'Cebu',
      nameKo: '세부',
      description: '고객 만족도 1위 다이빙 샵',
      features: ['콘티키 포인트', '울랑고 섬', '힐루통안'],
      color: 'from-blue-500 to-blue-700',
    },
    {
      number: '2호점',
      name: 'Bohol',
      nameKo: '보홀',
      description: '발리캐식이 있는 최고의 포인트',
      features: ['발리캐식', '팡라오', '발리볼'],
      color: 'from-purple-500 to-purple-700',
    },
    {
      number: '3호점',
      name: 'Kota Kinabalu',
      nameKo: '코타키나발루',
      description: '다양한 해양생물과 아름다운 바다',
      features: ['투나부 베이', '사피 섬', '마무틱 섬'],
      color: 'from-emerald-500 to-emerald-700',
    },
    {
      number: '4호점',
      name: 'Bali',
      nameKo: '발리',
      description: '만타가오리와 몰라몰라의 성지',
      features: ['만타 베이', '누사두아', '투람벤'],
      color: 'from-orange-500 to-orange-700',
    },
  ]

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-ocean-dark to-slate-950 py-16 md:py-24">
      {/* Decorative Background */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute left-0 top-0 h-[600px] w-[600px] rounded-full bg-ocean-accent/10 blur-[120px]"></div>
        <div className="absolute bottom-0 right-0 h-[800px] w-[800px] rounded-full bg-ocean-teal/10 blur-[120px]"></div>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <div className="mb-4 inline-block rounded-full bg-ocean-teal/10 border border-ocean-teal/20 px-6 py-2 text-sm font-bold text-ocean-teal">
            PADI 5 Star 공식 리조트
          </div>
          <h2 className="mb-6 text-4xl font-display font-bold text-white md:text-5xl lg:text-6xl">
            Parks 로컬 다이빙 지점
          </h2>
          <p className="text-xl font-light text-slate-300 md:text-2xl">
            <span className="font-semibold text-parks-gold">전세계 4개 지점</span> 다이빙 샵 운영
          </p>
          <p className="mt-4 text-lg text-slate-400">
            고객 만족도 1위, 재구매율 1위 다이빙샵을
            <br />
            운영하여 소중한 여행을 저희에게 맡겨주세요!!
          </p>
        </div>

        {/* Locations Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {locations.map((location, index) => (
            <div
              key={index}
              className="glass-card group transform rounded-2xl p-6 transition-all duration-300 hover:scale-105 hover:bg-white/10 border border-white/5"
            >
              {/* Branch Number Badge */}
              <div className={`mb-4 inline-block rounded-full bg-gradient-to-r ${location.color} px-4 py-1 text-sm font-bold text-white shadow-lg`}>
                {location.number}
              </div>

              {/* Location Name */}
              <h3 className="mb-2 text-3xl font-display font-bold text-white">
                {location.name}
              </h3>
              <p className="mb-4 text-xl font-medium text-slate-300">
                {location.nameKo}
              </p>

              {/* Description */}
              <p className="mb-6 text-sm text-slate-400 border-b border-white/10 pb-4">{location.description}</p>

              {/* Features */}
              <div className="space-y-2">
                {location.features.map((feature, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2"
                  >
                    <span className="text-ocean-teal">📍</span>
                    <span className="text-sm font-medium text-slate-300">{feature}</span>
                  </div>
                ))}
              </div>

              {/* PADI Badge */}
              <div className="mt-6 rounded-lg bg-white/5 border border-white/10 p-3 text-center transition-colors group-hover:bg-white/10">
                <div className="flex items-center justify-center gap-2">
                  <span className="text-2xl drop-shadow-md">⭐</span>
                  <div className="text-left">
                    <p className="text-xs font-semibold text-ocean-teal">PADI</p>
                    <p className="text-sm font-bold text-parks-gold">5 Star Diving Shop</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 grid gap-6 md:grid-cols-3">
          <div className="glass-card rounded-2xl p-6 text-center hover:bg-white/5 transition-colors">
            <div className="mb-3 text-4xl filter drop-shadow-lg">🏆</div>
            <h4 className="mb-2 text-2xl font-bold text-white">2,000회+</h4>
            <p className="text-slate-400">누적 다이빙 투어</p>
          </div>
          <div className="glass-card rounded-2xl p-6 text-center hover:bg-white/5 transition-colors">
            <div className="mb-3 text-4xl filter drop-shadow-lg">👥</div>
            <h4 className="mb-2 text-2xl font-bold text-white">1,000명+</h4>
            <p className="text-slate-400">만족한 고객</p>
          </div>
          <div className="glass-card rounded-2xl p-6 text-center hover:bg-white/5 transition-colors">
            <div className="mb-3 text-4xl filter drop-shadow-lg">⭐</div>
            <h4 className="mb-2 text-2xl font-bold text-white">5.0/5.0</h4>
            <p className="text-slate-400">고객 만족도</p>
          </div>
        </div>

        {/* Map Visualization Hint */}
        <div className="mt-12 text-center">
          <p className="text-lg text-ocean-teal font-medium tracking-wide">
            아시아 최고의 다이빙 포인트에서 여러분을 기다립니다
          </p>
        </div>
      </div>
    </section>
  )
}

export default LocationsSection
