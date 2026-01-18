import React from 'react'

const TimelineSection = () => {
  const schedules = [
    {
      type: '2회 다이빙',
      timeline: [
        { time: '08:00', activity: '막탄내 호텔 픽업', icon: '🚗' },
        { time: '09:00', activity: '다이빙 교육', icon: '📚' },
        { time: '10:00', activity: '1번째 보트 (체험) 다이빙', icon: '🤿' },
        { time: '12:00', activity: '점심 식사', icon: '🍽️' },
        { time: '13:00', activity: '2번째 보트 (체험) 다이빙', icon: '🤿' },
        { time: '14:30', activity: '2회 다이빙 완성 후 호텔 드랍', icon: '🏨' },
      ],
    },
    {
      type: '3회 다이빙',
      timeline: [
        { time: '08:00', activity: '막탄내 호텔 픽업', icon: '🚗' },
        { time: '09:00', activity: '다이빙 교육', icon: '📚' },
        { time: '10:00', activity: '1번째 보트 (체험) 다이빙', icon: '🤿' },
        { time: '11:00', activity: '2번째 보트 (체험) 다이빙', icon: '🤿' },
        { time: '12:00', activity: '점심 식사', icon: '🍽️' },
        { time: '13:00', activity: '3번째 보트 (체험) 다이빙', icon: '🤿' },
        { time: '14:30', activity: '3회 다이빙 완성 후 호텔 드랍', icon: '🏨' },
      ],
    },
  ]

  const divingPoints = {
    cebu: [
      { name: '콘티키 (Kontiki)', description: '난파선 포인트' },
      { name: '울랑고 섬', description: '거북이와 수영' },
      { name: '힐루통안', description: '정어리 떼 관찰' },
    ],
    bohol: [
      { name: '발리캐식', description: '만타가오리 만남' },
      { name: '팡라오', description: '산호초 천국' },
      { name: '발리볼', description: '해양 생태계' },
    ],
    bali: [
      { name: '만타 베이 (Manta Bay)', description: '만타가오리 성지' },
      { name: '누사두아 (Nusa Dua)', description: '몰라몰라 관찰' },
      { name: '투람벤 (Tulamben)', description: 'USAT 리버티 난파선' },
    ],
  }

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-ocean-dark to-slate-950 py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <div className="mb-4 inline-block rounded-full bg-parks-gold/10 border border-parks-gold/20 px-6 py-2 text-sm font-bold text-parks-gold">
            하루 일정
          </div>
          <h2 className="mb-6 text-4xl font-display font-bold text-white md:text-5xl lg:text-6xl">
            다이빙 투어 일정
          </h2>
        </div>

        {/* Timeline Grid */}
        <div className="mb-16 grid gap-8 lg:grid-cols-2">
          {schedules.map((schedule, idx) => (
            <div key={idx} className="glass-card rounded-3xl p-8 shadow-2xl relative overflow-hidden">
              {/* Timeline Accent Line */}
              <div className="absolute left-[3.5rem] top-24 bottom-24 w-0.5 bg-white/10"></div>

              <h3 className="mb-8 text-center text-2xl font-bold text-white font-display">
                {schedule.type}
              </h3>
              <div className="space-y-6 relative z-10">
                {schedule.timeline.map((item, index) => (
                  <div key={index} className="flex items-start gap-4 group">
                    {/* Time Badge */}
                    <div className="flex-shrink-0 relative z-10">
                      <div className="flex h-16 w-16 flex-col items-center justify-center rounded-full bg-ocean-light border border-white/10 text-white shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:border-parks-gold/50">
                        <span className="text-xs font-semibold text-ocean-teal">{item.time}</span>
                      </div>
                    </div>

                    {/* Activity Card */}
                    <div className="flex-1">
                      <div className="rounded-xl bg-white/5 border border-white/5 p-4 transition-all duration-300 hover:bg-white/10 hover:border-white/10">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl filter drop-shadow-md">{item.icon}</span>
                          <p className="font-semibold text-slate-200">{item.activity}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Diving Points */}
        <div className="mb-12 text-center">
          <div className="mb-4 inline-block rounded-full bg-ocean-teal/10 border border-ocean-teal/20 px-6 py-2 text-sm font-bold text-ocean-teal">
            Dive Where?
          </div>
          <h2 className="mb-6 text-4xl font-bold text-white md:text-5xl font-display">
            다이빙 포인트 소개
          </h2>
          <p className="text-lg text-slate-300">
            각 지점마다 특별한 다이빙 포인트를 경험하실 수 있습니다
          </p>
        </div>

        {/* Points Grid */}
        <div className="grid gap-8 md:grid-cols-3">
          {/* Cebu Points */}
          <div className="glass-card rounded-2xl p-8 hover:bg-white/5 transition-colors">
            <div className="mb-6 text-center">
              <h3 className="mb-2 text-2xl font-bold text-ocean-teal font-display">세부 지점</h3>
              <p className="text-sm text-slate-500">Cebu Diving Points</p>
            </div>
            <div className="space-y-4">
              {divingPoints.cebu.map((point, idx) => (
                <div key={idx} className="rounded-lg bg-white/5 border border-white/5 p-4">
                  <h4 className="mb-1 font-bold text-white">{point.name}</h4>
                  <p className="text-sm text-slate-400">{point.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Bohol Points */}
          <div className="glass-card rounded-2xl p-8 hover:bg-white/5 transition-colors">
            <div className="mb-6 text-center">
              <h3 className="mb-2 text-2xl font-bold text-purple-400 font-display">보홀 지점</h3>
              <p className="text-sm text-slate-500">Bohol Diving Points</p>
            </div>
            <div className="space-y-4">
              {divingPoints.bohol.map((point, idx) => (
                <div key={idx} className="rounded-lg bg-white/5 border border-white/5 p-4">
                  <h4 className="mb-1 font-bold text-white">{point.name}</h4>
                  <p className="text-sm text-slate-400">{point.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Bali Points */}
          <div className="glass-card rounded-2xl p-8 hover:bg-white/5 transition-colors">
            <div className="mb-6 text-center">
              <h3 className="mb-2 text-2xl font-bold text-orange-400 font-display">발리 지점</h3>
              <p className="text-sm text-slate-500">Bali Diving Points</p>
            </div>
            <div className="space-y-4">
              {divingPoints.bali.map((point, idx) => (
                <div key={idx} className="rounded-lg bg-white/5 border border-white/5 p-4">
                  <h4 className="mb-1 font-bold text-white">{point.name}</h4>
                  <p className="text-sm text-slate-400">{point.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 rounded-2xl bg-gradient-to-r from-parks-gold/20 to-parks-gold/10 border border-parks-gold/20 p-8 text-center backdrop-blur-sm">
          <h3 className="mb-4 text-2xl font-bold text-parks-gold">
            1회 다이빙 시간 최소 35분 이상 보장!
          </h3>
          <p className="text-lg text-slate-300">
            진짜 다이빙을 경험하세요. 사진만 찍고 끝나는 다이빙이 아닙니다.
          </p>
        </div>
      </div>
    </section>
  )
}

export default TimelineSection
