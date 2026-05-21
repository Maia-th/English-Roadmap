import { getTrackData, defaultTrackId } from '../data/roadmapData'

const STORAGE_KEYS = {
  english: {
    data: 'english_roadmap_data',
    settings: 'english_roadmap_settings',
  },
  spanish: {
    data: 'spanish_roadmap_data',
    settings: 'spanish_roadmap_settings',
  },
}

// Função auxiliar para evitar o bug de fuso horário (timezone) do toISOString()
const getLocalDateString = (date = new Date()) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const defaultSettings = {
  proficiencyLevel: null,
}

const phaseToProficiency = (phase) => {
  if (phase <= 1) return 'A1'
  if (phase === 2) return 'A2'
  if (phase === 3) return 'B1'
  if (phase === 4) return 'B2'
  return 'C1'
}

const calculatePhaseFromStartDate = (startDateValue) => {
  const startDate = new Date(startDateValue)
  const daysPassed = Math.floor((new Date() - startDate) / (1000 * 60 * 60 * 24))
  let phase = 1
  if (daysPassed > 60) phase = 2
  if (daysPassed > 120) phase = 3
  if (daysPassed > 240) phase = 4
  if (daysPassed > 330) phase = 5
  return phase
}

const delay = (ms = 100) => new Promise(resolve => setTimeout(resolve, ms))

const resolveTrackId = (trackId) => (trackId && STORAGE_KEYS[trackId] ? trackId : defaultTrackId)

const getStorageConfig = (trackId) => {
  const resolvedTrackId = resolveTrackId(trackId)
  return STORAGE_KEYS[resolvedTrackId] || STORAGE_KEYS[defaultTrackId]
}

const getDefaultData = (trackId) => {
  const trackData = getTrackData(trackId)
  return {
    dailyTasks: trackData.dailyTasks,
    history: {},
    currentPhase: 1,
    startDate: new Date(2026, 0, 1).toISOString(),
  }
}

const readData = (trackId) => {
  const { data: storageKey } = getStorageConfig(trackId)
  const defaultData = getDefaultData(trackId)
  const raw = localStorage.getItem(storageKey)
  return raw ? JSON.parse(raw) : defaultData
}

const writeData = (trackId, data) => {
  const { data: storageKey } = getStorageConfig(trackId)
  localStorage.setItem(storageKey, JSON.stringify(data))
}

const readSettings = (trackId) => {
  const { settings: settingsKey } = getStorageConfig(trackId)
  const raw = localStorage.getItem(settingsKey)
  return raw ? JSON.parse(raw) : defaultSettings
}

const writeSettings = (trackId, settings) => {
  const { settings: settingsKey } = getStorageConfig(trackId)
  localStorage.setItem(settingsKey, JSON.stringify(settings))
}

const dataService = {
  initialize: async (trackId = defaultTrackId) => {
    await delay()
    const resolvedTrackId = resolveTrackId(trackId)
    const { data: dataKey, settings: settingsKey } = getStorageConfig(resolvedTrackId)

    if (!localStorage.getItem(dataKey)) {
      writeData(resolvedTrackId, getDefaultData(resolvedTrackId))
    }

    if (!localStorage.getItem(settingsKey)) {
      writeSettings(resolvedTrackId, defaultSettings)
    }

    return dataService.getAllData(resolvedTrackId)
  },

  getAllData: async (trackId = defaultTrackId) => {
    await delay()
    return readData(trackId)
  },

  getTodayProgress: async (trackId = defaultTrackId) => {
    await delay()
    const today = getLocalDateString()
    const data = readData(trackId)

    if (!data.history[today]) {
      const lastDay = Object.keys(data.history).sort().pop()
      if (lastDay !== today) {
        data.history[today] = {
          tasks: data.dailyTasks.map(() => false),
          lastUpdated: new Date().toISOString(),
        }
        writeData(trackId, data)
      }
    }

    return data.history[today] || {
      tasks: data.dailyTasks.map(() => false),
      lastUpdated: new Date().toISOString(),
    }
  },

  updateDailyProgress: async (taskIndex, completed, trackId = defaultTrackId) => {
    await delay()
    const today = getLocalDateString()
    const data = readData(trackId)

    if (!data.history[today]) {
      data.history[today] = {
        tasks: data.dailyTasks.map(() => false),
        lastUpdated: new Date().toISOString(),
      }
    }

    data.history[today].tasks[taskIndex] = completed
    data.history[today].lastUpdated = new Date().toISOString()

    writeData(trackId, data)
    return data.history[today]
  },

  resetDailyProgress: async (confirmed = false, trackId = defaultTrackId) => {
    await delay()
    if (!confirmed) {
      return { requiresConfirmation: true }
    }

    const today = getLocalDateString()
    const data = readData(trackId)

    data.history[today] = {
      tasks: data.dailyTasks.map(() => false),
      lastUpdated: new Date().toISOString(),
    }

    writeData(trackId, data)
    return data.history[today]
  },

  getStreak: async (trackId = defaultTrackId) => {
    await delay()
    const data = readData(trackId)
    const history = data.history

    if (Object.keys(history).length === 0) return 0

    let streak = 0
    let currentDate = new Date()

    const todayStr = getLocalDateString(currentDate)
    const todayData = history[todayStr]
    const isTodayCompleted = todayData && todayData.tasks.length > 0 && todayData.tasks.every(task => task)

    if (isTodayCompleted) {
      streak++
    }

    currentDate.setDate(currentDate.getDate() - 1)

    while (true) {
      const checkDayStr = getLocalDateString(currentDate)
      const dayData = history[checkDayStr]
      const isCompleted = dayData && dayData.tasks.length > 0 && dayData.tasks.every(task => task)

      if (isCompleted) {
        streak++
        currentDate.setDate(currentDate.getDate() - 1)
      } else {
        break
      }
    }

    return streak
  },

  getStats: async (trackId = defaultTrackId) => {
    await delay()
    const data = readData(trackId)
    const history = data.history
    const today = getLocalDateString()
    const todayData = history[today]

    const totalDays = Object.keys(history).length
    const completedDays = Object.values(history).filter(day => day.tasks.every(task => task)).length

    const todayCompleted = todayData ? todayData.tasks.filter(t => t).length : 0
    const totalTasks = data.dailyTasks.length
    const phase = calculatePhaseFromStartDate(data.startDate)
    const proficiencyLevel = await dataService.getProficiencyLevel(phase, trackId)

    return {
      totalDays,
      completedDays,
      todayCompleted,
      totalTasks,
      streak: await dataService.getStreak(trackId),
      phase,
      proficiencyLevel,
      completionRate: totalDays > 0 ? Math.round((completedDays / totalDays) * 100) : 0,
    }
  },

  getProficiencyLevel: async (currentPhase = null, trackId = defaultTrackId) => {
    await delay()
    const settings = readSettings(trackId)
    if (settings.proficiencyLevel) return settings.proficiencyLevel

    let phase = currentPhase
    if (!phase) {
      const data = readData(trackId)
      phase = calculatePhaseFromStartDate(data.startDate)
    }

    return phaseToProficiency(phase)
  },

  updateProficiencyLevel: async (level, trackId = defaultTrackId) => {
    await delay()
    const settings = readSettings(trackId)
    settings.proficiencyLevel = level
    writeSettings(trackId, settings)
    return settings.proficiencyLevel
  },

  getHistoryFiltered: async (startDate, endDate, trackId = defaultTrackId) => {
    await delay()
    const history = readData(trackId).history

    const filtered = {}
    const start = new Date(startDate).getTime()
    const end = new Date(endDate).getTime()

    for (const [date, dayData] of Object.entries(history)) {
      const dayTime = new Date(`${date}T00:00:00`).getTime()
      if (dayTime >= start && dayTime <= end) {
        filtered[date] = dayData
      }
    }

    return filtered
  },

  getAllDates: async (trackId = defaultTrackId) => {
    await delay()
    return Object.keys(readData(trackId).history).sort()
  },

  getDayData: async (dateStr, trackId = defaultTrackId) => {
    await delay()
    return readData(trackId).history[dateStr] || null
  },

  getDayCompletionPercentage: async (dateStr, trackId = defaultTrackId) => {
    await delay()
    const dayData = await dataService.getDayData(dateStr, trackId)
    if (!dayData) return 0
    const completed = dayData.tasks.filter(t => t).length
    return Math.round((completed / dayData.tasks.length) * 100)
  },

  getDayColor: async (dateStr, trackId = defaultTrackId) => {
    const percentage = await dataService.getDayCompletionPercentage(dateStr, trackId)
    if (percentage === 0) return 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
    if (percentage === 100) return 'bg-green-700 dark:bg-green-600'
    if (percentage >= 75) return 'bg-green-500'
    if (percentage >= 50) return 'bg-green-300'
    if (percentage >= 25) return 'bg-yellow-300'
    return 'bg-orange-300'
  },

  reset: async (trackId = defaultTrackId) => {
    await delay()
    const { data: dataKey, settings: settingsKey } = getStorageConfig(trackId)
    localStorage.removeItem(dataKey)
    localStorage.removeItem(settingsKey)
    return dataService.initialize(trackId)
  },
}

export default dataService
