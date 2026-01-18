import React, { useState } from 'react'

const KakaoFloatingButton: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <a
      href="https://pf.kakao.com/_xhhbxcn"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="카카오톡으로 상담하기"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 group"
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
        카카오톡 상담
      </div>

      {/* Button */}
      <div className="relative">
        {/* Pulse Animation */}
        <div className="absolute inset-0 rounded-full bg-[#FEE500] animate-ping opacity-30"></div>

        {/* Main Button */}
        <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#FEE500] shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-[0_0_20px_rgba(254,229,0,0.5)] focus:outline-none focus:ring-2 focus:ring-[#FEE500] focus:ring-offset-2 focus:ring-offset-slate-900">
          {/* Kakao Icon */}
          <svg
            viewBox="0 0 24 24"
            className="h-7 w-7 fill-[#3C1E1E]"
            aria-hidden="true"
          >
            <path d="M12 3C6.477 3 2 6.477 2 10.5c0 2.47 1.607 4.647 4.035 5.906-.178.662-.454 1.695-.52 1.96-.08.318.117.314.247.229.102-.067 1.627-1.07 2.286-1.506.627.092 1.28.141 1.952.141 5.523 0 10-3.477 10-7.73S17.523 3 12 3z" />
          </svg>
        </div>
      </div>
    </a>
  )
}

export default KakaoFloatingButton
