import React, { useState } from 'react'
import { FaWhatsapp, FaInstagram, FaFacebookMessenger, FaComments, FaTimes } from 'react-icons/fa'

interface SocialButton {
  id: string
  icon: React.ElementType
  label: string
  href: string
  bgColor: string
  hoverShadow: string
  gradient?: string
}

const SocialFloatingButtons: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [hoveredButton, setHoveredButton] = useState<string | null>(null)

  const socialButtons: SocialButton[] = [
    {
      id: 'kakao',
      icon: () => (
        <svg viewBox="0 0 24 24" className="h-6 w-6 fill-[#3C1E1E]" aria-hidden="true">
          <path d="M12 3C6.477 3 2 6.477 2 10.5c0 2.47 1.607 4.647 4.035 5.906-.178.662-.454 1.695-.52 1.96-.08.318.117.314.247.229.102-.067 1.627-1.07 2.286-1.506.627.092 1.28.141 1.952.141 5.523 0 10-3.477 10-7.73S17.523 3 12 3z" />
        </svg>
      ),
      label: '카카오톡',
      href: 'https://pf.kakao.com/_xhhbxcn',
      bgColor: 'bg-[#FEE500]',
      hoverShadow: 'hover:shadow-[0_0_25px_rgba(254,229,0,0.6)]',
    },
    {
      id: 'whatsapp',
      icon: FaWhatsapp,
      label: 'WhatsApp',
      href: 'https://wa.me/821050641330',
      bgColor: 'bg-[#25D366]',
      hoverShadow: 'hover:shadow-[0_0_25px_rgba(37,211,102,0.6)]',
    },
    {
      id: 'instagram',
      icon: FaInstagram,
      label: 'Instagram',
      href: 'https://www.instagram.com/parks_local_diving',
      bgColor: 'bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7]',
      hoverShadow: 'hover:shadow-[0_0_25px_rgba(238,42,123,0.6)]',
      gradient: 'from-[#f9ce34] via-[#ee2a7b] to-[#6228d7]',
    },
    {
      id: 'facebook',
      icon: FaFacebookMessenger,
      label: 'Facebook',
      href: 'https://www.facebook.com/share/1Xyev7V9hL/?mibextid=wwXIfr',
      bgColor: 'bg-gradient-to-br from-[#00c6ff] to-[#0078FF]',
      hoverShadow: 'hover:shadow-[0_0_25px_rgba(0,132,255,0.6)]',
      gradient: 'from-[#00c6ff] to-[#0078FF]',
    },
  ]

  return (
    <div
      className="fixed bottom-6 right-6 z-50 flex flex-col-reverse items-end gap-3"
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      {/* Main Toggle Button */}
      <div
        role="button"
        aria-label={isExpanded ? '메뉴 닫기' : '문의하기'}
        aria-expanded={isExpanded}
        className={`
          relative flex h-16 w-16 items-center justify-center rounded-full
          bg-gradient-to-br from-parks-gold via-amber-400 to-orange-500
          shadow-lg transition-all duration-500 ease-out
          hover:scale-110 hover:shadow-[0_0_30px_rgba(251,191,36,0.6)]
          focus:outline-none focus:ring-2 focus:ring-parks-gold focus:ring-offset-2 focus:ring-offset-slate-900
          ${isExpanded ? 'rotate-0' : 'animate-bounce-subtle'}
        `}
      >
        {/* Pulse ring when closed */}
        {!isExpanded && (
          <div className="absolute inset-0 rounded-full bg-parks-gold animate-ping opacity-30"></div>
        )}

        <div className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
          {isExpanded ? (
            <FaTimes className="h-7 w-7 text-ocean-dark" />
          ) : (
            <FaComments className="h-7 w-7 text-ocean-dark" />
          )}
        </div>
      </div>

      {/* Social Buttons */}
      <div className={`flex flex-col-reverse gap-3 transition-all duration-500 ${isExpanded ? 'opacity-100 scale-100' : 'opacity-0 scale-90 pointer-events-none'}`}>
        {socialButtons.map((button, index) => {
          const Icon = button.icon
          const isHovered = hoveredButton === button.id

          return (
            <a
              key={button.id}
              href={button.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${button.label}로 문의하기`}
              className={`
                flex items-center gap-3 transition-all duration-300 ease-out
                ${isExpanded
                  ? 'translate-y-0 opacity-100'
                  : 'translate-y-4 opacity-0 pointer-events-none'
                }
              `}
              style={{
                transitionDelay: isExpanded ? `${index * 75}ms` : '0ms'
              }}
              onMouseEnter={() => setHoveredButton(button.id)}
              onMouseLeave={() => setHoveredButton(null)}
            >
              {/* Tooltip */}
              <div
                className={`
                  bg-slate-800/95 text-white text-sm font-medium px-4 py-2 rounded-full
                  shadow-xl backdrop-blur-md border border-white/10
                  transition-all duration-300 whitespace-nowrap
                  ${isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4 pointer-events-none'}
                `}
              >
                {button.label}
              </div>

              {/* Button */}
              <div
                className={`
                  relative flex h-14 w-14 items-center justify-center rounded-full
                  ${button.bgColor} shadow-lg transition-all duration-300
                  hover:scale-110 ${button.hoverShadow}
                  focus:outline-none
                `}
              >
                <Icon className={`h-6 w-6 ${button.id === 'kakao' ? '' : 'text-white'} drop-shadow-sm`} />
              </div>
            </a>
          )
        })}
      </div>

    </div>
  )
}

export default SocialFloatingButtons
