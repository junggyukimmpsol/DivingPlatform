import React, { FormEvent, useEffect, useMemo, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { FaDownload, FaMagic, FaRedo, FaTicketAlt, FaUpload } from 'react-icons/fa'
import { useAuth } from '../contexts/AuthContext'

type PhotoWallet = {
  totalCredits: number
  usedCredits: number
  remainingCredits: number
}

type PhotoJob = {
  id: string
  originalFileName: string
  status: 'queued' | 'processing' | 'completed' | 'failed'
  errorMessage: string
  createdAt: string
  completedAt: string
  downloadUrl: string
}

type PhotoSummary = {
  wallet: PhotoWallet
  jobs: PhotoJob[]
}

const MAX_UPLOAD_COUNT = 5
const MAX_COMPRESSED_BYTES = 2 * 1024 * 1024
const MAX_IMAGE_EDGE = 1600
const JPEG_QUALITY = 0.82

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

const PhotoEnhancePage: React.FC = () => {
  const { user, isLoading } = useAuth()
  const [summary, setSummary] = useState<PhotoSummary | null>(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [selectedCount, setSelectedCount] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [processingJobId, setProcessingJobId] = useState('')

  const pendingJobs = useMemo(
    () => summary?.jobs.filter((job) => job.status === 'queued' || job.status === 'failed') || [],
    [summary],
  )
  const hasProcessingJobs = useMemo(
    () => Boolean(summary?.jobs.some((job) => job.status === 'processing')),
    [summary],
  )

  const loadSummary = async () => {
    const response = await fetch('/api/photo-enhance/summary', { credentials: 'include' })
    if (!response.ok) throw new Error(await parseApiError(response))
    const data = await response.json() as PhotoSummary
    setSummary(data)
  }

  useEffect(() => {
    if (!user) return
    loadSummary().catch((caught) => setError(caught instanceof Error ? caught.message : '상태를 불러오지 못했습니다.'))
  }, [user])

  useEffect(() => {
    if (!user || !hasProcessingJobs) return undefined

    const intervalId = window.setInterval(() => {
      loadSummary().catch((caught) => setError(caught instanceof Error ? caught.message : '상태를 갱신하지 못했습니다.'))
    }, 4000)

    return () => window.clearInterval(intervalId)
  }, [hasProcessingJobs, user])

  if (isLoading) {
    return <div className="min-h-screen px-4 pt-32 text-center text-slate-300">불러오는 중...</div>
  }

  if (!user) return <Navigate to="/auth" replace />

  const handleUpload = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget
    setError('')
    setSuccess('')
    setIsUploading(true)

    try {
      const originalFormData = new FormData(form)
      const files = originalFormData.getAll('photos').filter((file): file is File => file instanceof File && file.size > 0)
      if (files.length === 0) throw new Error('보정할 사진을 선택해주세요.')
      if (files.length > MAX_UPLOAD_COUNT) throw new Error(`한 번에 최대 ${MAX_UPLOAD_COUNT}장까지 업로드할 수 있습니다.`)
      if (!originalFormData.get('marketingOptIn')) {
        throw new Error('무료 보정 티켓을 받으려면 광고성 이메일 수신에 동의해주세요.')
      }

      setSuccess('업로드 전에 사진을 자동 압축하고 있습니다.')
      const formData = new FormData()
      formData.set('marketingOptIn', 'true')
      for (const file of files) {
        formData.append('photos', await compressImage(file))
      }

      const response = await fetch('/api/photo-enhance/jobs', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      })

      if (!response.ok) throw new Error(await parseApiError(response))
      const data = await response.json() as PhotoSummary
      setSummary(data)
      setSelectedCount(0)
      form.reset()
      setSuccess('사진이 업로드되었습니다. 아래 보정 시작 버튼을 눌러주세요.')
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : '업로드에 실패했습니다.')
    } finally {
      setIsUploading(false)
    }
  }

  const handleProcess = async (jobId: string) => {
    setError('')
    setSuccess('')
    setProcessingJobId(jobId)

    try {
      const response = await fetch(`/api/photo-enhance/jobs/${jobId}/process`, {
        method: 'POST',
        credentials: 'include',
      })

      if (!response.ok) throw new Error(await parseApiError(response))
      const data = await response.json() as PhotoSummary
      setSummary(data)
      setSuccess('사진 보정 작업을 시작했습니다. 완료되면 다운로드 버튼이 표시됩니다.')
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : '사진 보정에 실패했습니다.')
      await loadSummary()
    } finally {
      setProcessingJobId('')
    }
  }

  const handleProcessAll = async () => {
    for (const job of pendingJobs) {
      await handleProcess(job.id)
    }
  }

  const wallet = summary?.wallet

  return (
    <div className="min-h-screen px-4 pt-28 pb-20">
      <div className="mx-auto max-w-6xl">
        <section className="mb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-parks-gold/30 bg-parks-gold/10 px-4 py-2 text-sm font-bold text-parks-gold">
            <FaMagic />
            AI underwater photo enhancer
          </div>
          <h1 className="mt-6 text-4xl font-black leading-tight text-white md:text-5xl">무료 AI 수중사진 보정</h1>
          <p className="mt-4 max-w-2xl text-base leading-8 text-slate-300">
            무료 보정 티켓 5장으로 수중 사진의 푸른 색감, 탁도, 대비를 자연스럽게 보정하고 완료된 사진을 바로 다운로드하세요.
          </p>
        </section>

        <div className="mb-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border border-white/10 bg-white/5 p-5">
            <FaTicketAlt className="mb-3 text-2xl text-parks-gold" />
            <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Free tickets</p>
            <p className="mt-2 text-2xl font-black text-white">
              {wallet ? wallet.remainingCredits : '-'} / {wallet ? wallet.totalCredits : 5}
            </p>
            <p className="text-sm text-slate-400">남은 무료 보정권</p>
          </div>
          <div className="rounded-lg border border-white/10 bg-white/5 p-5">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Upload limit</p>
            <p className="mt-2 text-2xl font-black text-white">5장</p>
            <p className="text-sm text-slate-400">자동 압축 후 장당 2MB 이하</p>
          </div>
          <div className="rounded-lg border border-white/10 bg-white/5 p-5">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Downloads</p>
            <p className="mt-2 text-2xl font-black text-white">{summary?.jobs.filter((job) => job.status === 'completed').length || 0}</p>
            <p className="text-sm text-slate-400">완료된 보정 사진</p>
          </div>
        </div>

        <form className="rounded-lg border border-white/10 bg-slate-900/80 p-5 md:p-8" onSubmit={handleUpload} noValidate>
          <label className="block">
            <span className="mb-2 block text-sm font-bold text-slate-200">보정할 수중 사진</span>
            <input
              name="photos"
              type="file"
              accept="image/*"
              multiple
              onChange={(event) => setSelectedCount(event.currentTarget.files?.length || 0)}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300 file:mr-4 file:rounded-md file:border-0 file:bg-parks-gold file:px-3 file:py-2 file:text-sm file:font-bold file:text-ocean-dark"
            />
            <span className="mt-2 block text-xs text-slate-400">선택됨: {selectedCount}장. 업로드 전 1600px 이하, 장당 2MB 이하 JPEG로 자동 압축됩니다.</span>
          </label>

          <label className="mt-5 flex items-start gap-3 rounded-lg border border-white/10 bg-white/5 p-4">
            <input name="marketingOptIn" type="checkbox" className="mt-1 h-4 w-4 rounded border-white/20 accent-parks-gold" />
            <span className="text-sm leading-6 text-slate-300">
              무료 AI 사진 보정 5장 혜택을 받기 위해 Parks Local Diving의 다이빙 투어, 이벤트, 프로모션 안내 이메일 수신에 동의합니다.
            </span>
          </label>

          {error && <div className="mt-5 rounded-lg border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm leading-6 text-red-200">{error}</div>}
          {success && <div className="mt-5 rounded-lg border border-emerald-400/30 bg-emerald-500/10 px-4 py-3 text-sm leading-6 text-emerald-100">{success}</div>}

          <button
            type="submit"
            disabled={isUploading}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-parks-gold px-5 py-4 text-sm font-black text-ocean-dark transition hover:bg-parks-gold-light disabled:cursor-not-allowed disabled:opacity-60 md:w-auto"
          >
            <FaUpload />
            {isUploading ? '업로드 중...' : '사진 업로드'}
          </button>
        </form>

        <section className="mt-8 rounded-lg border border-white/10 bg-slate-900/80 p-5 md:p-8">
          <div className="mb-5 flex flex-col justify-between gap-3 md:flex-row md:items-center">
            <div>
              <h2 className="text-2xl font-black text-white">보정 작업</h2>
              <p className="mt-1 text-sm text-slate-400">업로드한 사진을 보정 요청하면 자동으로 상태가 갱신됩니다.</p>
            </div>
            <button
              type="button"
              onClick={handleProcessAll}
              disabled={pendingJobs.length === 0 || Boolean(processingJobId) || hasProcessingJobs}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-parks-gold/40 bg-parks-gold/10 px-4 py-3 text-sm font-black text-parks-gold transition hover:bg-parks-gold hover:text-ocean-dark disabled:cursor-not-allowed disabled:opacity-50"
            >
              <FaMagic />
              남은 사진 모두 보정
            </button>
          </div>

          <div className="space-y-3">
            {summary?.jobs.length ? (
              summary.jobs.map((job) => (
                <div key={job.id} className="grid gap-3 rounded-lg border border-white/10 bg-white/5 p-4 md:grid-cols-[1fr_auto] md:items-center">
                  <div>
                    <p className="font-bold text-white">{job.originalFileName}</p>
                    <p className="mt-1 text-sm text-slate-400">
                      상태: {job.status === 'queued' ? '대기 중' : job.status === 'processing' ? '보정 중' : job.status === 'completed' ? '완료' : '실패'}
                    </p>
                    {job.status === 'processing' && <p className="mt-2 text-sm text-parks-gold">AI가 보정 중입니다. 이 화면에서 자동으로 상태를 확인합니다.</p>}
                    {job.errorMessage && <p className="mt-2 text-sm text-red-200">{job.errorMessage}</p>}
                  </div>
                  <div className="flex gap-2">
                    {job.status === 'completed' ? (
                      <Link
                        to={job.downloadUrl}
                        target="_blank"
                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-parks-gold px-4 py-3 text-sm font-black text-ocean-dark transition hover:bg-parks-gold-light"
                      >
                        <FaDownload />
                        다운로드
                      </Link>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleProcess(job.id)}
                        disabled={Boolean(processingJobId) || job.status === 'processing'}
                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-parks-gold px-4 py-3 text-sm font-black text-ocean-dark transition hover:bg-parks-gold-light disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {job.status === 'failed' ? <FaRedo /> : <FaMagic />}
                        {processingJobId === job.id || job.status === 'processing' ? '보정 중...' : job.status === 'failed' ? '다시 시도' : '보정 시작'}
                      </button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-lg border border-white/10 bg-white/5 p-6 text-center text-sm text-slate-400">
                아직 업로드한 사진이 없습니다.
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}

export default PhotoEnhancePage
