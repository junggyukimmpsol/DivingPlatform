import React from 'react'
import { FaInstagram, FaFacebookF, FaEnvelope, FaMapMarkerAlt, FaStar, FaTrophy, FaUsers, FaPercent } from 'react-icons/fa'

const Footer = () => {
  return (
    <footer className="relative bg-ocean-dark py-16 text-slate-300 overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 h-64 w-64 rounded-full bg-ocean-teal/20 blur-[100px]"></div>
        <div className="absolute bottom-0 right-0 h-64 w-64 rounded-full bg-parks-gold/10 blur-[100px]"></div>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Company Info */}
          <div>
            <h3 className="mb-4 font-display text-3xl font-bold text-parks-gold drop-shadow-[0_0_20px_rgba(251,191,36,0.3)]">Parks 로컬 다이빙</h3>
            <p className="mb-6 font-body text-sm leading-relaxed text-slate-400">
              아시아 최고의 다이빙 포인트에서
              <br />
              안전하고 즐거운 다이빙을 경험하세요
            </p>
            <div className="flex gap-3">
              <a
                href="https://www.instagram.com/parks_local_diving"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit our Instagram page"
                className="group flex h-11 w-11 items-center justify-center rounded-lg bg-ocean-teal/20 border border-ocean-teal/30 text-xl transition-all duration-300 hover:bg-ocean-teal hover:scale-110 focus:outline-none focus:ring-2 focus:ring-ocean-teal focus:ring-offset-2 focus:ring-offset-ocean-deep"
                title="Instagram"
              >
                <FaInstagram className="group-hover:scale-110 transition-transform" aria-hidden="true" />
              </a>
              <a
                href="https://www.facebook.com/share/1Xyev7V9hL/?mibextid=wwXIfr"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit our Facebook page"
                className="group flex h-11 w-11 items-center justify-center rounded-lg bg-parks-blue/20 border border-parks-blue/30 text-xl transition-all duration-300 hover:bg-parks-blue hover:scale-110 focus:outline-none focus:ring-2 focus:ring-parks-blue focus:ring-offset-2 focus:ring-offset-ocean-deep"
                title="Facebook"
              >
                <FaFacebookF className="group-hover:scale-110 transition-transform" aria-hidden="true" />
              </a>
              <a
                href="mailto:parksdiving@gmail.com"
                aria-label="Send us an email"
                className="group flex h-11 w-11 items-center justify-center rounded-lg bg-parks-gold/10 border border-parks-gold/30 text-xl transition-all duration-300 hover:bg-parks-gold hover:scale-110 focus:outline-none focus:ring-2 focus:ring-parks-gold focus:ring-offset-2 focus:ring-offset-ocean-dark"
                title="Email"
              >
                <FaEnvelope className="group-hover:scale-110 transition-transform" aria-hidden="true" />
              </a>
            </div>
          </div>

          {/* Locations */}
          <div>
            <h4 className="mb-6 font-display text-xl font-bold text-ocean-teal">우리의 지점</h4>
            <ul className="space-y-3 font-body text-sm">
              <li className="flex items-center gap-3 group">
                <FaMapMarkerAlt className="text-lg text-parks-yellow group-hover:scale-125 transition-transform" />
                <span className="group-hover:text-ocean-teal transition-colors">세부 (Cebu) - 1호점</span>
              </li>
              <li className="flex items-center gap-3 group">
                <FaMapMarkerAlt className="text-lg text-parks-yellow group-hover:scale-125 transition-transform" />
                <span className="group-hover:text-ocean-teal transition-colors">보홀 (Bohol) - 2호점</span>
              </li>
              <li className="flex items-center gap-3 group">
                <FaMapMarkerAlt className="text-lg text-parks-yellow group-hover:scale-125 transition-transform" />
                <span className="group-hover:text-ocean-teal transition-colors">코타키나발루 - 3호점</span>
              </li>
              <li className="flex items-center gap-3 group">
                <FaMapMarkerAlt className="text-lg text-parks-yellow group-hover:scale-125 transition-transform" />
                <span className="group-hover:text-ocean-teal transition-colors">발리 (Bali) - 4호점</span>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-6 font-display text-xl font-bold text-ocean-teal">주요 서비스</h4>
            <ul className="space-y-3 font-body text-sm">
              <li className="hover:text-parks-gold transition-colors cursor-pointer hover:translate-x-1 duration-300">체험 다이빙</li>
              <li className="hover:text-parks-gold transition-colors cursor-pointer hover:translate-x-1 duration-300">펀 다이빙</li>
              <li className="hover:text-parks-gold transition-colors cursor-pointer hover:translate-x-1 duration-300">PADI 자격증 과정</li>
              <li className="hover:text-parks-gold transition-colors cursor-pointer hover:translate-x-1 duration-300">단체 투어</li>
              <li className="hover:text-parks-gold transition-colors cursor-pointer hover:translate-x-1 duration-300">수중 촬영</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="mb-6 font-display text-xl font-bold text-ocean-teal">문의하기</h4>
            <ul className="space-y-4 font-body text-sm">
              <li>
                <span className="font-semibold text-ocean-teal/80">이메일:</span>
                <br />
                <a href="mailto:parksdiving@gmail.com" className="hover:text-parks-gold transition-colors">
                  parksdiving@gmail.com
                </a>
              </li>
              <li>
                <span className="font-semibold text-ocean-teal/80">인스타그램:</span>
                <br />
                <a
                  href="https://www.instagram.com/parks_local_diving"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-parks-gold transition-colors"
                >
                  @parks_local_diving
                </a>
              </li>
              <li>
                <span className="font-semibold text-ocean-teal/80">페이스북:</span>
                <br />
                <a
                  href="https://www.facebook.com/share/1Xyev7V9hL/?mibextid=wwXIfr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-parks-gold transition-colors"
                >
                  Parks 로컬 다이빙
                </a>
              </li>
              <li>
                <span className="font-semibold text-ocean-teal/80">운영시간:</span>
                <br />
                <span className="text-sand/70">연중무휴 24시간 문의 가능</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Certifications & Awards */}
        <div className="my-12 border-t border-ocean-teal/20 pt-12">
          <div className="flex flex-wrap items-center justify-center gap-6 text-center">
            <div className="group rounded-2xl bg-ocean-teal/10 px-8 py-5 backdrop-blur-sm border-2 border-ocean-teal/30 transition-all duration-300 hover:bg-ocean-teal/20 hover:scale-105 hover:shadow-[0_0_30px_rgba(0,217,192,0.3)]">
              <FaStar className="text-3xl group-hover:scale-110 inline-block transition-transform text-parks-gold" />
              <p className="mt-2 font-display text-sm font-bold text-parks-gold">PADI 5 Star</p>
            </div>
            <div className="group rounded-2xl bg-parks-gold/10 px-8 py-5 backdrop-blur-sm border-2 border-parks-gold/30 transition-all duration-300 hover:bg-parks-gold/20 hover:scale-105 hover:shadow-[0_0_30px_rgba(251,191,36,0.3)]">
              <FaTrophy className="text-3xl group-hover:scale-110 inline-block transition-transform text-ocean-teal" />
              <p className="mt-2 font-display text-sm font-bold text-ocean-teal">고객 만족도 1위</p>
            </div>
            <div className="group rounded-2xl bg-coral/10 px-8 py-5 backdrop-blur-sm border-2 border-coral/30 transition-all duration-300 hover:bg-coral/20 hover:scale-105 hover:shadow-[0_0_30px_rgba(255,107,107,0.3)]">
              <FaUsers className="text-3xl group-hover:scale-110 inline-block transition-transform text-slate-300" />
              <p className="mt-2 font-display text-sm font-bold text-slate-300">1,000+ 고객</p>
            </div>
            <div className="group rounded-2xl bg-parks-blue/10 px-8 py-5 backdrop-blur-sm border-2 border-parks-blue/30 transition-all duration-300 hover:bg-parks-blue/20 hover:scale-105 hover:shadow-[0_0_30px_rgba(91,159,255,0.3)]">
              <FaPercent className="text-3xl group-hover:scale-110 inline-block transition-transform text-parks-gold" />
              <p className="mt-2 font-display text-sm font-bold text-parks-gold">재구매율 1위</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-ocean-teal/20 pt-8 text-center">
          <p className="font-body text-sm text-sand/70">
            &copy; {new Date().getFullYear()} Parks 로컬 다이빙. All rights reserved.
          </p>
          <p className="mt-3 font-body text-xs text-ocean-teal/60 max-w-2xl mx-auto">
            비싸기만 했던 스쿠버 다이빙, Parks 로컬 다이빙에서 저렴하고 안전하게 함께 해봐요
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
