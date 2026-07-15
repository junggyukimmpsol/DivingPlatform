import React, { FormEvent, useState } from 'react'
import { Link } from 'react-router-dom'
import { FaArrowRight, FaEnvelope, FaGift, FaImage, FaMagic, FaUpload } from 'react-icons/fa'

const MAX_UPLOAD_COUNT = 5
const MAX_COMPRESSED_BYTES = 2 * 1024 * 1024
const MAX_IMAGE_EDGE = 1600
const JPEG_QUALITY = 0.82

const comparisonExamples = [
  {
    title: '흐릿한 물색을 맑은 블루톤으로',
    before: '/assets/photo-coupon/fish-before.jpg',
    after: '/assets/photo-coupon/fish-after.jpg',
  },
  {
    title: '거북이와 배경 디테일 복원',
    before: '/assets/photo-coupon/turtle-before.jpg',
    after: '/assets/photo-coupon/turtle-after.jpg',
  },
  {
    title: '어두운 인물과 장비를 자연스럽게',
    before: '/assets/photo-coupon/lobster-before.jpg',
    after: '/assets/photo-coupon/lobster-after.jpg',
  },
]

const parseApiError = async (response: Response) => {
  try {
    const data = await response.json() as { detail?: string; error?: string }
    return data.detail ? `${data.error || '요청 실패'} ${data.detail}` : data.error || '요청 실패'
  } catch {
    return '요청을 처리하지 못했습니다.'
  }
}

const loadImage = (file: File) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image()
    const url = URL.createObjectURL(file)
    image.onload = () => {
      URL.revokeObjectURL(url)
      resolve(image)
    }
    image.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('이미지를 읽지 못했습니다.'))
    }
    image.src = url
  })

const canvasToBlob = (canvas: HTMLCanvasElement, quality: number) =>
  new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error('이미지 압축에 실패했습니다.'))
        return
      }
      resolve(blob)
    }, 'image/jpeg', quality)
  })

const compressImage = async (file: File) => {
  if (!file.type.startsWith('image/')) throw new Error('사진 파일만 업로드할 수 있습니다.')

  const image = await loadImage(file)
  const scale = Math.min(1, MAX_IMAGE_EDGE / Math.max(image.width, image.height))
  const width = Math.max(1, Math.round(image.width * scale))
  const height = Math.max(1, Math.round(image.height * scale))
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height

  const context = canvas.getContext('2d')
  if (!context) throw new Error('이미지 압축을 준비하지 못했습니다.')
  context.drawImage(image, 0, 0, width, height)

  let blob = await canvasToBlob(canvas, JPEG_QUALITY)
  if (blob.size > MAX_COMPRESSED_BYTES) {
    blob = await canvasToBlob(canvas, 0.68)
  }
  if (blob.size > MAX_COMPRESSED_BYTES) {
    throw new Error(`${file.name} 압축 후에도 2MB를 초과합니다. 더 작은 사진을 선택해주세요.`)
  }

  const baseName = file.name.replace(/\.[^.]+$/, '')
  return new File([blob], `${baseName}.jpg`, { type: 'image/jpeg' })
}

const PhotoCouponPage: React.FC = () => {
  const [selectedCount, setSelectedCount] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget
    setError('')
    setSuccess('')
    setIsSubmitting(true)

    try {
      const sourceForm = new FormData(form)
      const buyerName = String(sourceForm.get('buyerName') || '').trim()
      const phone = String(sourceForm.get('phone') || '').trim()
      const email = String(sourceForm.get('email') || '').trim()
      const marketingOptIn = sourceForm.get('marketingOptIn')
      const files = sourceForm.getAll('photos').filter((file): file is File => file instanceof File && file.size > 0)

      if (!buyerName) throw new Error('구매자명을 입력해주세요.')
      if (!phone) throw new Error('전화번호를 입력해주세요.')
      if (!email) throw new Error('결과를 받을 이메일을 입력해주세요.')
      if (!marketingOptIn) throw new Error('무료 보정권을 받으려면 광고성 이메일 수신에 동의해주세요.')
      if (files.length === 0) throw new Error('보정할 사진을 선택해주세요.')
      if (files.length > MAX_UPLOAD_COUNT) throw new Error(`최대 ${MAX_UPLOAD_COUNT}장까지 신청할 수 있습니다.`)

      setSuccess('업로드 전 사진을 자동 압축하고 있습니다.')
      const formData = new FormData()
      formData.set('reservationNumber', String(sourceForm.get('reservationNumber') || '').trim())
      formData.set('buyerName', buyerName)
      formData.set('phone', phone)
      formData.set('email', email)
      formData.set('marketingOptIn', 'true')

      for (const file of files) {
        formData.append('photos', await compressImage(file))
      }

      setSuccess('사진을 업로드하고 보정 신청을 접수하고 있습니다.')
      const response = await fetch('/api/photo-coupon/apply', {
        method: 'POST',
        body: formData,
      })
      if (!response.ok) throw new Error(await parseApiError(response))

      form.reset()
      setSelectedCount(0)
      setSuccess('신청이 완료되었습니다. 사진 보정이 끝나면 이메일로 다운로드 링크를 보내드릴게요.')
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : '신청 처리에 실패했습니다.')
      setSuccess('')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#dff9ff] via-white to-[#e6fbf4] px-4 pt-28 pb-20 text-slate-900">
      <div className="mx-auto max-w-6xl">
        <section className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-[#06334a] px-4 py-2 text-sm font-black text-parks-gold">
              <FaGift />
              Naver customer benefit
            </div>
            <h1 className="mt-6 text-4xl font-black leading-tight text-[#06334a] md:text-6xl">
              수중사진 5장
              <span className="block text-cyan-600">무료 AI 보정권</span>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-8 text-slate-600 md:text-lg">
              네이버 스토어에서 Parks Local Diving 투어를 이용한 고객님께 드리는 무료 혜택입니다.
              사진을 업로드하면 보정 완료 후 이메일로 다운로드 링크를 보내드립니다.
            </p>
            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {[
                [FaImage, '최대 5장', '사진 자동 압축'],
                [FaMagic, 'AI 보정', '색감/탁도/대비 개선'],
                [FaEnvelope, '이메일 발송', '완료 후 링크 전달'],
              ].map(([Icon, title, text]) => {
                const ItemIcon = Icon as typeof FaImage
                return (
                  <div key={String(title)} className="rounded-2xl bg-white p-5 shadow-[0_18px_50px_rgba(14,165,233,0.12)]">
                    <ItemIcon className="mb-3 text-cyan-600" size={22} />
                    <p className="font-black text-[#06334a]">{title as string}</p>
                    <p className="mt-1 text-sm text-slate-500">{text as string}</p>
                  </div>
                )
              })}
            </div>
          </div>

          <form className="rounded-2xl border border-sky-100 bg-white p-5 shadow-[0_24px_80px_rgba(14,165,233,0.18)] md:p-8" onSubmit={handleSubmit} noValidate>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm font-bold text-slate-700">예약번호</span>
                <input name="reservationNumber" className="w-full rounded-lg border border-sky-100 px-4 py-3 text-sm outline-none focus:border-cyan-500" placeholder="선택 입력" />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-bold text-slate-700">구매자명 *</span>
                <input name="buyerName" required className="w-full rounded-lg border border-sky-100 px-4 py-3 text-sm outline-none focus:border-cyan-500" placeholder="네이버 구매자명" />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-bold text-slate-700">전화번호 *</span>
                <input name="phone" required className="w-full rounded-lg border border-sky-100 px-4 py-3 text-sm outline-none focus:border-cyan-500" placeholder="010-0000-0000" />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-bold text-slate-700">결과 받을 이메일 *</span>
                <input name="email" type="email" required className="w-full rounded-lg border border-sky-100 px-4 py-3 text-sm outline-none focus:border-cyan-500" placeholder="diver@example.com" />
              </label>
            </div>

            <label className="mt-5 block">
              <span className="mb-2 block text-sm font-bold text-slate-700">보정할 수중 사진 *</span>
              <input
                name="photos"
                type="file"
                accept="image/*"
                multiple
                onChange={(event) => setSelectedCount(event.currentTarget.files?.length || 0)}
                className="w-full rounded-lg border border-sky-100 bg-slate-50 px-4 py-3 text-sm text-slate-600 file:mr-4 file:rounded-md file:border-0 file:bg-parks-gold file:px-3 file:py-2 file:text-sm file:font-bold file:text-[#06334a]"
              />
              <span className="mt-2 block text-xs text-slate-500">선택됨: {selectedCount}장. 최대 5장, 업로드 전 장당 2MB 이하로 자동 압축됩니다.</span>
            </label>

            <label className="mt-5 flex items-start gap-3 rounded-xl border border-cyan-100 bg-cyan-50 p-4">
              <input name="marketingOptIn" type="checkbox" className="mt-1 h-4 w-4 rounded accent-cyan-600" />
              <span className="text-sm leading-6 text-slate-700">
                무료 AI 사진 보정 5장 혜택을 받기 위해 Parks Local Diving의 다이빙 투어, 이벤트,
                추가 보정권, 예약 할인 쿠폰 안내 이메일 수신에 동의합니다.
              </span>
            </label>

            {error && <div className="mt-5 rounded-lg bg-red-50 px-4 py-3 text-sm font-bold text-red-600">{error}</div>}
            {success && <div className="mt-5 rounded-lg bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700">{success}</div>}

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#06334a] px-5 py-4 text-sm font-black text-white transition hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <FaUpload />
              {isSubmitting ? '신청 중...' : '무료 보정 신청하기'}
            </button>

            <p className="mt-4 text-center text-xs leading-6 text-slate-500">
              다음 예약 때 장비 정보를 자동으로 쓰고 싶다면{' '}
              <Link to="/auth?mode=register" className="font-black text-cyan-700 underline underline-offset-4">
                회원가입
              </Link>
              을 이용할 수 있습니다.
            </p>
          </form>
        </section>

        <section className="mt-16 overflow-hidden rounded-[2rem] bg-[#06334a] text-white shadow-[0_28px_90px_rgba(8,51,74,0.22)]">
          <div className="grid gap-8 p-5 md:p-8 lg:grid-cols-[0.85fr_1.15fr] lg:p-10">
            <div className="flex flex-col justify-center">
              <div className="inline-flex w-fit items-center gap-2 rounded-full bg-parks-gold px-4 py-2 text-sm font-black text-[#06334a]">
                <FaMagic />
                Before / After
              </div>
              <h2 className="mt-5 text-3xl font-black leading-tight md:text-5xl">
                흐릿한 수중사진을
                <span className="block text-cyan-200">밝고 선명하게</span>
              </h2>
              <p className="mt-5 max-w-lg text-base leading-8 text-cyan-50/80">
                Parks Local Diving의 AI 보정은 과하게 새로 그리는 방식이 아니라, 원본의 인물과 장비는 그대로 두고
                물색, 탁도, 그림자, 장비 색감을 자연스럽게 정리합니다.
              </p>
              <div className="mt-7 grid gap-3 text-sm font-bold text-cyan-50 sm:grid-cols-2">
                {['맑은 블루톤 색감 보정', '어두운 인물 밝기 보정', '수중 탁도와 입자감 정리', '장비/물고기 색감 복원'].map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <FaArrowRight className="text-parks-gold" />
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-4">
              {comparisonExamples.map((example) => (
                <div key={example.title} className="overflow-hidden rounded-2xl bg-white/10">
                  <div className="grid grid-cols-2">
                    <figure className="relative">
                      <img src={example.before} alt={`${example.title} 보정 전`} className="h-44 w-full object-cover md:h-56" loading="lazy" />
                      <figcaption className="absolute left-3 top-3 rounded-full bg-[#052f45] px-3 py-1 text-xs font-black text-white">BEFORE</figcaption>
                    </figure>
                    <figure className="relative">
                      <img src={example.after} alt={`${example.title} 보정 후`} className="h-44 w-full object-cover md:h-56" loading="lazy" />
                      <figcaption className="absolute left-3 top-3 rounded-full bg-cyan-500 px-3 py-1 text-xs font-black text-white">AFTER</figcaption>
                    </figure>
                  </div>
                  <p className="px-4 py-3 text-sm font-black text-cyan-50">{example.title}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default PhotoCouponPage
