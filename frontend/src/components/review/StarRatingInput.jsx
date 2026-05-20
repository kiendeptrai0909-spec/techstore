import { Star } from 'lucide-react'

function StarRatingInput({ value, onChange, disabled = false }) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: 5 }).map((_, index) => {
        const starValue = index + 1
        const active = starValue <= value

        return (
          <button
            key={starValue}
            type="button"
            disabled={disabled}
            onClick={() => onChange(starValue)}
            className="disabled:cursor-not-allowed"
          >
            <Star
              size={34}
              fill={active ? 'orange' : 'none'}
              className={active ? 'text-orange-500' : 'text-gray-300'}
            />
          </button>
        )
      })}

      <span className="ml-2 text-sm font-semibold text-gray-600">
        {value > 0 ? `${value}/5 sao` : 'Chọn số sao'}
      </span>
    </div>
  )
}

export default StarRatingInput