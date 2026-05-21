export type TrackId = 'english' | 'spanish'

export interface User {
  id: string
  email: string
  name: string
  password_hash: string
  created_at: string
  updated_at?: string
  last_login_at?: string
}

export interface DailyProgress {
  id: string
  user_id: string
  track_id: TrackId
  date: string
  listening: boolean
  speaking: boolean
  vocabulary: boolean
  grammar: boolean
  updated_at: string
}

export interface Streak {
  current: number
  longest: number
  last_completed_date: string | null
}

export interface HistoryEntry {
  date: string
  tasks: boolean[]
  completion_percentage: number
  track_id: TrackId
}

export interface Tool {
  name: string
  url: string
  icon: string
  color: string
}

export interface Task {
  id: number
  title: string
  duration: string
  completed: boolean
}

export interface Phase {
  id: number
  title: string
  months: string
  objective: string
  description: string
  focus: string[]
  goals: string[]
  color: string
  icon: string
}

export interface TrackData {
  id: TrackId
  name: string
  shortName: string
  flag: string
  dashboardTitle: string
  dashboardSubtitle: string
  dashboardGradient: string
  dailyRoutineTitle: string
  todayCardGradient: string
  roadmapHeroTitle: string
  roadmapHeroSubtitle: string
  finalRuleStudy: string
  finalRuleLive: string
  proficiencyTestUrl: string
  dailyTasks: Task[]
  phases: Phase[]
  platforms: {
    beginner: Array<{ name: string; url: string }>
    technical: Array<{ name: string; url: string }>
    advanced: Array<{ name: string; url: string }>
  }
  tools: Tool[]
  speakingMilestones: Array<{ month: number; goal: string }>
  levelIndicators: Array<{ level: string; characteristics: string[] }>
  strategies: Array<{ title: string; description: string; tips: string[]; accent: string; icon: string }>
  mistakes: string[]
  accelerators: string[]
}
