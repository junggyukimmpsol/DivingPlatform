import React, { useState } from 'react'
import { FaFacebookMessenger } from 'react-icons/fa'
import { useLanguage } from '../../contexts/LanguageContext'

const FacebookFloatingButton: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false)
  const { t } = useLanguage()

  return (
    <a
      href="https://www.facebook.com/share/1Xyev7V9hL/?mibextid=wwXIfr"
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t.floating.facebook.ariaLabel}
      className="fixed bottom-[14.5rem] right-6 z-50 flex items-center gap-3 group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Tooltip */}
      <div
        className={`
          bg-slate-800/90 text-white text-sm font-medium px-4 py-2 rounded-full shadow-lg backdrop-blur-sm
          transition-all duration-300 whitespace-nowrap border border-white/10
          ${isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4 pointer-events-none'}
        `}
      >
        {t.floating.facebook.tooltip}
      </div>

      {/* Button */}
      <div className="relative">
        {/* Pulse Animation */}
        <div className="absolute inset-0 rounded-full bg-[#0084FF] animate-ping opacity-30"></div>

        {/* Main Button */}
        <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#00c6ff] to-[#0078FF] shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-[0_0_25px_rgba(0,132,255,0.6)] focus:outline-none focus:ring-2 focus:ring-[#0084FF] focus:ring-offset-2 focus:ring-offset-slate-900">
          <FaFacebookMessenger className="h-7 w-7 text-white drop-shadow-md" aria-hidden="true" />
        </div>
      </div>
    </a>
  )
}

export default FacebookFloatingButton
