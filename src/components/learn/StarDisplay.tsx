const SIZES = { sm: 16, md: 20, lg: 28 }

export default function StarDisplay({
  stars,
  size = 'md',
  color = '#F59E0B',
}: {
  stars: 0 | 1 | 2 | 3
  size?: 'sm' | 'md' | 'lg'
  color?: string
}) {
  const s = SIZES[size]
  return (
    <span className="inline-flex gap-1" aria-label={`${stars} out of 3 stars`}>
      {[1, 2, 3].map(n => (
        <svg key={n} width={s} height={s} viewBox="0 0 20 20" fill="none">
          <polygon
            points="10,2 12.4,7.3 18.1,7.6 14,11.5 15.5,17.1 10,14 4.5,17.1 6,11.5 1.9,7.6 7.6,7.3"
            fill={n <= stars ? color : 'none'}
            stroke={n <= stars ? color : '#D1D5DB'}
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
        </svg>
      ))}
    </span>
  )
}
