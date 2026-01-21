import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
// Note: These tabs will be refined later as requested by the user
// For now, they are blocks within the BranchPage or separate components

const BranchPage: React.FC = () => {
  const { region, branch } = useParams<{ region: string; branch: string }>()
  const [activeTab, setActiveTab] = useState<'intro' | 'tours' | 'reviews'>('intro')

  // Mock data based on route
  const getBranchData = () => {
    if (branch === 'cebu') return { name: '세부 (Cebu)', flag: '🇵🇭' }
    if (branch === 'bohol') return { name: '보홀 (Bohol)', flag: '🇵🇭' }
    if (branch === 'kota-kinabalu') return { name: '코타키나발루 (Kota Kinabalu)', flag: '🇲🇾' }
    if (branch === 'bali') return { name: '발리 (Bali)', flag: '🇮🇩', note: '발리에는 4개의 지점이 운영되고 있습니다.' }
    return { name: branch || region, flag: '🌊' }
  }

  const data = getBranchData()

  return (
    <div className="pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Branch Header */}
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-4">
            <span className="text-4xl">{data.flag}</span>
            <span className="text-sm font-bold text-parks-gold uppercase tracking-widest">{region}</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
            {data.name}
          </h1>
          {data.note && (
            <p className="text-parks-gold font-medium">{data.note}</p>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 p-1 bg-white/5 rounded-xl border border-white/10 mb-8 w-full md:w-fit">
          <button
            onClick={() => setActiveTab('intro')}
            className={`flex-1 md:flex-none px-8 py-3 rounded-lg font-bold transition-all ${activeTab === 'intro' ? 'bg-parks-gold text-ocean-dark shadow-lg' : 'text-slate-400 hover:text-white'
              }`}
          >
            소개
          </button>
          <button
            onClick={() => setActiveTab('tours')}
            className={`flex-1 md:flex-none px-8 py-3 rounded-lg font-bold transition-all ${activeTab === 'tours' ? 'bg-parks-gold text-ocean-dark shadow-lg' : 'text-slate-400 hover:text-white'
              }`}
          >
            투어 & 가격
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`flex-1 md:flex-none px-8 py-3 rounded-lg font-bold transition-all ${activeTab === 'reviews' ? 'bg-parks-gold text-ocean-dark shadow-lg' : 'text-slate-400 hover:text-white'
              }`}
          >
            리뷰
          </button>
        </div>

        {/* Tab Content */}
        <div className="min-h-[400px]">
          {activeTab === 'intro' && (
            <div className="animate-fade-in space-y-8">
              <div className="glass-card p-8 rounded-2xl border border-white/10">
                <h3 className="text-2xl font-bold text-white mb-4">지점 특징 및 갤러리</h3>
                <p className="text-slate-400 leading-relaxed mb-6">
                  {data.name}의 멋진 다이빙 스팟과 시설을 소개합니다. (상세 내용은 추후 업데이트 예정)
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="aspect-video bg-white/5 rounded-xl border border-white/5 flex items-center justify-center text-slate-600">Photo Placeholder</div>
                  <div className="aspect-video bg-white/5 rounded-xl border border-white/5 flex items-center justify-center text-slate-600">Photo Placeholder</div>
                  <div className="aspect-video bg-white/5 rounded-xl border border-white/5 flex items-center justify-center text-slate-600">Video Placeholder</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'tours' && (
            <div className="animate-fade-in space-y-8">
              <div className="glass-card p-8 rounded-2xl border border-white/10">
                <h3 className="text-2xl font-bold text-white mb-4">투어 일정 및 옵션 별 가격</h3>
                <p className="text-slate-400 leading-relaxed mb-6">
                  전문화된 투어 프로그램과 합리적인 가격표입니다. (상세 내용은 추후 업데이트 예정)
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="py-4 text-white">프로그램</th>
                        <th className="py-4 text-white">기간</th>
                        <th className="py-4 text-white text-right">가격</th>
                      </tr>
                    </thead>
                    <tbody className="text-slate-400">
                      <tr className="border-b border-white/5">
                        <td className="py-4">펀 다이빙 (2회)</td>
                        <td className="py-4">1일</td>
                        <td className="py-4 text-right text-parks-gold">$120</td>
                      </tr>
                      <tr className="border-b border-white/5">
                        <td className="py-4">자격증 코스 (OW)</td>
                        <td className="py-4">3일</td>
                        <td className="py-4 text-right text-parks-gold">$350</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="animate-fade-in space-y-8">
              <div className="glass-card p-8 rounded-2xl border border-white/10">
                <h3 className="text-2xl font-bold text-white mb-4">리뷰</h3>
                <p className="text-slate-400 leading-relaxed mb-6">
                  실제 다이버들의 생생한 후기입니다. (상세 내용은 추후 업데이트 예정)
                </p>
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="p-6 bg-white/5 rounded-xl border border-white/5">
                      <div className="flex justify-between mb-2">
                        <span className="text-white font-bold">Diver {i}</span>
                        <div className="text-parks-gold">★★★★★</div>
                      </div>
                      <p className="text-slate-400 text-sm">정말 최고의 경험이었습니다. 강사님들이 친절하고 포인트가 환상적이에요!</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default BranchPage
