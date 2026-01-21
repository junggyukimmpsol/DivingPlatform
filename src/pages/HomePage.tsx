import React from 'react'
import { useNavigate } from 'react-router-dom'
import { CENTERS } from '../data/centers'
import SocialFloatingButtons from '../components/common/SocialFloatingButtons'
import Footer from '../components/Footer'

/**
 * 홈페이지 - 2D 지도로 4개 다이빙 센터 위치 표시
 */
const HomePage: React.FC = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      {/* 헤더 */}
      <header className="sticky top-0 z-40 bg-ocean-dark/95 backdrop-blur-xl border-b border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-16 lg:h-20">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-parks-gold/30 rounded-xl blur-lg"></div>
                <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-parks-gold to-amber-500 shadow-lg">
                  <span className="text-lg font-bold text-ocean-dark">P</span>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-display text-xl font-bold text-white tracking-tight leading-tight">
                  Parks
                </span>
                <span className="text-[10px] font-body font-medium text-parks-gold tracking-widest uppercase">
                  Local Diving
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="relative">
        {/* Hero Section */}
        <section className="relative py-16 lg:py-24 overflow-hidden">
          {/* 배경 그라디언트 */}
          <div className="absolute inset-0 bg-gradient-to-b from-ocean-dark via-slate-950 to-slate-950"></div>

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* 타이틀 */}
            <div className="text-center mb-12">
              <div className="inline-block rounded-full bg-ocean-teal/10 border border-ocean-teal/20 px-6 py-2 text-sm font-bold text-ocean-teal mb-4">
                🗺️ Dive Locations
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-4">
                다이빙 센터 선택
              </h1>
              <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                원하시는 지역을 선택하여 상세 정보를 확인하세요
              </p>
            </div>

            {/* 2D 지도 영역 */}
            <div className="relative w-full overflow-hidden rounded-2xl border border-white/10 shadow-2xl bg-gradient-to-b from-ocean-dark/50 to-slate-950/80 p-8">
              {/* 심플한 지도 배경 */}
              <div className="relative aspect-[16/9] md:aspect-[2/1] w-full">
                {/* SVG 지도 백그라운드 */}
                <svg
                  viewBox="0 0 800 400"
                  className="absolute inset-0 w-full h-full"
                  preserveAspectRatio="xMidYMid meet"
                >
                  {/* 배경 바다 */}
                  <rect fill="url(#oceanGradient)" width="800" height="400" />

                  {/* 그라디언트 정의 */}
                  <defs>
                    <linearGradient id="oceanGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#0c4a6e" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#020617" stopOpacity="0.6" />
                    </linearGradient>
                    <filter id="glow">
                      <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                      <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>

                  {/* 간략화된 동남아시아 윤곽선 */}
                  <path
                    d="M250,80 L280,90 L300,120 L290,150 L260,140 L240,110 Z"
                    fill="#1e293b"
                    stroke="#334155"
                    strokeWidth="1"
                    opacity="0.6"
                  />
                  {/* 필리핀 */}
                  <path
                    d="M550,100 L580,90 L600,110 L590,140 L620,160 L610,200 L580,220 L550,190 L540,150 L560,120 Z"
                    fill="#1e293b"
                    stroke="#334155"
                    strokeWidth="1"
                    opacity="0.6"
                  />
                  {/* 보르네오 */}
                  <path
                    d="M350,200 L420,180 L460,210 L450,280 L380,290 L340,250 Z"
                    fill="#1e293b"
                    stroke="#334155"
                    strokeWidth="1"
                    opacity="0.6"
                  />
                  {/* 인도네시아 */}
                  <path
                    d="M200,320 L350,310 L400,340 L500,330 L520,360 L400,380 L250,370 L180,350 Z"
                    fill="#1e293b"
                    stroke="#334155"
                    strokeWidth="1"
                    opacity="0.6"
                  />
                </svg>

                {/* 센터 마커들 */}
                {CENTERS.map((center) => {
                  // 지도 좌표를 SVG 뷰박스에 맞게 변환
                  const x = ((center.coordinates.lng - 100) / 40) * 800
                  const y = ((20 - center.coordinates.lat) / 35) * 400

                  return (
                    <button
                      key={center.id}
                      onClick={() => navigate(`/${center.id}`)}
                      className="absolute transform -translate-x-1/2 -translate-y-1/2 group transition-all duration-300 hover:scale-110 z-10"
                      style={{
                        left: `${(x / 800) * 100}%`,
                        top: `${(y / 400) * 100}%`,
                      }}
                    >
                      {/* 펄스 애니메이션 */}
                      <div className={`absolute inset-0 rounded-full bg-gradient-to-r ${center.color} animate-ping opacity-30`}></div>

                      {/* 마커 아이콘 */}
                      <div className={`relative flex h-12 w-12 md:h-14 md:w-14 items-center justify-center rounded-full bg-gradient-to-r ${center.color} shadow-lg border-2 border-white/30 group-hover:border-white/60 transition-all`}>
                        <span className="text-xl md:text-2xl">{center.icon}</span>
                      </div>

                      {/* 라벨 */}
                      <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 whitespace-nowrap bg-slate-800/95 backdrop-blur-sm text-white text-xs md:text-sm font-medium px-3 py-1.5 rounded-full border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity shadow-xl">
                        <span className="mr-1">{center.countryIcon}</span>
                        {center.nameKo}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* 센터 카드 그리드 */}
            <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {CENTERS.map((center) => (
                <button
                  key={center.id}
                  onClick={() => navigate(`/${center.id}`)}
                  className="group relative overflow-hidden rounded-2xl bg-white/5 border border-white/10 p-6 text-left transition-all duration-300 hover:bg-white/10 hover:border-white/20 hover:scale-[1.02] hover:shadow-xl"
                >
                  {/* 배경 그라디언트 */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${center.color} opacity-0 group-hover:opacity-10 transition-opacity`}></div>

                  <div className="relative">
                    {/* 아이콘 & 국가 */}
                    <div className="flex items-start justify-between mb-4">
                      <span className="text-3xl md:text-4xl">{center.icon}</span>
                      <span className="text-lg">{center.countryIcon}</span>
                    </div>

                    {/* 센터 이름 */}
                    <h3 className="text-lg md:text-xl font-bold text-white mb-1">
                      {center.nameKo}
                    </h3>
                    <p className="text-sm text-slate-400 mb-2">
                      {center.name}
                    </p>

                    {/* 설명 */}
                    <p className="text-xs text-slate-500">
                      {center.description}
                    </p>

                    {/* 화살표 */}
                    <div className="absolute bottom-0 right-0 text-slate-500 group-hover:text-white group-hover:translate-x-1 transition-all">
                      →
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <SocialFloatingButtons />
    </div>
  )
}

export default HomePage
