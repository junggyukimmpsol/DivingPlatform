

const PriceComparisonSection = () => {
  const priceData = [
    {
      location: '알로나 비치\n산호 직벽 포인트\n(다이빙)',
      type: '보트 체험 다이빙 2회',
      duration: '(1회 교육 다이빙 - 25분~30분\n1회 다이빙(정) 40분 이상)',
      competitor: '20만원\n($ 140)',
      parks: '14만원',
      savings: '(6만원 SAVE)',
      highlight: true,
    },
    {
      location: '알로나 비치\n산호 직벽 포인트\n(다이빙)',
      type: '펀다이빙 2회',
      duration: '(1회 다이빙시 40분 이상)',
      competitor: '20만원\n($ 140)',
      parks: '13만원',
      savings: '(7만원 SAVE)',
    },
    {
      location: '나팔링\n(다이빙)',
      type: '보트 체험 다이빙 2회',
      duration: '(1회 교육 다이빙 - 25분~30분\n1회 다이빙(정) 40분 이상)',
      competitor: '21만원\n($ 150)',
      parks: '15만원',
      savings: '(6만원 SAVE)',
    },
    {
      location: '나팔링\n(다이빙)',
      type: '펀다이빙 2회',
      duration: '(1회 다이빙시 40분 이상)',
      competitor: '20만원\n($ 140)',
      parks: '13만원',
      savings: '(7만원 SAVE)',
    },
    {
      location: '발리캐식 or\n파밀라칸\n(다이빙)\n+\n샌드위치\n점심 제공',
      type: '보트 펀다이빙 2회',
      duration: '(1회 다이빙시 40분 이상)',
      competitor: '19만원\n($ 125)',
      parks: '14만원',
      savings: '(5만원 SAVE)',
    },
    {
      location: '발리캐식 or\n파밀라칸\n(다이빙)\n+\n샌드위치\n점심 제공',
      type: '보트 펀다이빙 3회',
      duration: '(1회 다이빙시 40분 이상)',
      competitor: '22만원\n($ 145)',
      parks: '18만원',
      savings: '(4만원 SAVE)',
    },
    {
      location: '보트 스노클링',
      type: '스노클링 2회',
      duration: '',
      competitor: '12만원\n($ 90)',
      parks: '7만원',
      savings: '(4만원 SAVE)',
    },
  ]

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-ocean-dark to-slate-950 py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <div className="mb-4 inline-block rounded-full bg-parks-gold/10 border border-parks-gold/20 px-6 py-2 text-sm font-bold text-parks-gold">
            Parks 로컬 다이빙
          </div>
          <h2 className="mb-6 text-4xl font-display font-bold text-white md:text-5xl lg:text-6xl">
            다이빙 투어 가격
          </h2>
          <p className="text-xl font-light text-slate-300 md:text-2xl">
            타업체 대비 <span className="font-bold text-parks-gold">최저가 보장</span>
          </p>
        </div>

        {/* Price Comparison Table */}
        {/* Desktop View: Table */}
        <div className="hidden md:block glass-card overflow-x-auto rounded-3xl p-8 relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-parks-gold/5 rounded-full blur-[80px] pointer-events-none"></div>

          <table className="w-full min-w-[800px] border-collapse relative z-10">
            <thead>
              <tr className="border-b border-white/10 text-slate-400 uppercase text-xs tracking-wider">
                <th className="p-4 text-left font-medium">다이빙 지역</th>
                <th className="p-4 text-left font-medium">다이빙 상품</th>
                <th className="p-4 text-left font-medium">타업체(원보)</th>
                <th className="p-4 text-left font-bold text-parks-gold">Park's 로컬 다이빙</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {priceData.map((item, index) => (
                <tr
                  key={index}
                  className={`transition-all duration-200 hover:bg-white/5`}
                >
                  <td className="p-4">
                    <div className="whitespace-pre-line text-sm font-medium text-slate-300">
                      {item.location}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="font-semibold text-white">{item.type}</div>
                    {item.duration && (
                      <div className="mt-1 whitespace-pre-line text-xs text-slate-500">
                        {item.duration}
                      </div>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="whitespace-pre-line text-lg font-medium text-slate-500 line-through decoration-slate-600">
                      {item.competitor}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div>
                        <div className="text-2xl font-bold text-ocean-teal">{item.parks}</div>
                        <div className="text-sm font-bold text-parks-gold">{item.savings}</div>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile View: Horizontal-First Cards */}
        <div className="md:hidden space-y-3 relative z-10">
          {priceData.map((item, index) => (
            <div key={index} className="glass-card p-5 rounded-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-ocean-teal/5 rounded-full blur-[40px] pointer-events-none"></div>

              <div className="relative z-10">
                {/* Top Section: Side-by-Side */}
                <div className="flex items-start gap-4 mb-4">
                  <div className="flex-shrink-0 w-24 px-2 py-2 rounded-lg bg-white/5 border border-white/10 text-[10px] font-bold text-ocean-teal text-center leading-tight">
                    {item.location.replace(/\n/g, ' ')}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-bold text-white mb-1 leading-snug">{item.type}</h3>
                    {item.duration && (
                      <p className="text-xs text-slate-500 leading-tight">{item.duration.replace(/\n/g, ' ')}</p>
                    )}
                  </div>
                </div>

                {/* Bottom Section: Pricing Details */}
                <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-2">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-500 mb-0.5">타업체 평균</span>
                    <span className="text-sm text-slate-400 line-through decoration-slate-600">
                      {item.competitor.split('\n')[0]}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="flex flex-col items-end">
                      <span className="text-xl font-bold text-white tracking-tight leading-none mb-1">{item.parks}</span>
                      <span className="text-[10px] font-bold text-parks-gold bg-parks-gold/10 px-2 py-0.5 rounded-full">
                        {item.savings.replace(/[()]/g, '')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Important Notes */}
        <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm">
          <h3 className="mb-4 text-2xl font-bold text-parks-gold">중요 공지</h3>
          <div className="space-y-3 text-slate-300">
            <div className="flex items-start gap-3">
              <span className="mt-1 font-bold text-parks-gold">1.</span>
              <p>
                <span className="font-bold text-white">보홀 지점</span>의 모든 투어는
                막탄 내 무료 픽드랍이 포함된 올인클루시브 패키지입니다.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="mt-1 font-bold text-parks-gold">2.</span>
              <p className="whitespace-pre-line">
                투어 일정 (무료 픽드랍 포함)
                <span className="font-bold text-ocean-teal">
                  {'\n'}(호텔 픽업 → 다이빙 포인트 → 점심 식사 → 호텔 드랍)
                </span>
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="mt-1 font-bold text-parks-gold">3.</span>
              <p className="whitespace-pre-line">
                모든 투어에 무료 픽드랍 서비스가 포함되어 있으며,
                <span className="font-bold text-ocean-teal">
                  {'\n'}안전하고 편안하게 호텔까지 모셔다 드립니다.
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Discount Highlight */}
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl bg-gradient-to-br from-parks-gold/20 to-parks-gold/5 border border-parks-gold/20 p-6 text-center backdrop-blur-sm">
            <h4 className="mb-2 text-3xl font-bold text-parks-gold">최대 30%</h4>
            <p className="text-slate-300">타업체 대비 저렴</p>
          </div>
          <div className="rounded-2xl bg-gradient-to-br from-ocean-teal/20 to-ocean-teal/5 border border-ocean-teal/20 p-6 text-center backdrop-blur-sm">
            <h4 className="mb-2 text-3xl font-bold text-ocean-teal">최대 7만원</h4>
            <p className="text-slate-300">1인당 절약</p>
          </div>
          <div className="rounded-2xl bg-gradient-to-br from-purple-500/20 to-purple-500/5 border border-purple-500/20 p-6 text-center backdrop-blur-sm">
            <h4 className="mb-2 text-3xl font-bold text-white">40분 이상</h4>
            <p className="text-slate-300">1회 다이빙 시간</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default PriceComparisonSection
