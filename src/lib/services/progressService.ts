import db from '@/lib/database'
import { defaultTrackId } from '@/data/roadmapData'
import type { DailyProgress, HistoryEntry, Streak, TrackId } from '@/types'

const SETTINGS_KEY = 'roadmap_progress_settings_v2'

interface UserTrackSettings {
  proficiencyLevel?: string
}

interface ProgressSettings {
  [key: string]: UserTrackSettings
}

const getLocalDateString = (date = new Date()): string => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const taskIndexes = ['listening', 'speaking', 'vocabulary', 'grammar'] as const

const readSettings = (): ProgressSettings => {
  const raw = localStorage.getItem(SETTINGS_KEY)
  if (!raw) return {}
  try {
    return JSON.parse(raw) as ProgressSettings
  } catch {
    return {}
  }
}

const writeSettings = (settings: ProgressSettings): void => {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
}

const settingsKey = (userId: string, trackId: TrackId): string => `${userId}:${trackId}`

const mapToTasks = (entry: DailyProgress): boolean[] => [entry.listening, entry.speaking, entry.vocabulary, entry.grammar]

const completionPercentage = (tasks: boolean[]): number => Math.round((tasks.filter(Boolean).length / tasks.length) * 100)

const ensureToday = (userId: string, trackId: TrackId): DailyProgress => {
  const today = getLocalDateString()
  const existing = db.daily_progress.findByDate(userId, trackId, today)
  if (existing) return existing

  return db.daily_progress.create({
    id: crypto.randomUUID(),
    user_id: userId,
    track_id: trackId,
    date: today,
    listening: false,
    speaking: false,
    vocabulary: false,
    grammar: false,
    updated_at: new Date().toISOString(),
  })
}

const updateDaily = async (userId: string, taskIndex: number, completed: boolean, trackId: TrackId = defaultTrackId): Promise<DailyProgress> => {
  const current = ensureToday(userId, trackId)
  const key = taskIndexes[taskIndex]
  if (!key) throw new Error('Índice de tarefa inválido.')

  const next: DailyProgress = {
    ...current,
    [key]: completed,
    updated_at: new Date().toISOString(),
  }

  db.daily_progress.update(next)
  await getStreak(userId, trackId)
  return next
}

const getTodayProgress = async (userId: string, trackId: TrackId = defaultTrackId): Promise<DailyProgress> => ensureToday(userId, trackId)

const getHistory = async (
  userId: string,
  startDate?: Date,
  endDate?: Date,
  trackId: TrackId = defaultTrackId,
): Promise<HistoryEntry[]> => {
  const all = db.daily_progress.listByUser(userId, trackId)

  const filtered = all.filter((item) => {
    const value = new Date(`${item.date}T00:00:00`).getTime()
    if (startDate && value < startDate.getTime()) return false
    if (endDate && value > endDate.getTime()) return false
    return true
  })

  return filtered.map((item) => {
    const tasks = mapToTasks(item)
    return {
      date: item.date,
      tasks,
      completion_percentage: completionPercentage(tasks),
      track_id: trackId,
    }
  })
}

const getStreak = async (userId: string, trackId: TrackId = defaultTrackId): Promise<Streak> => {
  const entries = db.daily_progress.listByUser(userId, trackId)
  const completedDates = entries.filter((entry) => mapToTasks(entry).every(Boolean)).map((entry) => entry.date)

  if (completedDates.length === 0) {
    const zero: Streak = { current: 0, longest: 0, last_completed_date: null }
    db.user_streak.upsert(userId, trackId, zero)
    return zero
  }

  const set = new Set(completedDates)
  const today = new Date(`${getLocalDateString()}T00:00:00`)

  let current = 0
  const cursor = new Date(today)
  while (set.has(getLocalDateString(cursor))) {
    current += 1
    cursor.setDate(cursor.getDate() - 1)
  }

  let longest = 0
  let running = 0
  const ordered = [...completedDates].sort()
  for (let i = 0; i < ordered.length; i += 1) {
    if (i === 0) {
      running = 1
    } else {
      const prev = new Date(`${ordered[i - 1]}T00:00:00`)
      const curr = new Date(`${ordered[i]}T00:00:00`)
      const diffDays = Math.round((curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24))
      running = diffDays === 1 ? running + 1 : 1
    }
    longest = Math.max(longest, running)
  }

  const streak: Streak = {
    current,
    longest,
    last_completed_date: ordered[ordered.length - 1] ?? null,
  }

  db.user_streak.upsert(userId, trackId, streak)
  return streak
}

const resetDaily = async (userId: string, trackId: TrackId = defaultTrackId): Promise<void> => {
  const current = ensureToday(userId, trackId)
  db.daily_progress.update({
    ...current,
    listening: false,
    speaking: false,
    vocabulary: false,
    grammar: false,
    updated_at: new Date().toISOString(),
  })
  await getStreak(userId, trackId)
}

const getStats = async (userId: string, trackId: TrackId = defaultTrackId) => {
  const today = await getTodayProgress(userId, trackId)
  const todayTasks = mapToTasks(today)
  const history = await getHistory(userId, undefined, undefined, trackId)
  const completedDays = history.filter((entry) => entry.tasks.every(Boolean)).length
  const streak = await getStreak(userId, trackId)

  return {
    totalDays: history.length,
    completedDays,
    todayCompleted: todayTasks.filter(Boolean).length,
    totalTasks: todayTasks.length,
    streak: streak.current,
    longestStreak: streak.longest,
    completionRate: history.length > 0 ? Math.round((completedDays / history.length) * 100) : 0,
    proficiencyLevel: await getProficiencyLevel(userId, trackId),
  }
}

const getProficiencyLevel = async (userId: string, trackId: TrackId = defaultTrackId): Promise<string> => {
  const settings = readSettings()
  return settings[settingsKey(userId, trackId)]?.proficiencyLevel ?? 'A1'
}

const updateProficiencyLevel = async (userId: string, level: string, trackId: TrackId = defaultTrackId): Promise<string> => {
  const settings = readSettings()
  settings[settingsKey(userId, trackId)] = {
    ...settings[settingsKey(userId, trackId)],
    proficiencyLevel: level,
  }
  writeSettings(settings)
  return level
}

const getHistoryMap = async (userId: string, startDate: Date, endDate: Date, trackId: TrackId = defaultTrackId) => {
  const entries = await getHistory(userId, startDate, endDate, trackId)
  return entries.reduce<Record<string, HistoryEntry>>((acc, item) => {
    acc[item.date] = item
    return acc
  }, {})
}

export const progressService = {
  updateDaily,
  getTodayProgress,
  getHistory,
  getStreak,
  resetDaily,
  getStats,
  getProficiencyLevel,
  updateProficiencyLevel,
  getHistoryMap,
}

export default progressService
