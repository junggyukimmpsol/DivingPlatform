import React, { useState, useRef, useEffect } from 'react'
import { FaPlay, FaPause, FaExpand, FaVolumeMute, FaVolumeUp } from 'react-icons/fa'
import { useLanguage } from '../contexts/LanguageContext'

interface VideoItem {
  id: number
  src: string
  title: string
  description: string
  location: string
}

const VideoGallerySection: React.FC = () => {
  const { t } = useLanguage()
  const [activeVideo, setActiveVideo] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [isHovered, setIsHovered] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const videos: VideoItem[] = t.videoGallery.videos.map((video, index) => ({
    id: index + 1,
    src: `/asset/dive_vid_${index + 1}.mp4`,
    title: video.title,
    description: video.description,
    location: video.location,
  }))

  useEffect(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.play()
      } else {
        videoRef.current.pause()
      }
    }
  }, [isPlaying, activeVideo])

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted
    }
  }, [isMuted])

  const handleVideoChange = (index: number) => {
    setActiveVideo(index)
    setIsPlaying(true)
  }

  const togglePlay = () => {
    setIsPlaying(!isPlaying)
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  const handleVideoEnd = () => {
    const nextIndex = (activeVideo + 1) % videos.length
    setActiveVideo(nextIndex)
  }

  const toggleFullscreen = () => {
    if (containerRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen()
      } else {
        containerRef.current.requestFullscreen()
      }
    }
  }

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-ocean-dark via-slate-950 to-ocean-dark py-20 md:py-32">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-ocean-accent/5 rounded-full blur-[150px]"></div>
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-parks-gold/5 rounded-full blur-[120px]"></div>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <div className="mb-6 inline-block">
            <span className="inline-flex items-center gap-2 rounded-full bg-ocean-teal/10 border border-ocean-teal/20 px-6 py-2.5 backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ocean-teal opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-ocean-teal"></span>
              </span>
              <span className="font-body text-sm font-semibold tracking-wider text-ocean-teal uppercase">
                {t.videoGallery.badge}
              </span>
            </span>
          </div>
          <h2 className="mb-6 font-display text-4xl font-bold text-white md:text-5xl lg:text-6xl">
            {t.videoGallery.title}
          </h2>
          <p className="mx-auto max-w-2xl font-body text-lg text-slate-400">
            {t.videoGallery.subtitle}
            <br className="hidden sm:block" />
            {t.videoGallery.subtitleEnd}
          </p>
        </div>

        {/* Video Gallery */}
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Video Player */}
          <div className="lg:col-span-2">
            <div
              ref={containerRef}
              className="group relative aspect-video overflow-hidden rounded-3xl bg-slate-900 shadow-2xl"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              {/* Video Element */}
              <video
                ref={videoRef}
                src={videos[activeVideo].src}
                className="h-full w-full object-cover"
                loop={false}
                muted={isMuted}
                playsInline
                onEnded={handleVideoEnd}
                onClick={togglePlay}
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none"></div>

              {/* Video Info Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                <div className="flex items-center gap-2 mb-3">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-parks-gold/90 px-3 py-1 text-xs font-bold text-ocean-dark">
                    📍 {videos[activeVideo].location}
                  </span>
                </div>
                <h3 className="text-xl md:text-2xl font-display font-bold text-white mb-2">
                  {videos[activeVideo].title}
                </h3>
                <p className="text-sm md:text-base text-slate-300">
                  {videos[activeVideo].description}
                </p>
              </div>

              {/* Play Button Overlay */}
              {!isPlaying && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <button
                    onClick={togglePlay}
                    className="group/btn flex h-20 w-20 md:h-24 md:w-24 items-center justify-center rounded-full bg-white/20 backdrop-blur-md border border-white/30 transition-all duration-300 hover:bg-white/30 hover:scale-110"
                  >
                    <FaPlay className="h-8 w-8 md:h-10 md:w-10 text-white ml-1" />
                  </button>
                </div>
              )}

              {/* Controls */}
              <div
                className={`absolute top-4 right-4 flex gap-2 transition-opacity duration-300 ${isHovered || !isPlaying ? 'opacity-100' : 'opacity-0'
                  }`}
              >
                <button
                  onClick={toggleMute}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-black/50 backdrop-blur-sm text-white transition-all hover:bg-black/70"
                  aria-label={isMuted ? t.videoGallery.unmute : t.videoGallery.mute}
                >
                  {isMuted ? <FaVolumeMute className="h-4 w-4" /> : <FaVolumeUp className="h-4 w-4" />}
                </button>
                <button
                  onClick={toggleFullscreen}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-black/50 backdrop-blur-sm text-white transition-all hover:bg-black/70"
                  aria-label={t.videoGallery.fullscreen}
                >
                  <FaExpand className="h-4 w-4" />
                </button>
              </div>

              {/* Progress indicator */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
                <div
                  className="h-full bg-parks-gold transition-all duration-300"
                  style={{ width: `${((activeVideo + 1) / videos.length) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Video Thumbnails */}
          <div className="flex flex-col gap-4">
            <div className="mb-2">
              <h4 className="font-body text-sm font-semibold text-slate-400 uppercase tracking-wider">
                {t.videoGallery.highlights}
              </h4>
            </div>
            {videos.map((video, index) => (
              <button
                key={video.id}
                onClick={() => handleVideoChange(index)}
                className={`group relative overflow-hidden rounded-2xl transition-all duration-300 ${activeVideo === index
                    ? 'ring-2 ring-parks-gold shadow-glow-gold'
                    : 'hover:ring-1 hover:ring-white/30'
                  }`}
              >
                <div className="aspect-video relative">
                  <video
                    src={video.src}
                    className="h-full w-full object-cover"
                    muted
                    playsInline
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>

                  {/* Play indicator */}
                  <div className={`absolute inset-0 flex items-center justify-center transition-opacity ${activeVideo === index ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                    }`}>
                    <div className={`flex h-12 w-12 items-center justify-center rounded-full ${activeVideo === index
                        ? 'bg-parks-gold text-ocean-dark'
                        : 'bg-white/20 backdrop-blur-sm text-white'
                      }`}>
                      {activeVideo === index && isPlaying ? (
                        <FaPause className="h-4 w-4" />
                      ) : (
                        <FaPlay className="h-4 w-4 ml-0.5" />
                      )}
                    </div>
                  </div>

                  {/* Video info */}
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <p className="text-sm font-semibold text-white truncate">{video.title}</p>
                    <p className="text-xs text-slate-400">{video.location}</p>
                  </div>

                  {/* Active indicator */}
                  {activeVideo === index && (
                    <div className="absolute top-2 right-2">
                      <span className="flex h-3 w-3">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-parks-gold opacity-75"></span>
                        <span className="relative inline-flex h-3 w-3 rounded-full bg-parks-gold"></span>
                      </span>
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 rounded-3xl bg-gradient-to-r from-white/5 to-white/10 border border-white/10 p-8 backdrop-blur-sm">
            <div className="text-center sm:text-left">
              <h4 className="font-display text-xl font-bold text-white mb-2">
                {t.videoGallery.ctaTitle}
              </h4>
              <p className="text-sm text-slate-400">
                {t.videoGallery.ctaSubtitle}
              </p>
            </div>
            <a
              href="http://pf.kakao.com/_xhhbxcn/chat"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-parks-gold to-amber-400 px-8 py-3 font-body font-bold text-ocean-dark transition-all hover:scale-105 hover:shadow-glow-gold"
            >
              {t.videoGallery.ctaButton}
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

export default VideoGallerySection
