import React from 'react'
import { useOutletContext } from 'react-router-dom'
import { CenterOutletContext } from '../../types/center.types'

import { useLanguage } from '../../contexts/LanguageContext'

const IntroductionTab: React.FC = () => {
  const { center } = useOutletContext<CenterOutletContext>()
  const { t, language } = useLanguage()

  const displayName = language === 'en' ? center.name : center.nameKo

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-white">
              {displayName} <span className="text-parks-gold">{t.branchTabs.intro.title}</span>
            </h1>
          </div>
        </div>
        <p className="text-lg text-slate-300 leading-relaxed max-w-3xl">
          {center.description}{t.branchTabs.intro.descriptionSuffix}
          <br />
          {t.branchTabs.intro.updatingNotice}
        </p>
      </div>

      {/* 플레이스홀더 섹션 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="aspect-video rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-500 italic text-center p-4">
          {t.branchTabs.intro.placeholderPhotos}
        </div>
        <div className="aspect-video rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-500 italic text-center p-4">
          {t.branchTabs.intro.placeholderVideo}
        </div>
      </div>

      <div className="mt-12 p-8 rounded-2xl bg-gradient-to-br from-ocean-dark to-slate-900 border border-white/5">
        <h3 className="text-xl font-bold text-white mb-4">{t.branchTabs.intro.spotFeaturesTitle}</h3>
        <ul className="space-y-3 text-slate-300">
          <li className="flex items-center gap-2">
            <span className="text-parks-gold">✓</span> {t.branchTabs.intro.feature1}
          </li>
          <li className="flex items-center gap-2">
            <span className="text-parks-gold">✓</span> {t.branchTabs.intro.feature2}
          </li>
          <li className="flex items-center gap-2">
            <span className="text-parks-gold">✓</span> {t.branchTabs.intro.feature3}
          </li>
        </ul>
      </div>
    </div>
  )
}

export default IntroductionTab
