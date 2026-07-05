import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { FaCheckCircle, FaEnvelopeOpenText, FaTimesCircle } from 'react-icons/fa'
import { useAuth } from '../contexts/AuthContext'

const VerifyEmailPage: React.FC = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { verifyEmail } = useAuth()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('이메일 인증을 확인하고 있습니다.')

  useEffect(() => {
    const token = searchParams.get('token')
    if (!token) {
      setStatus('error')
      setMessage('인증 토큰이 없습니다.')
      return
    }

    verifyEmail(token)
      .then(() => {
        setStatus('success')
        setMessage('이메일 인증이 완료되었습니다. 내 정보 화면으로 이동합니다.')
        window.setTimeout(() => navigate('/profile'), 1200)
      })
      .catch((caught) => {
        setStatus('error')
        setMessage(caught instanceof Error ? caught.message : '이메일 인증에 실패했습니다.')
      })
  }, [navigate, searchParams, verifyEmail])

  const Icon = status === 'success' ? FaCheckCircle : status === 'error' ? FaTimesCircle : FaEnvelopeOpenText

  return (
    <div className="flex min-h-screen items-center justify-center px-4 pt-24 pb-16">
      <section className="w-full max-w-lg rounded-lg border border-white/10 bg-slate-900/90 p-8 text-center shadow-2xl shadow-black/30">
        <Icon
          className={`mx-auto mb-5 text-5xl ${status === 'success' ? 'text-emerald-400' : status === 'error' ? 'text-red-300' : 'text-parks-gold'}`}
        />
        <h1 className="text-3xl font-black text-white">이메일 인증</h1>
        <p className="mt-4 leading-7 text-slate-300">{message}</p>
        {status === 'error' && (
          <Link
            to="/auth"
            className="mt-6 inline-flex rounded-lg bg-parks-gold px-5 py-3 text-sm font-black text-ocean-dark transition hover:bg-parks-gold-light"
          >
            로그인 화면으로 이동
          </Link>
        )}
      </section>
    </div>
  )
}

export default VerifyEmailPage
