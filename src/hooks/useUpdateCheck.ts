import { useEffect, useState } from 'react'

function currentBuildSrc(): string | null {
  const el = Array.from(document.querySelectorAll<HTMLScriptElement>('script[src]'))
    .find(s => /\/assets\/index-/.test(s.src))
  return el ? el.src : null
}

export function useUpdateCheck(intervalMs = 5 * 60 * 1000) {
  const [updateAvailable, setUpdateAvailable] = useState(false)

  useEffect(() => {
    const original = currentBuildSrc()
    if (!original) return

    const check = async () => {
      try {
        const res = await fetch('/?_t=' + Date.now(), { cache: 'no-store' })
        const html = await res.text()
        const m = html.match(/\/assets\/index-[^"']+\.js/)
        if (m && !original.endsWith(m[0])) setUpdateAvailable(true)
      } catch { /* network error — skip */ }
    }

    const id = setInterval(check, intervalMs)
    return () => clearInterval(id)
  }, [intervalMs])

  return updateAvailable
}
