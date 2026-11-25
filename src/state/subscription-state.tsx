import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react'
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

  const generation = useRef(0)
  const [familyAccess, setFamilyAccess] = useState<{uid:string; expires:number} | null>(null)
  useEffect(() => {
    if (!familyAccess) return
    const timer = setTimeout(() => { void load(familyAccess.uid) }, Math.min(2147483647, Math.max(0, familyAccess.expires - Date.now())))
    return () => clearTimeout(timer)
  }, [familyAccess])
  async function load(uid: string) {
    const version = ++generation.current
    const family = await supabase.rpc('my_v4_apple_plan').maybeSingle()
    const plan = family.data as {product_id:string;expires_at:string} | null
    if (version !== generation.current) return
    setFamilyAccess(plan?.product_id.includes('.family.') ? {uid,expires:Date.parse(plan.expires_at)} : null)
    const { data } = await supabase
      .from('profiles')
      .select('data')
      .eq('id', uid)
      .single()
    const s = (data?.data as Record<string, unknown>)?.jl_subscription_status as SubscriptionStatus | undefined
    if (version !== generation.current) return
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
        generation.current++
        setFamilyAccess(null)
        setUserId(null)
        setUserEmail(null)
        setStatus('none')
        setLoading(false)
      }
    })
    return () => subscription.unsubscribe()
  }, [])

  return (
    <Ctx.Provider value={{ status, loading, isActive: status === 'active' || status === 'trialing' || (!!familyAccess && familyAccess.uid === userId && familyAccess.expires > Date.now()), userId, userEmail, refresh }}>
      {children}
    </Ctx.Provider>
  )
}

export function useSubscription() {
  return useContext(Ctx) ?? { status: 'none' as SubscriptionStatus, loading: false, isActive: false, userId: null, userEmail: null, refresh: () => {} }
}

export { supabase }
