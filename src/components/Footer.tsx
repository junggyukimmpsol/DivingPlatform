import React from 'react'
import { FaInstagram, FaFacebookF, FaEnvelope, FaMapMarkerAlt, FaStar, FaTrophy, FaUsers, FaPercent } from 'react-icons/fa'
import { useLanguage } from '../contexts/LanguageContext'

const Footer = () => {
  const { t } = useLanguage()
  const certificationIcons = [FaStar, FaTrophy, FaUsers, FaPercent]
  const certificationColors = ['text-parks-gold', 'text-ocean-teal', 'text-slate-300', 'text-parks-gold']

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
            <h3 className="mb-4 font-display text-3xl font-bold text-parks-gold drop-shadow-[0_0_20px_rgba(251,191,36,0.3)]">{t.footer.companyName}</h3>
            <p className="mb-6 font-body text-sm leading-relaxed text-slate-400">
              {t.footer.companyDescription}
            </p>
            <div className="flex gap-3">
              <a
                href="https://www.instagram.com/parks_local_diving"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t.footer.instagramAriaLabel}
                className="group flex h-11 w-11 items-center justify-center rounded-lg bg-ocean-teal/20 border border-ocean-teal/30 text-xl transition-all duration-300 hover:bg-ocean-teal hover:scale-110 focus:outline-none focus:ring-2 focus:ring-ocean-teal focus:ring-offset-2 focus:ring-offset-ocean-deep"
                title="Instagram"
              >
                <FaInstagram className="group-hover:scale-110 transition-transform" aria-hidden="true" />
              </a>
              <a
                href="https://www.facebook.com/share/1Xyev7V9hL/?mibextid=wwXIfr"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t.footer.facebookAriaLabel}
                className="group flex h-11 w-11 items-center justify-center rounded-lg bg-parks-blue/20 border border-parks-blue/30 text-xl transition-all duration-300 hover:bg-parks-blue hover:scale-110 focus:outline-none focus:ring-2 focus:ring-parks-blue focus:ring-offset-2 focus:ring-offset-ocean-deep"
                title="Facebook"
              >
                <FaFacebookF className="group-hover:scale-110 transition-transform" aria-hidden="true" />
              </a>
              <a
                href="mailto:parksdiving@gmail.com"
                aria-label={t.footer.emailAriaLabel}
                className="group flex h-11 w-11 items-center justify-center rounded-lg bg-parks-gold/10 border border-parks-gold/30 text-xl transition-all duration-300 hover:bg-parks-gold hover:scale-110 focus:outline-none focus:ring-2 focus:ring-parks-gold focus:ring-offset-2 focus:ring-offset-ocean-dark"
                title="Email"
              >
                <FaEnvelope className="group-hover:scale-110 transition-transform" aria-hidden="true" />
              </a>
            </div>
          </div>

          {/* Locations */}
          <div>
            <h4 className="mb-6 font-display text-xl font-bold text-ocean-teal">{t.footer.locationsTitle}</h4>
            <ul className="space-y-3 font-body text-sm">
              {t.footer.locationsList.map((location, index) => (
                <li key={index} className="flex items-center gap-3 group">
                  <FaMapMarkerAlt className="text-lg text-parks-yellow group-hover:scale-125 transition-transform" />
                  <span className="group-hover:text-ocean-teal transition-colors">{location}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-6 font-display text-xl font-bold text-ocean-teal">{t.footer.servicesTitle}</h4>
            <ul className="space-y-3 font-body text-sm">
              {t.footer.servicesList.map((service, index) => (
                <li key={index} className="hover:text-parks-gold transition-colors cursor-pointer hover:translate-x-1 duration-300">
                  {service}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="mb-6 font-display text-xl font-bold text-ocean-teal">{t.footer.contactTitle}</h4>
            <ul className="space-y-4 font-body text-sm">
              <li>
                <span className="font-semibold text-ocean-teal/80">{t.footer.emailLabel}</span>
                <br />
                <a href="mailto:parksdiving@gmail.com" className="hover:text-parks-gold transition-colors">
                  parksdiving@gmail.com
                </a>
              </li>
              <li>
                <span className="font-semibold text-ocean-teal/80">{t.footer.instagramLabel}</span>
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
                <span className="font-semibold text-ocean-teal/80">{t.footer.facebookLabel}</span>
                <br />
                <a
                  href="https://www.facebook.com/share/1Xyev7V9hL/?mibextid=wwXIfr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-parks-gold transition-colors"
                >
                  {t.footer.companyName}
                </a>
              </li>
              <li>
                <span className="font-semibold text-ocean-teal/80">{t.footer.hoursLabel}</span>
                <br />
                <span className="text-sand/70">{t.footer.hoursValue}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Certifications & Awards */}
        <div className="my-12 border-t border-ocean-teal/20 pt-12">
          <div className="flex flex-wrap items-center justify-center gap-6 text-center">
            {t.footer.certifications.map((cert, index) => {
              const IconComponent = certificationIcons[index]
              const bgColors = ['bg-ocean-teal/10 border-ocean-teal/30 hover:bg-ocean-teal/20 hover:shadow-[0_0_30px_rgba(0,217,192,0.3)]', 'bg-parks-gold/10 border-parks-gold/30 hover:bg-parks-gold/20 hover:shadow-[0_0_30px_rgba(251,191,36,0.3)]', 'bg-coral/10 border-coral/30 hover:bg-coral/20 hover:shadow-[0_0_30px_rgba(255,107,107,0.3)]', 'bg-parks-blue/10 border-parks-blue/30 hover:bg-parks-blue/20 hover:shadow-[0_0_30px_rgba(91,159,255,0.3)]']
              return (
                <div key={index} className={`group rounded-2xl ${bgColors[index]} px-8 py-5 backdrop-blur-sm border-2 transition-all duration-300 hover:scale-105`}>
                  <IconComponent className={`text-3xl group-hover:scale-110 inline-block transition-transform ${certificationColors[index]}`} />
                  <p className={`mt-2 font-display text-sm font-bold ${certificationColors[index]}`}>{cert}</p>
                </div>
              )
            })}
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
