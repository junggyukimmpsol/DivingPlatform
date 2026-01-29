import React, { useState } from 'react'
import { FaWhatsapp } from 'react-icons/fa'
import { useLanguage } from '../../contexts/LanguageContext'

const WhatsAppFloatingButton: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false)
  const { t } = useLanguage()

  // WhatsApp 링크 - ParksLocalDiving (+82 10 5064 1330)
  const whatsappLink = 'https://wa.me/821050641330'

  return (
    <a
      href={whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t.floating.whatsapp.ariaLabel}
      className="fixed bottom-24 right-6 z-50 flex items-center gap-3 group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Tooltip */}
      <div
        className={`
          bg-slate-800 text-white text-sm font-medium px-4 py-2 rounded-full shadow-lg
          transition-all duration-300 whitespace-nowrap
          ${isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4 pointer-events-none'}
        `}
      >
        {t.floating.whatsapp.tooltip}
      </div>

      {/* Button */}
      <div className="relative">
        {/* Pulse Animation */}
        <div className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-30"></div>

        {/* Main Button */}
        <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-[0_0_20px_rgba(37,211,102,0.5)] focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:ring-offset-2 focus:ring-offset-slate-900">
          <FaWhatsapp className="h-7 w-7 text-white" aria-hidden="true" />
        </div>
      </div>
    </a>
  )
}

export default WhatsAppFloatingButton
