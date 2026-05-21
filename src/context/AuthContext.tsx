import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { authService } from '@/lib/auth'
import type { User } from '@/types'

interface AuthContextValue {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string, name: string) => Promise<void>
  logout: () => void
  resetPassword: (email: string) => Promise<void>
  updateProfileName: (name: string) => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setUser(authService.getCurrentUser())
    setIsLoading(false)
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isLoading,
      login: async (email, password) => {
        const next = authService.login(email, password)
        setUser(next)
      },
      signup: async (email, password, name) => {
        const next = authService.register(email, password, name)
        setUser(next)
      },
      logout: () => {
        authService.logout()
        setUser(null)
      },
      resetPassword: async (email) => {
        authService.resetPassword(email)
      },
      updateProfileName: async (name) => {
        if (!user) throw new Error('Usuário não autenticado.')
        const next = authService.updateName(user.id, name)
        setUser(next)
      },
    }),
    [isLoading, user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider')
  }
  return context
}
