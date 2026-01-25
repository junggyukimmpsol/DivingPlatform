import React from 'react'
import { Outlet, useParams, Navigate } from 'react-router-dom'
import CenterNavigation from '../components/center/CenterNavigation'
import Footer from '../components/Footer'
import SocialFloatingButtons from '../components/common/SocialFloatingButtons'
import { getCenterById } from '../data/centers'

/**
 * 센터 페이지 공통 레이아웃
 */
const CenterLayout: React.FC = () => {
  const { centerId } = useParams<{ centerId: string }>()
  const center = centerId ? getCenterById(centerId) : null

  // 유효하지 않은 센터 ID인 경우 홈으로 리다이렉트
  if (!center) {
    return <Navigate to="/" replace />
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col">
      {/* 이중 상단바 네비게이션 */}
      <CenterNavigation />

      {/* 메인 콘텐츠 영역 (탭 페이지 렌더링) */}
      <main className="flex-grow pt-8 pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Outlet context={{ center }} />
        </div>
      </main>

      <Footer />
      <SocialFloatingButtons />
    </div>
  )
}

export default CenterLayout
