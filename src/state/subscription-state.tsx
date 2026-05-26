import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL as string,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string,
)

export type SubscriptionStatus = 'active' | 'trialing' | 'canceled' | 'none'

interface SubState {
  status: SubscriptionStatus
  loading: boolean
  isActive: boolean
  userId: string | null
  userEmail: string | null
  refresh: () => void
}

const Ctx = createContext<SubState | null>(null)

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<SubscriptionStatus>('none')
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)
  const [userEmail, setUserEmail] = useState<string | null>(null)

  async function load(uid: string) {
    const { data } = await supabase
      .from('profiles')
      .select('data')
      .eq('id', uid)
      .single()
    const s = (data?.data as Record<string, unknown>)?.jl_subscription_status as SubscriptionStatus | undefined
    setStatus(s ?? 'none')
    setLoading(false)
  }

  function refresh() {
    if (userId) load(userId)
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUserId(session.user.id)
        setUserEmail(session.user.email ?? null)
        load(session.user.id)
      } else {
        setLoading(false)
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      if (session?.user) {
        setUserId(session.user.id)
        setUserEmail(session.user.email ?? null)
        load(session.user.id)
      } else {
        setUserId(null)
        setUserEmail(null)
        setStatus('none')
        setLoading(false)
      }
    })
    return () => subscription.unsubscribe()
  }, [])

  return (
    <Ctx.Provider value={{ status, loading, isActive: status === 'active' || status === 'trialing', userId, userEmail, refresh }}>
      {children}
    </Ctx.Provider>
  )
}

export function useSubscription() {
  return useContext(Ctx) ?? { status: 'none' as SubscriptionStatus, loading: false, isActive: false, userId: null, userEmail: null, refresh: () => {} }
}

export { supabase }
