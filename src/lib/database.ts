import type { DailyProgress, Streak, User } from '@/types'

interface DatabaseSchema {
  users: User[]
  daily_progress: DailyProgress[]
  user_streak: Array<{ user_id: string; track_id: DailyProgress['track_id'] } & Streak>
}

const DB_KEY = 'roadmap_local_db_v2'

const initialDb: DatabaseSchema = {
  users: [],
  daily_progress: [],
  user_streak: [],
}

const readDb = (): DatabaseSchema => {
  const raw = localStorage.getItem(DB_KEY)
  if (!raw) return initialDb
  try {
    const parsed = JSON.parse(raw) as DatabaseSchema
    return {
      users: parsed.users ?? [],
      daily_progress: parsed.daily_progress ?? [],
      user_streak: parsed.user_streak ?? [],
    }
  } catch {
    return initialDb
  }
}

const writeDb = (next: DatabaseSchema): void => {
  localStorage.setItem(DB_KEY, JSON.stringify(next))
}

export const db = {
  users: {
    create: (user: User): User => {
      const state = readDb()
      state.users.push(user)
      writeDb(state)
      return user
    },
    updateName: (userId: string, name: string): User | null => {
      const state = readDb()
      const user = state.users.find((u) => u.id === userId)
      if (!user) return null
      user.name = name
      user.updated_at = new Date().toISOString()
      writeDb(state)
      return user
    },
    findById: (id: string): User | null => {
      const state = readDb()
      return state.users.find((u) => u.id === id) || null
    },
    findByEmail: (email: string): User | null => {
      const state = readDb()
      return state.users.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null
    },
    updateLastLogin: (id: string): User | null => {
      const state = readDb()
      const user = state.users.find((u) => u.id === id)
      if (!user) return null
      user.last_login_at = new Date().toISOString()
      writeDb(state)
      return user
    },
  },
  daily_progress: {
    create: (entry: DailyProgress): DailyProgress => {
      const state = readDb()
      state.daily_progress.push(entry)
      writeDb(state)
      return entry
    },
    update: (entry: DailyProgress): DailyProgress => {
      const state = readDb()
      const index = state.daily_progress.findIndex((item) => item.id === entry.id)
      if (index >= 0) state.daily_progress[index] = entry
      else state.daily_progress.push(entry)
      writeDb(state)
      return entry
    },
    findByDate: (userId: string, trackId: DailyProgress['track_id'], date: string): DailyProgress | null => {
      const state = readDb()
      return state.daily_progress.find((item) => item.user_id === userId && item.track_id === trackId && item.date === date) || null
    },
    listByUser: (userId: string, trackId: DailyProgress['track_id']): DailyProgress[] => {
      const state = readDb()
      return state.daily_progress
        .filter((item) => item.user_id === userId && item.track_id === trackId)
        .sort((a, b) => a.date.localeCompare(b.date))
    },
  },
  user_streak: {
    upsert: (userId: string, trackId: DailyProgress['track_id'], streak: Streak): Streak => {
      const state = readDb()
      const index = state.user_streak.findIndex((item) => item.user_id === userId && item.track_id === trackId)
      if (index >= 0) state.user_streak[index] = { user_id: userId, track_id: trackId, ...streak }
      else state.user_streak.push({ user_id: userId, track_id: trackId, ...streak })
      writeDb(state)
      return streak
    },
    findByUser: (userId: string, trackId: DailyProgress['track_id']): Streak | null => {
      const state = readDb()
      const found = state.user_streak.find((item) => item.user_id === userId && item.track_id === trackId)
      if (!found) return null
      return {
        current: found.current,
        longest: found.longest,
        last_completed_date: found.last_completed_date,
      }
    },
  },
}

export default db
