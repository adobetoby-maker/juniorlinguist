import { Link } from 'react-router-dom'

export default function BookletHeader({
  backTo,
  backLabel,
  title,
}: {
  backTo: string
  backLabel: string
  title: string
}) {
  return (
    <header
      className="fixed top-0 inset-x-0 z-40 flex items-center gap-3 px-4"
      style={{
        paddingTop: 'max(12px, env(safe-area-inset-top, 0px))',
        paddingBottom: 12,
        backgroundColor: '#6D28D9',
        boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
      }}
    >
      <Link
        to={backTo}
        className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full text-xl text-white hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        style={{ backgroundColor: 'rgba(255,255,255,0.2)', textDecoration: 'none' }}
        aria-label={backLabel}
      >
        ←
      </Link>
      <span aria-hidden="true" className="text-xl">📖</span>
      <span className="font-bold text-base text-white">{title}</span>
    </header>
  )
}
