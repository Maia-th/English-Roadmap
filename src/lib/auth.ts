import db from '@/lib/database'
import type { User } from '@/types'

const SESSION_KEY = 'roadmap_auth_session'
const SESSION_DAYS = 30

interface AuthSession {
  userId: string
  token: string
  expiresAt: string
  loginAt: string
}

const hashPassword = (password: string): string => {
  const value = `${password}::local-roadmap-salt`
  return btoa(unescape(encodeURIComponent(value)))
}

const isValidEmail = (email: string): boolean => /^\S+@\S+\.\S+$/.test(email)

const setSession = (userId: string): void => {
  const now = new Date()
  const expiresAt = new Date(now)
  expiresAt.setDate(expiresAt.getDate() + SESSION_DAYS)
  const payload: AuthSession = {
    userId,
    token: crypto.randomUUID(),
    loginAt: now.toISOString(),
    expiresAt: expiresAt.toISOString(),
  }
  localStorage.setItem(SESSION_KEY, JSON.stringify(payload))
}

const getSession = (): AuthSession | null => {
  const raw = localStorage.getItem(SESSION_KEY)
  if (!raw) return null

  try {
    const parsed = JSON.parse(raw) as AuthSession
    if (new Date(parsed.expiresAt).getTime() <= Date.now()) {
      localStorage.removeItem(SESSION_KEY)
      return null
    }
    return parsed
  } catch {
    localStorage.removeItem(SESSION_KEY)
    return null
  }
}

const getCurrentUser = (): User | null => {
  const session = getSession()
  if (!session) return null
  return db.users.findById(session.userId)
}

const register = (email: string, password: string, name: string): User => {
  const normalizedEmail = email.trim().toLowerCase()
  const normalizedName = name.trim()

  if (!normalizedName) throw new Error('Nome é obrigatório.')
  if (!isValidEmail(normalizedEmail)) throw new Error('Email inválido.')
  if (password.length < 6) throw new Error('A senha deve ter pelo menos 6 caracteres.')

  if (db.users.findByEmail(normalizedEmail)) {
    throw new Error('Este email já está cadastrado.')
  }

  const now = new Date().toISOString()
  const user: User = {
    id: crypto.randomUUID(),
    email: normalizedEmail,
    name: normalizedName,
    password_hash: hashPassword(password),
    created_at: now,
    updated_at: now,
    last_login_at: now,
  }

  db.users.create(user)
  setSession(user.id)
  return user
}

const login = (email: string, password: string): User => {
  const user = db.users.findByEmail(email.trim().toLowerCase())
  if (!user) throw new Error('Credenciais inválidas.')

  if (user.password_hash !== hashPassword(password)) {
    throw new Error('Credenciais inválidas.')
  }

  db.users.updateLastLogin(user.id)
  setSession(user.id)

  return db.users.findById(user.id) ?? user
}

const logout = (): void => {
  localStorage.removeItem(SESSION_KEY)
}

const resetPassword = (email: string): void => {
  const user = db.users.findByEmail(email.trim().toLowerCase())
  if (!user) throw new Error('Não encontramos conta com este email.')
  const temporaryPassword = `Temp${Math.random().toString(36).slice(-6)}!`
  // Mock requested in prompt.
  // eslint-disable-next-line no-console
  console.log(`Senha temporária para ${email}: ${temporaryPassword}`)
}

const updateName = (userId: string, name: string): User => {
  const normalizedName = name.trim()
  if (!normalizedName) throw new Error('Nome é obrigatório.')
  const user = db.users.updateName(userId, normalizedName)
  if (!user) throw new Error('Usuário não encontrado.')
  return user
}

export const authService = {
  register,
  login,
  logout,
  getCurrentUser,
  resetPassword,
  updateName,
}

export type { AuthSession }
