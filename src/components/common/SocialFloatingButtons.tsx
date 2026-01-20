import React, { useState, useCallback } from 'react'
import { FaWhatsapp, FaInstagram, FaFacebookMessenger, FaComments, FaTimes, FaGlobe } from 'react-icons/fa'
import { useLanguage } from '../../contexts/LanguageContext'

type ChannelId = 'kakao' | 'whatsapp' | 'instagram' | 'facebook'
type SupportedLanguage = 'ko' | 'en' | 'zh'

interface SocialButton {
  id: ChannelId
  icon: React.ElementType
  href: string
  bgColor: string
  hoverShadow: string
  gradient?: string
  supportedLanguages: SupportedLanguage[]
  responseTime: 'instant' | 'within1h'
  isPrimary?: boolean
}

const KakaoIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
    <path d="M12 3C6.477 3 2 6.477 2 10.5c0 2.47 1.607 4.647 4.035 5.906-.178.662-.454 1.695-.52 1.96-.08.318.117.314.247.229.102-.067 1.627-1.07 2.286-1.506.627.092 1.28.141 1.952.141 5.523 0 10-3.477 10-7.73S17.523 3 12 3z" />
  </svg>
)

const LANGUAGE_FLAGS: Record<SupportedLanguage, string> = {
  ko: '🇰🇷',
  en: '🇺🇸',
  zh: '🇨🇳',
}

const SocialFloatingButtons: React.FC = () => {
  const { t } = useLanguage()
  const [isExpanded, setIsExpanded] = useState(false)
  const [hoveredButton, setHoveredButton] = useState<ChannelId | null>(null)

  const socialButtons: SocialButton[] = [
    {
      id: 'kakao',
      icon: KakaoIcon,
      href: 'https://pf.kakao.com/_xhhbxcn',
      bgColor: 'bg-[#FEE500]',
      hoverShadow: 'hover:shadow-[0_0_25px_rgba(254,229,0,0.6)]',
      supportedLanguages: ['ko', 'en', 'zh'],
      responseTime: 'instant',
      isPrimary: true,
    },
    {
      id: 'whatsapp',
      icon: FaWhatsapp,
      href: 'https://wa.me/821050641330',
      bgColor: 'bg-[#25D366]',
      hoverShadow: 'hover:shadow-[0_0_25px_rgba(37,211,102,0.6)]',
      supportedLanguages: ['en', 'ko', 'zh'],
      responseTime: 'instant',
      isPrimary: true,
    },
    {
      id: 'instagram',
      icon: FaInstagram,
      href: 'https://www.instagram.com/parks_local_diving',
      bgColor: 'bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7]',
      hoverShadow: 'hover:shadow-[0_0_25px_rgba(238,42,123,0.6)]',
      supportedLanguages: ['ko', 'en'],
      responseTime: 'within1h',
      isPrimary: false,
    },
    {
      id: 'facebook',
      icon: FaFacebookMessenger,
      href: 'https://www.facebook.com/share/1Xyev7V9hL/?mibextid=wwXIfr',
      bgColor: 'bg-gradient-to-br from-[#00c6ff] to-[#0078FF]',
      hoverShadow: 'hover:shadow-[0_0_25px_rgba(0,132,255,0.6)]',
      supportedLanguages: ['en', 'ko'],
      responseTime: 'within1h',
      isPrimary: false,
    },
  ]

  const toggleExpanded = useCallback(() => {
    setIsExpanded((prev) => !prev)
  }, [])

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col-reverse items-end gap-3">
      {/* Main Toggle Button with 24/7 Badge */}
      <button
        onClick={toggleExpanded}
        aria-label={isExpanded ? t.floating.closeMenu : t.floating.mainButton}
        aria-expanded={isExpanded}
        aria-controls="social-buttons-menu"
        className={`
          relative flex h-16 w-16 items-center justify-center rounded-full
          bg-gradient-to-br from-parks-gold via-amber-400 to-orange-500
          shadow-lg transition-all duration-300 ease-out
          hover:scale-110 hover:shadow-xl
          focus:outline-none focus:ring-2 focus:ring-parks-gold focus:ring-offset-2 focus:ring-offset-slate-900
        `}
      >
        {/* 24/7 Badge - 정적 (애니메이션 없음) */}
        <div className="absolute -top-1 -right-1 z-10">
          <span className="
            flex items-center justify-center
            bg-green-500 text-white text-[9px] font-bold
            px-1.5 py-0.5 rounded-full
            border border-green-400 shadow-md
          ">
            {t.floating.badge24h}
          </span>
        </div>

        {/* Icon */}
        <div className={`transition-transform duration-300 ${isExpanded ? 'rotate-90' : ''}`}>
          {isExpanded ? (
            <FaTimes className="h-7 w-7 text-ocean-dark" />
          ) : (
            <FaComments className="h-7 w-7 text-ocean-dark" />
          )}
        </div>
      </button>

      {/* Multilingual Header (when expanded) */}
      {isExpanded && (
        <div
          className="
            glass-card rounded-xl px-4 py-3
            text-center min-w-[200px]
            transition-opacity duration-300
          "
        >
          {/* Multilingual badge */}
          <div className="flex items-center justify-center gap-2 mb-2">
            <FaGlobe className="text-ocean-teal h-4 w-4" />
            <span className="text-sm font-bold text-white">
              {t.floating.multiLanguage}
            </span>
          </div>

          {/* Language flags */}
          <div className="flex items-center justify-center gap-3 text-xs text-slate-300">
            <span>{LANGUAGE_FLAGS.ko} 한국어</span>
            <span>{LANGUAGE_FLAGS.en} English</span>
            <span>{LANGUAGE_FLAGS.zh} 中文</span>
          </div>
        </div>
      )}

      {/* Social Buttons */}
      <div
        id="social-buttons-menu"
        role="menu"
        aria-label={t.floating.multiLanguage}
        className={`
          flex flex-col-reverse gap-3 transition-all duration-300
          ${isExpanded ? 'opacity-100' : 'opacity-0 pointer-events-none'}
        `}
      >
        {socialButtons.map((button, index) => {
          const Icon = button.icon
          const isHovered = hoveredButton === button.id

          return (
            <a
              key={button.id}
              href={button.href}
              target="_blank"
              rel="noopener noreferrer"
              role="menuitem"
              aria-label={`${t.floating.channels[button.id].name} - ${t.floating.channels[button.id].description}`}
              className={`
                flex items-center gap-3 transition-all duration-300 ease-out
                ${isExpanded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0 pointer-events-none'}
              `}
              style={{
                transitionDelay: isExpanded ? `${index * 50}ms` : '0ms',
              }}
              onMouseEnter={() => setHoveredButton(button.id)}
              onMouseLeave={() => setHoveredButton(null)}
            >
              {/* Enhanced Tooltip */}
              <div
                className={`
                  glass-card rounded-xl px-4 py-3 shadow-xl min-w-[180px]
                  transition-all duration-300
                  ${isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4 pointer-events-none'}
                `}
              >
                {/* Channel name */}
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-bold text-white text-sm">
                    {t.floating.channels[button.id].name}
                  </span>
                  {button.isPrimary && (
                    <span className="bg-parks-gold/20 text-parks-gold text-[10px] px-2 py-0.5 rounded-full font-medium">
                      추천
                    </span>
                  )}
                </div>

                {/* Description */}
                <p className="text-xs text-slate-400 mb-2">
                  {t.floating.channels[button.id].description}
                </p>

                {/* Supported languages */}
                <div className="flex items-center gap-1.5 text-xs mb-1.5">
                  <span className="text-slate-500">{t.floating.languageSupport}:</span>
                  <div className="flex gap-1">
                    {button.supportedLanguages.map((lang) => (
                      <span key={lang} className="text-base">
                        {LANGUAGE_FLAGS[lang]}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Response time indicator */}
                <div className="flex items-center gap-1.5 text-xs">
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                  <span className="text-green-400">
                    {button.responseTime === 'instant' ? t.floating.instant : t.floating.within1h}
                  </span>
                </div>
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
                <Icon
                  className={`h-6 w-6 ${button.id === 'kakao' ? 'fill-[#3C1E1E]' : 'text-white'} drop-shadow-sm`}
                />
              </div>
            </a>
          )
        })}
      </div>

      {/* Backdrop overlay when expanded */}
      {isExpanded && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm -z-10 transition-opacity duration-300"
          onClick={toggleExpanded}
          aria-hidden="true"
        />
      )}
    </div>
  )
}

export default SocialFloatingButtons
