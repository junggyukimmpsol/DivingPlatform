import { useLanguage } from '../contexts/LanguageContext'

const Footer = () => {
  const { t } = useLanguage()

  return (
    <footer className="relative bg-ocean-dark py-16 text-slate-300 overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 h-64 w-64 rounded-full bg-ocean-teal/20 blur-[100px]"></div>
        <div className="absolute bottom-0 right-0 h-64 w-64 rounded-full bg-parks-gold/10 blur-[100px]"></div>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        {/* Main Footer Content Removed as per user request */}


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
