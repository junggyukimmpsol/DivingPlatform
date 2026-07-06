import { useLanguage } from '../contexts/LanguageContext'
import { useNavigate } from 'react-router-dom'
import { DIVING_LOCATIONS } from '../data/diving-locations'
import { FaCalendarCheck, FaCertificate, FaComments, FaStar } from 'react-icons/fa'

const HomePage: React.FC = () => {
  const { t } = useLanguage()
  const navigate = useNavigate()
  const trustStats = [
    { value: '2,000+', label: '누적 다이빙 투어', sub: '현지 투어 진행 경험', icon: FaCalendarCheck },
    { value: 'PADI', label: '5 Star Diving Shop', sub: '안전 기준 기반 운영', icon: FaCertificate },
    { value: '1,000+', label: '실제 고객 후기', sub: '네이버/현지 후기 기반', icon: FaComments },
    { value: '4.9', label: '고객 만족 별점', sub: '친절한 현지 케어', icon: FaStar },
  ]

  return (
    <div className="pb-20">
      <section className="relative min-h-[92vh] overflow-hidden">
        <img
          src="/assets/bohol/bohol-intro-1.jpeg"
          alt="Tropical diving ocean"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ocean-dark/35 via-ocean-dark/15 to-[#022c43]" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#022c43] to-transparent" />

        <div className="relative z-10 mx-auto flex min-h-[92vh] max-w-7xl flex-col justify-end px-4 pb-12 pt-28 sm:px-6 lg:px-8">
          <div className="mb-8 max-w-3xl">
            <p className="mb-4 inline-flex rounded-full border border-white/30 bg-white/20 px-4 py-2 text-sm font-bold text-white shadow-lg backdrop-blur-md">
              Parks Local Diving
            </p>
            <h1 className="font-display text-5xl font-black leading-tight text-white drop-shadow-2xl md:text-7xl">
              바다 가까이에서 시작하는 다이빙 휴가
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-white/90 drop-shadow md:text-xl">
              따뜻한 햇살, 맑은 바다, 현지 다이빙 포인트를 한 번에 고르고 바로 예약을 준비하세요.
            </p>
          </div>

          <div className="grid max-w-5xl grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
            {DIVING_LOCATIONS.map((location, index) => {
              const locT = t.locations.locations[index]
              return (
                <button
                  key={location.id}
                  type="button"
                  onClick={() => navigate(location.path)}
                  className="group min-h-[132px] rounded-xl border border-white/35 bg-white/20 p-4 text-left shadow-xl backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:bg-white/30 hover:shadow-2xl md:rounded-2xl"
                >
                  <div className="mb-3 flex items-center gap-3">
                    <img
                      src={`https://flagcdn.com/w80/${location.icon}.png`}
                      alt={`${location.name} flag`}
                      className="h-10 w-10 rounded-full border-2 border-white/70 object-cover shadow"
                    />
                    <div>
                      <p className="text-xs font-bold text-white/70">{locT.number}</p>
                      <h2 className="font-display text-lg font-black text-white">{locT.name}</h2>
                    </div>
                  </div>
                  <p className="text-sm font-bold text-parks-gold-light">{locT.nameKo}</p>
                  <p className="mt-2 line-clamp-2 text-xs leading-5 text-white/80">{locT.description}</p>
                </button>
              )
            })}
          </div>
        </div>
      </section>

      <section className="bg-white py-10 text-slate-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid overflow-hidden rounded-2xl border border-sky-100 bg-white shadow-[0_24px_80px_rgba(14,165,233,0.16)] md:grid-cols-4">
            {trustStats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <div
                  key={stat.label}
                  className={`flex items-center gap-4 p-6 ${index > 0 ? 'border-t border-sky-100 md:border-l md:border-t-0' : ''}`}
                >
                  <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-cyan-500 text-white shadow-lg">
                    <Icon size={22} />
                  </div>
                  <div>
                    <p className="text-3xl font-black text-cyan-500">{stat.value}</p>
                    <p className="mt-1 font-bold text-slate-700">{stat.label}</p>
                    <p className="text-sm text-slate-500">{stat.sub}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="bg-[#e8fbff] px-4 pb-6 text-slate-900 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl overflow-hidden rounded-2xl bg-[#06334a] shadow-[0_24px_80px_rgba(3,51,74,0.22)] md:grid-cols-[1.1fr_0.9fr]">
          <div className="p-7 text-white md:p-10">
            <p className="mb-3 inline-flex rounded-full bg-cyan-400 px-4 py-2 text-sm font-black text-[#06334a]">
              여름 다이빙 투어 예약 오픈
            </p>
            <h2 className="font-display text-3xl font-black leading-tight md:text-5xl">
              세부 · 보홀 · 코타키나발루 · 발리 투어를 한 번에 비교하세요
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-8 text-cyan-50/80">
              체험다이빙부터 펀다이빙까지, 날짜와 인원만 선택하면 예약/결제 준비 화면으로 바로 이어집니다.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => navigate('/philippines/bohol?tab=tours')}
                className="rounded-full bg-parks-gold px-6 py-3 text-sm font-black text-ocean-dark transition hover:bg-white"
              >
                투어 가격 보기
              </button>
              <button
                type="button"
                onClick={() => navigate('/photo-enhance')}
                className="rounded-full border border-white/30 px-6 py-3 text-sm font-black text-white transition hover:bg-white/10"
              >
                무료 사진보정 체험
              </button>
            </div>
          </div>
          <div className="relative min-h-[260px]">
            <video
              src="/assets/cebu/cebu-intro-video-1.mp4"
              className="absolute inset-0 h-full w-full object-cover"
              autoPlay
              muted
              loop
              playsInline
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#06334a] via-[#06334a]/25 to-transparent md:from-transparent md:via-transparent" />
          </div>
        </div>
      </section>

      <section className="relative bg-[#e8fbff] py-16 text-slate-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 max-w-3xl">
            <p className="mb-3 text-sm font-black uppercase tracking-[0.25em] text-ocean-accent">Choose your sea</p>
            <h2 className="font-display text-4xl font-black text-[#06334a] md:text-5xl">
              {t.locations.title}
            </h2>
            <p className="mt-4 text-lg leading-8 text-slate-600">
              {t.locations.description1}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {DIVING_LOCATIONS.map((location, index) => {
            const locT = t.locations.locations[index]
            const previewImages: Record<string, string> = {
              cebu: '/assets/cebu/cebu-intro-1.jpeg',
              bohol: '/assets/bohol/bohol-intro-2.jpeg',
              'kota-kinabalu': '/assets/kota-kinabalu/kk-intro-1.jpeg',
              bali: '/assets/cebu/cebu-intro-3.jpeg',
            }
            return (
              <div
                key={location.id}
                className="beach-panel group grid min-h-[250px] cursor-pointer overflow-hidden rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl md:grid-cols-[0.9fr_1.1fr]"
                onClick={() => navigate(location.path)}
              >
                <div className="relative min-h-[180px] overflow-hidden md:min-h-full">
                  <img
                    src={previewImages[location.id]}
                    alt={locT.name}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent" />
                  <img
                    src={`https://flagcdn.com/w80/${location.icon}.png`}
                    alt={`${location.name} flag`}
                    className="absolute left-4 top-4 h-11 w-11 rounded-full border-2 border-white object-cover shadow-lg"
                  />
                </div>

                <div className="flex flex-col p-5 md:p-6">
                  <div className="mb-4">
                    <div className="text-xs font-black uppercase tracking-[0.2em] text-ocean-accent">{locT.number}</div>
                    <h3 className="mt-2 font-display text-3xl font-black text-[#06334a]">
                      {locT.name}
                    </h3>
                    <p className="mt-1 text-sm font-bold text-teal-700">{locT.nameKo}</p>
                  </div>

                  <p className="mb-5 flex-1 text-sm leading-7 text-slate-600">
                    {locT.description}
                  </p>

                  <button
                    className="inline-flex w-fit items-center justify-center gap-2 rounded-full bg-[#06334a] px-5 py-3 text-sm font-black text-white transition-all hover:bg-teal-600"
                  >
                    <span>{t.nav.locationInfo}</span>
                    <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            )
          })}
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage
