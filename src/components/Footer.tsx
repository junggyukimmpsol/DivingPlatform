import { useLanguage } from '../contexts/LanguageContext'
import { Link } from 'react-router-dom'

const Footer = () => {
  const { t } = useLanguage()

  return (
    <footer className="relative overflow-hidden bg-[#06334a] py-16 text-slate-200">
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 grid gap-8 border-t border-ocean-teal/20 pt-8 text-sm md:grid-cols-[1.2fr_0.8fr]">
          <div>
            <h2 className="mb-4 font-display text-lg font-bold text-white">사업자 정보</h2>
            <dl className="grid gap-2 text-cyan-50/75 sm:grid-cols-2">
              <div>
                <dt className="text-xs font-bold uppercase tracking-wider text-ocean-teal/70">상호명</dt>
                <dd className="mt-1">마린앤그린</dd>
              </div>
              <div>
                <dt className="text-xs font-bold uppercase tracking-wider text-ocean-teal/70">대표자명</dt>
                <dd className="mt-1">박준혁</dd>
              </div>
              <div>
                <dt className="text-xs font-bold uppercase tracking-wider text-ocean-teal/70">사업자등록번호</dt>
                <dd className="mt-1">192-15-02825</dd>
              </div>
              <div>
                <dt className="text-xs font-bold uppercase tracking-wider text-ocean-teal/70">업태</dt>
                <dd className="mt-1">서비스업</dd>
              </div>
              <div>
                <dt className="text-xs font-bold uppercase tracking-wider text-ocean-teal/70">전화번호</dt>
                <dd className="mt-1">
                  <a href="tel:01057941330" className="transition-colors hover:text-parks-gold">
                    010-5794-1330
                  </a>
                </dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-xs font-bold uppercase tracking-wider text-ocean-teal/70">주소</dt>
                <dd className="mt-1">경기도 화성시 동탄중심상가2길 8, 4층 401-파28호(반송동, 로하스애비뉴)</dd>
              </div>
              <div>
                <dt className="text-xs font-bold uppercase tracking-wider text-ocean-teal/70">개업일</dt>
                <dd className="mt-1">2026년 01월 21일</dd>
              </div>
              <div>
                <dt className="text-xs font-bold uppercase tracking-wider text-ocean-teal/70">등록일</dt>
                <dd className="mt-1">2026년 01월 22일</dd>
              </div>
            </dl>
          </div>

          <div>
            <h2 className="mb-4 font-display text-lg font-bold text-white">고객 안내</h2>
            <div className="flex flex-col gap-2 text-cyan-50/75">
              <Link to="/terms" className="transition-colors hover:text-parks-gold">
                이용약관 및 환불정책
              </Link>
              <Link
                to="/terms"
                className="rounded-lg border border-parks-gold/35 bg-parks-gold/10 p-3 font-bold text-parks-gold transition-colors hover:bg-parks-gold hover:text-[#06334a]"
              >
                공식 확인: 관광사업등록 · SGI서울보증 보증보험 가입
              </Link>
              <p>투어 예약 및 결제 전 환불 규정을 반드시 확인해주세요.</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-ocean-teal/20 pt-8 text-center">
          <p className="font-body text-sm text-sand/70">
            &copy; {new Date().getFullYear()} {t.footer.companyName}. {t.footer.allRightsReserved}
          </p>
          <p className="mt-3 font-body text-xs text-ocean-teal/60 max-w-2xl mx-auto">
            {t.footer.tagline}
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
