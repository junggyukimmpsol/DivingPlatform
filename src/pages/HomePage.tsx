import { useLanguage } from '../contexts/LanguageContext'
import { useNavigate } from 'react-router-dom'
import { DIVING_LOCATIONS } from '../data/diving-locations'
import {
  FaCamera,
  FaCalendarCheck,
  FaCertificate,
  FaCheckCircle,
  FaClock,
  FaComments,
  FaMapMarkedAlt,
  FaShip,
  FaStar,
  FaTags,
  FaUsers,
} from 'react-icons/fa'

const HomePage: React.FC = () => {
  const { t } = useLanguage()
  const navigate = useNavigate()
  const trustStats = [
    { value: '2,000+', label: '누적 다이빙 투어', sub: '현지 투어 진행 경험', icon: FaCalendarCheck },
    { value: 'PADI', label: '5 Star Diving Shop', sub: '안전 기준 기반 운영', icon: FaCertificate },
    { value: '1,000+', label: '실제 고객 후기', sub: '네이버/현지 후기 기반', icon: FaComments },
    { value: '4.9', label: '고객 만족 별점', sub: '친절한 현지 케어', icon: FaStar },
  ]
  const whyItems = [
    {
      icon: FaCheckCircle,
      title: '올 인클루시브 투어',
      description: '장비 렌탈, 픽드랍, 다이빙, 점심 식사, 환경세, 입장료, 수중 사진/영상 촬영까지 투어에 필요한 항목을 한 번에 준비합니다.',
    },
    {
      icon: FaClock,
      title: '1회 다이빙 최소 35분 이상',
      description: '사진만 찍고 끝나는 체험이 아니라 교육부터 입수, 수중 적응, 포인트 이동까지 실제 다이빙 투어 흐름으로 진행합니다.',
    },
    {
      icon: FaUsers,
      title: '경험 많은 현지 가이드',
      description: '현지 바다 컨디션과 포인트를 잘 아는 가이드가 당일 기상과 안전 상황에 맞춰 투어를 운영합니다.',
    },
    {
      icon: FaCertificate,
      title: 'PADI 5 Star 기준 운영',
      description: '초보 체험다이빙부터 펀다이빙, 자격증 보유자 투어까지 안전 기준과 장비 점검을 우선으로 진행합니다.',
    },
  ]
  const includedItems = [
    { icon: FaShip, label: '보트 다이빙', text: '세부, 보홀, 코타키나발루, 발리의 주요 포인트를 지점별로 선택' },
    { icon: FaCamera, label: '수중 촬영', text: '투어 중 사진과 영상으로 여행 기록을 남길 수 있도록 지원' },
    { icon: FaMapMarkedAlt, label: '당일 포인트 운영', text: '기상과 해양 상황에 따라 가장 안전하고 좋은 포인트로 진행' },
    { icon: FaTags, label: '원화 가격 비교', text: '지점별 상품 가격을 원화 기준으로 비교하고 장바구니 결제 가능' },
  ]
  const scheduleItems = [
    { time: '08:00', title: '호텔 픽업', text: '지점별 픽업 가능 지역에서 투어 시작' },
    { time: '09:00', title: '안전 교육', text: '장비 착용, 호흡법, 수신호, 입수 방법 안내' },
    { time: '10:00', title: '1차 다이빙', text: '가이드와 함께 천천히 수중 적응' },
    { time: '12:00', title: '점심 식사', text: '현지 일정에 맞춰 식사 및 휴식' },
    { time: '13:00', title: '추가 다이빙', text: '상품에 따라 2회 또는 3회 다이빙 진행' },
    { time: '14:30', title: '호텔 드랍', text: '투어 종료 후 사진/영상 안내' },
  ]

  return (
    <div className="pb-20">
      <section className="relative min-h-[92vh] overflow-hidden">
        <img
          src="/assets/ai/kota-kinabalu-ai-reef.jpg"
          alt="Tropical diving ocean"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ocean-dark/35 via-ocean-dark/15 to-[#022c43]" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#022c43] to-transparent" />

        <div className="relative z-10 mx-auto flex min-h-[92vh] max-w-7xl flex-col justify-end px-4 pb-12 pt-28 sm:px-6 lg:px-8">
          <div className="mb-8 max-w-3xl">
            <p className="mb-4 inline-flex rounded-full border border-white/30 bg-white/20 px-4 py-2 text-sm font-bold text-white shadow-lg backdrop-blur-md">
              Local Diving Tour Platform
            </p>
            <h1 className="font-display text-5xl font-black leading-tight text-white drop-shadow-2xl md:text-7xl">
              Parks Local Diving
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-white/90 drop-shadow md:text-xl">
              세부, 보홀, 코타키나발루, 발리의 검증된 현지 다이빙 투어를 비교하고 예약하세요.
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
        <div className="mx-auto grid max-w-7xl overflow-hidden rounded-2xl bg-gradient-to-br from-[#00b4d8] via-[#00d4a8] to-[#ffe66d] p-[1px] shadow-[0_28px_90px_rgba(0,180,216,0.24)] md:grid-cols-[1.08fr_0.92fr]">
          <div className="relative overflow-hidden rounded-[15px] bg-[#053047] p-7 text-white md:rounded-r-none md:p-10">
            <div className="absolute right-8 top-8 hidden rounded-full bg-white/10 px-5 py-3 text-sm font-black text-white backdrop-blur md:block">
              LIMITED OPEN
            </div>
            <p className="mb-4 inline-flex rounded-full bg-white px-4 py-2 text-sm font-black text-[#0077b6] shadow-lg">
              2026 SUMMER DIVE PASS
            </p>
            <h2 className="max-w-2xl text-4xl font-black leading-tight tracking-normal md:text-6xl">
              원하는 바다를 고르고,
              <span className="block text-[#ffe66d]">바로 예약하세요.</span>
            </h2>
            <p className="mt-5 max-w-2xl text-base font-semibold leading-8 text-cyan-50/85 md:text-lg">
              세부, 보홀, 코타키나발루, 발리 투어 가격을 한 번에 비교하고
              체험다이빙부터 펀다이빙까지 빠르게 예약 준비를 시작하세요.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => navigate('/philippines/bohol?tab=tours')}
                className="rounded-full bg-[#ffe66d] px-7 py-3 text-sm font-black text-[#053047] shadow-[0_12px_30px_rgba(255,230,109,0.28)] transition hover:-translate-y-0.5 hover:bg-white"
              >
                투어 가격 비교
              </button>
              <button
                type="button"
                onClick={() => navigate('/photo-enhance')}
                className="rounded-full border border-white/40 bg-white/10 px-7 py-3 text-sm font-black text-white backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/20"
              >
                사진보정 5장 무료
              </button>
            </div>
          </div>
          <div className="relative min-h-[260px] overflow-hidden rounded-[15px] md:rounded-l-none">
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

      <section className="bg-[#e8fbff] py-16 text-slate-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
            <div>
              <p className="mb-3 text-sm font-black uppercase tracking-[0.25em] text-ocean-accent">Why Parks</p>
              <h2 className="font-display text-4xl font-black leading-tight text-[#06334a] md:text-5xl">
                처음이어도 편하게,
                <span className="block text-cyan-600">경험자는 제대로.</span>
              </h2>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
                Parks Local Diving은 여행자가 현지에서 가장 많이 헷갈리는 가격, 픽업, 장비, 촬영, 안전 안내를
                한 번에 정리해주는 다이빙 투어 플랫폼입니다.
              </p>
            </div>
            <div className="rounded-2xl bg-[#06334a] p-6 text-white shadow-[0_24px_70px_rgba(3,51,74,0.24)]">
              <p className="text-sm font-black text-parks-gold">투어 포함 핵심</p>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {includedItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <div key={item.label} className="rounded-xl bg-white/10 p-4">
                      <Icon className="mb-3 text-parks-gold" size={22} />
                      <h3 className="font-black">{item.label}</h3>
                      <p className="mt-2 text-sm leading-6 text-white/75">{item.text}</p>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {whyItems.map((item) => {
              const Icon = item.icon
              return (
                <article key={item.title} className="rounded-2xl border border-sky-100 bg-white p-6 shadow-[0_18px_50px_rgba(14,165,233,0.12)]">
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-cyan-100 text-cyan-700">
                    <Icon size={20} />
                  </div>
                  <h3 className="text-xl font-black text-[#06334a]">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{item.description}</p>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      <section className="bg-white py-16 text-slate-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 max-w-3xl">
            <p className="mb-3 text-sm font-black uppercase tracking-[0.25em] text-ocean-accent">Tour Flow</p>
            <h2 className="font-display text-4xl font-black text-[#06334a] md:text-5xl">
              하루 일정이 보이면 예약이 쉬워집니다.
            </h2>
            <p className="mt-4 text-lg leading-8 text-slate-600">
              실제 시간은 지점과 상품, 당일 해양 상황에 따라 달라질 수 있지만 기본 흐름은 아래처럼 진행됩니다.
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-6">
            {scheduleItems.map((item, index) => (
              <div key={`${item.time}-${item.title}`} className="relative rounded-2xl bg-[#e8fbff] p-5">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-[#06334a] text-sm font-black text-white">
                  {index + 1}
                </div>
                <p className="text-lg font-black text-cyan-600">{item.time}</p>
                <h3 className="mt-1 font-black text-[#06334a]">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#dff9ff] py-16 text-slate-900">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[1fr_0.9fr] lg:px-8">
          <div className="rounded-2xl bg-white p-7 shadow-[0_24px_70px_rgba(14,165,233,0.16)] md:p-9">
            <p className="mb-3 text-sm font-black uppercase tracking-[0.25em] text-ocean-accent">Real Reviews</p>
            <h2 className="font-display text-4xl font-black text-[#06334a]">
              고객이 먼저 말해주는 만족도
            </h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {[
                '처음이라 긴장했는데 교육부터 입수까지 차근차근 알려줘서 금방 적응했어요.',
                '장비가 깔끔했고 사진과 영상까지 남겨줘서 여행 중 가장 기억에 남았습니다.',
                '여러 업체 비교하다 선택했는데 픽업, 식사, 다이빙 진행이 편했습니다.',
                '자격증 있는 친구와 체험다이빙인 제가 같이 즐길 수 있어서 좋았어요.',
              ].map((review) => (
                <div key={review} className="rounded-xl border border-sky-100 bg-cyan-50/70 p-5">
                  <div className="mb-3 text-parks-gold">★★★★★</div>
                  <p className="text-sm leading-7 text-slate-700">{review}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl bg-[#06334a] p-7 text-white shadow-[0_24px_70px_rgba(3,51,74,0.22)] md:p-9">
            <p className="mb-3 text-sm font-black uppercase tracking-[0.25em] text-parks-gold">Special Benefit</p>
            <h2 className="font-display text-4xl font-black">
              투어 전후 혜택까지 챙겨요.
            </h2>
            <div className="mt-6 space-y-4">
              {[
                ['무료 사진보정 5장', '다이빙 사진을 업로드하면 AI 보정 결과를 받을 수 있습니다.'],
                ['후기 이벤트', '사진 후기 참여 시 지점별 이벤트 혜택을 받을 수 있습니다.'],
                ['동행자 투어', '자격증 보유자와 미보유자가 함께 즐길 수 있는 상품을 운영합니다.'],
              ].map(([title, text]) => (
                <div key={title} className="rounded-xl bg-white/10 p-5">
                  <h3 className="font-black text-parks-gold">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-white/75">{text}</p>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => navigate('/photo-enhance')}
              className="mt-7 rounded-full bg-parks-gold px-6 py-3 text-sm font-black text-[#06334a] transition hover:bg-white"
            >
              무료 사진보정 체험
            </button>
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
              cebu: '/assets/ai/cebu-ai-divers.jpg',
              bohol: '/assets/ai/bohol-ai-turtle.jpg',
              'kota-kinabalu': '/assets/ai/kota-kinabalu-ai-reef.jpg',
              bali: '/assets/ai/bali-ai-manta.jpg',
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
