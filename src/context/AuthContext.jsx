import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [role, setRole]       = useState(null)   // 'admin' | 'staff' | null
  const [loading, setLoading] = useState(true)

  const fetchRole = async (userId) => {
    if (!userId) { setRole(null); return }
    const { data } = await supabase
      .from('user_roles')
      .select('role')
      .eq('id', userId)
      .single()
    setRole(data?.role ?? null)
  }

  useEffect(() => {
    // Ambil session yang sudah ada
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      fetchRole(session?.user?.id).finally(() => setLoading(false))
    })

    // Dengerin perubahan auth state
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null)
        fetchRole(session?.user?.id)
      }
    )
    return () => subscription.unsubscribe()
  }, [])

  const login = (email, password) =>
    supabase.auth.signInWithPassword({ email, password })

  const logout = () => supabase.auth.signOut()

  return (
    <AuthContext.Provider value={{ user, role, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth harus di dalam AuthProvider')
  return ctx
}
