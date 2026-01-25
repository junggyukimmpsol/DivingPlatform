import { useEffect, RefObject } from 'react'

interface SwipeHandlers {
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
}

interface SwipeConfig {
  minSwipeDistance?: number
  maxVerticalMovement?: number
}

export const useSwipe = (
  ref: RefObject<HTMLElement>,
  handlers: SwipeHandlers,
  config: SwipeConfig = {}
) => {
  const { minSwipeDistance = 50, maxVerticalMovement = 100 } = config

  useEffect(() => {
    const element = ref.current
    if (!element) return

    let touchStartX = 0
    let touchStartY = 0
    let touchEndX = 0
    let touchEndY = 0

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.touches[0].clientX
      touchStartY = e.touches[0].clientY
    }

    const handleTouchMove = (e: TouchEvent) => {
      touchEndX = e.touches[0].clientX
      touchEndY = e.touches[0].clientY

      // Prevent default scrolling behavior during horizontal swipe
      const horizontalDistance = Math.abs(touchStartX - touchEndX)
      const verticalDistance = Math.abs(touchStartY - touchEndY)

      if (horizontalDistance > verticalDistance && horizontalDistance > 10) {
        e.preventDefault()
      }
    }

    const handleTouchEnd = () => {
      const horizontalDistance = touchStartX - touchEndX
      const verticalDistance = Math.abs(touchStartY - touchEndY)

      // Ignore if vertical movement is too large (scrolling)
      if (verticalDistance > maxVerticalMovement) {
        return
      }

      // Swipe left (next)
      if (horizontalDistance > minSwipeDistance && handlers.onSwipeLeft) {
        handlers.onSwipeLeft()
      }

      // Swipe right (previous)
      if (horizontalDistance < -minSwipeDistance && handlers.onSwipeRight) {
        handlers.onSwipeRight()
      }
    }

    element.addEventListener('touchstart', handleTouchStart, { passive: true })
    element.addEventListener('touchmove', handleTouchMove, { passive: false })
    element.addEventListener('touchend', handleTouchEnd, { passive: true })

    return () => {
      element.removeEventListener('touchstart', handleTouchStart)
      element.removeEventListener('touchmove', handleTouchMove)
      element.removeEventListener('touchend', handleTouchEnd)
    }
  }, [ref, handlers, minSwipeDistance, maxVerticalMovement])
}
