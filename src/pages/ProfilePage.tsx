import React, { FormEvent, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { FaCertificate, FaRulerVertical, FaSave, FaSignOutAlt, FaWeight } from 'react-icons/fa'
import FormField from '../components/auth/FormField'
import { useAuth } from '../contexts/AuthContext'
import { getCertificateImageSizeError, MAX_CERTIFICATE_IMAGE_MB } from '../constants/upload'

const ProfilePage: React.FC = () => {
  const { user, isLoading, updateProfile, logout } = useAuth()
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (isLoading) {
    return <div className="min-h-screen px-4 pt-32 text-center text-slate-300">불러오는 중...</div>
  }

  if (!user) return <Navigate to="/auth" replace />

  const profile = user.profile

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    setSuccess('')
    setIsSubmitting(true)

    try {
      const formData = new FormData(event.currentTarget)
      const image = formData.get('certificationImage')
      const imageError = getCertificateImageSizeError(image instanceof File && image.size > 0 ? image : null)
      if (imageError) throw new Error(imageError)

      await updateProfile(formData)
      setSuccess('다이빙 정보가 저장되었습니다.')
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : '저장 중 오류가 발생했습니다.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen px-4 pt-28 pb-20">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-parks-gold">Diver profile</p>
            <h1 className="mt-3 text-4xl font-black text-white md:text-5xl">내 다이빙 정보</h1>
            <p className="mt-3 text-slate-300">{user.name}님의 렌탈 장비 준비 정보입니다.</p>
          </div>
          <button
            type="button"
            onClick={logout}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm font-bold text-slate-200 transition hover:border-parks-gold/50 hover:text-parks-gold"
          >
            <FaSignOutAlt />
            로그아웃
          </button>
        </div>

        <div className="mb-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border border-white/10 bg-white/5 p-5">
            <FaCertificate className="mb-3 text-2xl text-parks-gold" />
            <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Certification</p>
            <p className="mt-2 text-lg font-black text-white">{profile.certificationLevel || '미입력'}</p>
            <p className="text-sm text-slate-400">{profile.certificationAgency || '발급 단체 미입력'}</p>
          </div>
          <div className="rounded-lg border border-white/10 bg-white/5 p-5">
            <FaRulerVertical className="mb-3 text-2xl text-ocean-teal" />
            <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Body</p>
            <p className="mt-2 text-lg font-black text-white">{profile.heightCm || '-'} cm</p>
            <p className="text-sm text-slate-400">렌탈 수트 참고</p>
          </div>
          <div className="rounded-lg border border-white/10 bg-white/5 p-5">
            <FaWeight className="mb-3 text-2xl text-ocean-cyan" />
            <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Gear</p>
            <p className="mt-2 text-lg font-black text-white">{profile.footSizeMm || '-'} mm</p>
            <p className="text-sm text-slate-400">부츠/핀 사이즈 참고</p>
          </div>
        </div>

        <form className="rounded-lg border border-white/10 bg-slate-900/80 p-5 md:p-8" onSubmit={handleSubmit}>
          <div className="grid gap-5 md:grid-cols-2">
            <FormField label="연락처" name="phone" defaultValue={profile.phone} />
            <FormField label="자격증 발급 단체" name="certificationAgency" defaultValue={profile.certificationAgency} />
            <FormField label="자격증 레벨" name="certificationLevel" defaultValue={profile.certificationLevel} />
            <FormField label="선호 수트 사이즈" name="preferredSuitSize" defaultValue={profile.preferredSuitSize} />
          </div>

          <div className="mt-5 grid gap-5 md:grid-cols-3">
            <FormField label="키(cm)" name="heightCm" type="number" min="100" max="230" step="0.1" defaultValue={profile.heightCm} />
            <FormField label="몸무게(kg)" name="weightKg" type="number" min="30" max="200" step="0.1" defaultValue={profile.weightKg} />
            <FormField label="발 사이즈(mm)" name="footSizeMm" type="number" min="180" max="330" step="1" defaultValue={profile.footSizeMm} />
          </div>

          <div className="mt-5 grid gap-5 md:grid-cols-[1fr_0.8fr]">
            <label className="block">
              <span className="mb-2 block text-sm font-bold text-slate-200">자격증 사진 교체</span>
              <input
                name="certificationImage"
                type="file"
                accept="image/*"
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300 file:mr-4 file:rounded-md file:border-0 file:bg-parks-gold file:px-3 file:py-2 file:text-sm file:font-bold file:text-ocean-dark"
              />
              <span className="mt-2 block text-xs text-slate-400">이미지 파일만 가능, 최대 {MAX_CERTIFICATE_IMAGE_MB}MB</span>
            </label>
            <div className="rounded-lg border border-white/10 bg-white/5 p-4">
              <p className="text-sm font-bold text-slate-200">현재 자격증</p>
              {profile.hasCertificationImage ? (
                <Link
                  to="/api/profile/certificate"
                  target="_blank"
                  className="mt-2 inline-flex text-sm font-bold text-parks-gold hover:text-parks-gold-light"
                >
                  등록된 이미지 보기
                </Link>
              ) : (
                <p className="mt-2 text-sm text-slate-400">아직 등록된 이미지가 없습니다.</p>
              )}
            </div>
          </div>

          <label className="mt-5 block">
            <span className="mb-2 block text-sm font-bold text-slate-200">메모</span>
            <textarea
              name="memo"
              rows={4}
              defaultValue={profile.memo}
              className="w-full resize-none rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition focus:border-parks-gold/70 focus:bg-white/10"
            />
          </label>

          {error && <div className="mt-5 rounded-lg border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</div>}
          {success && <div className="mt-5 rounded-lg border border-emerald-400/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">{success}</div>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-parks-gold px-5 py-4 text-sm font-black text-ocean-dark transition hover:bg-parks-gold-light disabled:cursor-not-allowed disabled:opacity-60 md:w-auto"
          >
            <FaSave />
            {isSubmitting ? '저장 중...' : '정보 저장'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default ProfilePage
