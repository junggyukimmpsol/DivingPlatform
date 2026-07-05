import React, { FormEvent, useState } from 'react'
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom'
import { FaArrowRight, FaLock, FaUserPlus } from 'react-icons/fa'
import FormField from '../components/auth/FormField'
import { useAuth } from '../contexts/AuthContext'
import { getCertificateImageSizeError, MAX_CERTIFICATE_IMAGE_MB } from '../constants/upload'

const AuthPage: React.FC = () => {
  const [searchParams] = useSearchParams()
  const mode = searchParams.get('mode') === 'register' ? 'register' : 'login'
  const isRegister = mode === 'register'
  const { user, login, register, resendVerification } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [verificationEmail, setVerificationEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isResending, setIsResending] = useState(false)

  if (user) return <Navigate to="/profile" replace />

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    setSuccess('')
    setIsSubmitting(true)

    try {
      const formData = new FormData(event.currentTarget)
      const name = String(formData.get('name') || '').trim()
      const email = String(formData.get('email') || '').trim()
      const password = String(formData.get('password') || '')

      if (isRegister && !name) throw new Error('이름을 입력해주세요.')
      if (!email) throw new Error('이메일을 입력해주세요.')
      if (!password) throw new Error('비밀번호를 입력해주세요.')
      if (password.length < 8) throw new Error('비밀번호는 8자 이상이어야 합니다.')

      const image = formData.get('certificationImage')
      const imageError = getCertificateImageSizeError(image instanceof File && image.size > 0 ? image : null)
      if (imageError) throw new Error(imageError)

      if (isRegister) {
        const result = await register(formData)
        setVerificationEmail(email)
        setSuccess(result.message || '인증 메일을 보냈습니다. 이메일 인증 후 로그인해주세요.')
      } else {
        await login(email, String(formData.get('password') || ''))
        navigate('/profile')
      }
    } catch (caught) {
      const emailInput = event.currentTarget.elements.namedItem('email')
      if (emailInput instanceof HTMLInputElement) setVerificationEmail(emailInput.value)
      setError(caught instanceof Error ? caught.message : '처리 중 오류가 발생했습니다.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleResendVerification = async () => {
    if (!verificationEmail) {
      setError('인증 메일을 받을 이메일을 입력해주세요.')
      return
    }

    setError('')
    setSuccess('')
    setIsResending(true)
    try {
      const message = await resendVerification(verificationEmail)
      setSuccess(message)
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : '인증 메일 재발송에 실패했습니다.')
    } finally {
      setIsResending(false)
    }
  }

  return (
    <div className="min-h-screen px-4 pt-28 pb-20">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="pt-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-parks-gold/30 bg-parks-gold/10 px-4 py-2 text-sm font-bold text-parks-gold">
            {isRegister ? <FaUserPlus /> : <FaLock />}
            Diver profile
          </div>
          <h1 className="mt-6 text-4xl font-black leading-tight text-white md:text-5xl">
            {isRegister ? '다이빙 투어 준비 정보를 한 번에 저장하세요' : '로그인하고 내 다이빙 정보를 확인하세요'}
          </h1>
          <p className="mt-5 max-w-xl text-base leading-8 text-slate-300">
            자격증 사진, 키, 몸무게, 발 사이즈를 저장해두면 다음 예약 때 반복 입력 없이
            렌탈 수트와 장비 준비에 바로 활용할 수 있습니다.
          </p>
          <div className="mt-8 grid gap-3 text-sm text-slate-300">
            <div className="rounded-lg border border-white/10 bg-white/5 p-4">
              자격증 이미지는 공개 URL이 아니라 로그인한 본인 요청으로만 불러옵니다.
            </div>
            <div className="rounded-lg border border-white/10 bg-white/5 p-4">
              비밀번호는 원문 저장 없이 해시 처리해서 D1 데이터베이스에 저장합니다.
            </div>
          </div>
        </section>

        <section className="rounded-lg border border-white/10 bg-slate-900/80 p-5 shadow-2xl shadow-black/30 md:p-8">
          <div className="mb-6 flex rounded-lg border border-white/10 bg-white/5 p-1">
            <Link
              to="/auth"
              className={`flex-1 rounded-md px-4 py-3 text-center text-sm font-bold transition ${!isRegister ? 'bg-parks-gold text-ocean-dark' : 'text-slate-300 hover:text-white'}`}
            >
              로그인
            </Link>
            <Link
              to="/auth?mode=register"
              className={`flex-1 rounded-md px-4 py-3 text-center text-sm font-bold transition ${isRegister ? 'bg-parks-gold text-ocean-dark' : 'text-slate-300 hover:text-white'}`}
            >
              회원가입
            </Link>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit} noValidate>
            {isRegister && <FormField label="이름" name="name" required placeholder="홍길동" />}
            <FormField label="이메일" name="email" type="email" required placeholder="diver@example.com" />
            <FormField label="비밀번호" name="password" type="password" required placeholder="8자 이상" />

            {isRegister && (
              <>
                <div className="grid gap-4 md:grid-cols-2">
                  <FormField label="연락처" name="phone" placeholder="010-0000-0000" />
                  <FormField label="자격증 발급 단체" name="certificationAgency" placeholder="PADI, SSI, NAUI..." />
                </div>
                <FormField label="자격증 레벨" name="certificationLevel" placeholder="Open Water, Advanced..." />
                <label className="block">
                  <span className="mb-2 block text-sm font-bold text-slate-200">다이빙 자격증 사진</span>
                  <input
                    name="certificationImage"
                    type="file"
                    accept="image/*"
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300 file:mr-4 file:rounded-md file:border-0 file:bg-parks-gold file:px-3 file:py-2 file:text-sm file:font-bold file:text-ocean-dark"
                  />
                  <span className="mt-2 block text-xs text-slate-400">이미지 파일만 가능, 최대 {MAX_CERTIFICATE_IMAGE_MB}MB</span>
                </label>
                <div className="grid gap-4 md:grid-cols-3">
                  <FormField label="키(cm)" name="heightCm" type="number" min="100" max="230" step="0.1" placeholder="175" />
                  <FormField label="몸무게(kg)" name="weightKg" type="number" min="30" max="200" step="0.1" placeholder="70" />
                  <FormField label="발 사이즈(mm)" name="footSizeMm" type="number" min="180" max="330" step="1" placeholder="270" />
                </div>
                <FormField label="선호 수트 사이즈" name="preferredSuitSize" placeholder="M, ML, L 등" />
                <label className="block">
                  <span className="mb-2 block text-sm font-bold text-slate-200">메모</span>
                  <textarea
                    name="memo"
                    rows={3}
                    placeholder="장비 준비 시 참고할 내용"
                    className="w-full resize-none rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition focus:border-parks-gold/70 focus:bg-white/10"
                  />
                </label>
              </>
            )}

            {error && (
              <div className="rounded-lg border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm leading-6 text-red-200" role="alert">
                {error}
              </div>
            )}
            {success && (
              <div className="rounded-lg border border-emerald-400/30 bg-emerald-500/10 px-4 py-3 text-sm leading-6 text-emerald-100" role="status">
                {success}
              </div>
            )}
            {isSubmitting && (
              <div className="rounded-lg border border-parks-gold/30 bg-parks-gold/10 px-4 py-3 text-sm font-bold text-parks-gold" role="status">
                서버에 요청 중입니다. 잠시만 기다려주세요.
              </div>
            )}
            {(success || error.includes('이메일 인증')) && (
              <button
                type="button"
                onClick={handleResendVerification}
                disabled={isResending}
                className="w-full rounded-lg border border-parks-gold/40 bg-parks-gold/10 px-5 py-3 text-sm font-black text-parks-gold transition hover:bg-parks-gold hover:text-ocean-dark disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isResending ? '다시 보내는 중...' : '인증 메일 다시 보내기'}
              </button>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-parks-gold px-5 py-4 text-sm font-black text-ocean-dark transition hover:bg-parks-gold-light disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? '처리 중...' : isRegister ? '가입하고 인증 메일 받기' : '로그인'}
              <FaArrowRight />
            </button>
          </form>
        </section>
      </div>
    </div>
  )
}

export default AuthPage
