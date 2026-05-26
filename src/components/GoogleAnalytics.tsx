import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const GA_ID = import.meta.env.VITE_GA_ID as string | undefined

declare global {
  interface Window {
    dataLayer: unknown[]
    gtag: (...args: unknown[]) => void
  }
}

export function GoogleAnalytics() {
  const location = useLocation()

  useEffect(() => {
    if (!GA_ID) return
    if (typeof window.gtag === 'function') return  // already loaded

    const script = document.createElement('script')
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`
    script.async = true
    document.head.appendChild(script)

    window.dataLayer = window.dataLayer || []
    window.gtag = function gtag() { window.dataLayer.push(arguments) }
    window.gtag('js', new Date())
    window.gtag('config', GA_ID, { anonymize_ip: true })
  }, [])

  // Track route changes
  useEffect(() => {
    if (!GA_ID || !window.gtag) return
    window.gtag('event', 'page_view', { page_path: location.pathname + location.search })
  }, [location])

  return null
}
