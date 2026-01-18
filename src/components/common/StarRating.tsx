import React, { memo } from 'react'

interface StarRatingProps {
  rating: number
  maxRating?: number
  size?: 'sm' | 'md' | 'lg'
}

const StarRating: React.FC<StarRatingProps> = memo(({ rating, maxRating = 5, size = 'md' }) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  }

  return (
    <div className="flex gap-1" role="img" aria-label={`${rating} out of ${maxRating} stars`}>
      {[...Array(maxRating)].map((_, index) => (
        <svg
          key={index}
          className={`${sizeClasses[size]} ${
            index < rating ? 'fill-parks-yellow text-parks-yellow' : 'fill-gray-300 text-gray-300'
          }`}
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
        </svg>
      ))}
    </div>
  )
})

StarRating.displayName = 'StarRating'

export default StarRating
