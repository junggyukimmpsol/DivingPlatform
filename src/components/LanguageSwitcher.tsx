import React from 'react'
import { useLanguage } from '../contexts/LanguageContext'
import { Language } from '../i18n/translations'

const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage()

  const languages: { code: Language; label: string; flag: string }[] = [
    { code: 'ko', label: '한국어', flag: '🇰🇷' },
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'zh', label: '中文', flag: '🇨🇳' },
  ]

  return (
    <div className="flex gap-0.5 md:gap-1">
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => setLanguage(lang.code)}
          className={`
            px-3 py-1.5 rounded-md font-body text-sm font-medium transition-all duration-200
            ${language === lang.code
              ? 'bg-parks-yellow/20 text-parks-yellow border border-parks-yellow/40'
              : 'text-slate-400 hover:bg-navy hover:text-white'
            }
          `}
          title={lang.label}
        >
          <span className="mr-1">{lang.flag}</span>
          <span className="hidden sm:inline">{lang.label}</span>
        </button>
      ))}
    </div>
  )
}

export default LanguageSwitcher
