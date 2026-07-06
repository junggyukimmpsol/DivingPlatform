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
                <dd className="mt-1">삼박자네트워크</dd>
              </div>
              <div>
                <dt className="text-xs font-bold uppercase tracking-wider text-ocean-teal/70">대표자명</dt>
                <dd className="mt-1">박준덕</dd>
              </div>
              <div>
                <dt className="text-xs font-bold uppercase tracking-wider text-ocean-teal/70">사업자등록번호</dt>
                <dd className="mt-1">440-59-00827</dd>
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
                <dd className="mt-1">경기도 수원시 영통구 권광로260번길 36</dd>
              </div>
            </dl>
          </div>

          <div>
            <h2 className="mb-4 font-display text-lg font-bold text-white">고객 안내</h2>
            <div className="flex flex-col gap-2 text-cyan-50/75">
              <Link to="/terms" className="transition-colors hover:text-parks-gold">
                이용약관 및 환불정책
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
