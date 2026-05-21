// Data Service - Simulando API com LocalStorage

const STORAGE_KEY = 'english_roadmap_data'
const SETTINGS_KEY = 'english_roadmap_settings'

const getLocalDateString = (date = new Date()) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const defaultData = {
  dailyTasks: [
    { id: 0, title: '🎧 Listening / Input', duration: '1h15', completed: false },
    { id: 1, title: '🗣️ Speaking', duration: '45m', completed: false },
    { id: 2, title: '📚 Vocabulary', duration: '30m', completed: false },
    { id: 3, title: '✍️ Grammar & Writing', duration: '30m', completed: false },
  ],
  history: {}, 
  currentPhase: 1,
  startDate: new Date().toISOString(),
  
  // ESTATÍSTICAS DE QUESTÕES
  questionStats: { total: 0, correct: 0, wrong: 0 },
  questionStatsByLevel: {}, // ex: { 'A1': { total: 0, correct: 0, wrong: 0 } }
  questionStatsByTheme: {}, // ex: { 'Grammar': { total: 0, correct: 0, wrong: 0 } }
  answeredQuestions: {}, 

  // DADOS DOS FLASHCARDS
  flashcardsStatus: {} // ex: { 'f1': { status: 'review', lastReviewed: '2026...' } }
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

const dataService = {
  initialize: async () => {
    await delay()
    const existing = localStorage.getItem(STORAGE_KEY)
    if (!existing) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultData))
    }
    const existingSettings = localStorage.getItem(SETTINGS_KEY)
    if (!existingSettings) {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(defaultSettings))
    }
    return dataService.getAllData()
  },

  getAllData: async () => {
    await delay()
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : defaultData
  },

  getTodayProgress: async () => {
    await delay()
    const today = getLocalDateString()
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || JSON.stringify(defaultData))
    
    if (!data.history[today]) {
      const lastDay = Object.keys(data.history).sort().pop()
      if (lastDay !== today) {
        data.history[today] = {
          tasks: data.dailyTasks.map(() => false),
          lastUpdated: new Date().toISOString(),
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
      }
    }

    return data.history[today] || {
      tasks: data.dailyTasks.map(() => false),
      lastUpdated: new Date().toISOString(),
    }
  },

  updateDailyProgress: async (taskIndex, completed) => {
    await delay()
    const today = getLocalDateString()
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || JSON.stringify(defaultData))

    if (!data.history[today]) {
      data.history[today] = {
        tasks: data.dailyTasks.map(() => false),
        lastUpdated: new Date().toISOString(),
      }
    }

    data.history[today].tasks[taskIndex] = completed
    data.history[today].lastUpdated = new Date().toISOString()

    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    return data.history[today]
  },

  resetDailyProgress: async (confirmed = false) => {
    await delay()
    if (!confirmed) {
      return { requiresConfirmation: true }
    }

    const today = getLocalDateString()
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || JSON.stringify(defaultData))

    data.history[today] = {
      tasks: data.dailyTasks.map(() => false),
      lastUpdated: new Date().toISOString(),
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    return data.history[today]
  },

  getStreak: async () => {
    await delay()
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || JSON.stringify(defaultData))
    const history = data.history
    
    if (Object.keys(history).length === 0) return 0

    let streak = 0
    let currentDate = new Date()
    const todayStr = getLocalDateString(currentDate)
    const todayData = history[todayStr]
    const isTodayCompleted = todayData && todayData.tasks.length > 0 && todayData.tasks.every(task => task)
    
    if (isTodayCompleted) streak++

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

  getStats: async () => {
    await delay()
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || JSON.stringify(defaultData))
    const history = data.history
    const today = getLocalDateString()
    const todayData = history[today]

    const totalDays = Object.keys(history).length
    const completedDays = Object.values(history).filter(day =>
      day.tasks.every(task => task)
    ).length

    const todayCompleted = todayData ? todayData.tasks.filter(t => t).length : 0
    const totalTasks = data.dailyTasks.length
    const phase = calculatePhaseFromStartDate(data.startDate)
    const proficiencyLevel = await dataService.getProficiencyLevel(phase)

    return {
      totalDays,
      completedDays,
      todayCompleted,
      totalTasks,
      streak: await dataService.getStreak(),
      phase,
      proficiencyLevel,
      completionRate: totalDays > 0 ? Math.round((completedDays / totalDays) * 100) : 0,
    }
  },

  getProficiencyLevel: async (currentPhase = null) => {
    await delay()
    const settings = JSON.parse(localStorage.getItem(SETTINGS_KEY) || JSON.stringify(defaultSettings))
    if (settings.proficiencyLevel) return settings.proficiencyLevel
    let phase = currentPhase
    if (!phase) {
      const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || JSON.stringify(defaultData))
      phase = calculatePhaseFromStartDate(data.startDate)
    }
    return phaseToProficiency(phase)
  },

  updateProficiencyLevel: async (level) => {
    await delay()
    const settings = JSON.parse(localStorage.getItem(SETTINGS_KEY) || JSON.stringify(defaultSettings))
    settings.proficiencyLevel = level
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
    return settings.proficiencyLevel
  },

  getHistoryFiltered: async (startDate, endDate) => {
    await delay()
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || JSON.stringify(defaultData))
    const history = data.history
    const filtered = {}
    const start = new Date(startDate).getTime()
    const end = new Date(endDate).getTime()

    for (const [date, dayData] of Object.entries(history)) {
      const dayTime = new Date(date + 'T00:00:00').getTime()
      if (dayTime >= start && dayTime <= end) {
        filtered[date] = dayData
      }
    }
    return filtered
  },

  getAllDates: async () => {
    await delay()
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || JSON.stringify(defaultData))
    return Object.keys(data.history).sort()
  },

  getDayData: async (dateStr) => {
    await delay()
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || JSON.stringify(defaultData))
    return data.history[dateStr] || null
  },

  getDayCompletionPercentage: async (dateStr) => {
    await delay()
    const dayData = await dataService.getDayData(dateStr)
    if (!dayData) return 0
    const completed = dayData.tasks.filter(t => t).length
    return Math.round((completed / dayData.tasks.length) * 100)
  },

  getDayColor: async (dateStr) => {
    const percentage = await dataService.getDayCompletionPercentage(dateStr)
    if (percentage === 0) return 'bg-white border border-gray-200'
    if (percentage === 100) return 'bg-green-700'
    if (percentage >= 75) return 'bg-green-500'
    if (percentage >= 50) return 'bg-green-300'
    if (percentage >= 25) return 'bg-yellow-300'
    return 'bg-orange-300'
  },

  // --- FUNÇÕES DE QUESTÕES ---
  getQuestionStats: async () => {
    await delay()
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || JSON.stringify(defaultData))
    return {
      global: data.questionStats || { total: 0, correct: 0, wrong: 0 },
      byLevel: data.questionStatsByLevel || {},
      byTheme: data.questionStatsByTheme || {}
    }
  },

  getAnsweredQuestions: async () => {
    await delay()
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || JSON.stringify(defaultData))
    return data.answeredQuestions || {}
  },

  saveQuestionAnswer: async (questionId, isCorrect, level, theme) => {
    await delay()
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || JSON.stringify(defaultData))
    
    if (!data.questionStats) data.questionStats = { total: 0, correct: 0, wrong: 0 }
    if (!data.questionStatsByLevel) data.questionStatsByLevel = {}
    if (!data.questionStatsByTheme) data.questionStatsByTheme = {}
    if (!data.answeredQuestions) data.answeredQuestions = {}

    if (!data.questionStatsByLevel[level]) data.questionStatsByLevel[level] = { total: 0, correct: 0, wrong: 0 }
    if (!data.questionStatsByTheme[theme]) data.questionStatsByTheme[theme] = { total: 0, correct: 0, wrong: 0 }

    data.questionStats.total += 1
    if (isCorrect) data.questionStats.correct += 1
    else data.questionStats.wrong += 1

    data.questionStatsByLevel[level].total += 1
    if (isCorrect) data.questionStatsByLevel[level].correct += 1
    else data.questionStatsByLevel[level].wrong += 1

    data.questionStatsByTheme[theme].total += 1
    if (isCorrect) data.questionStatsByTheme[theme].correct += 1
    else data.questionStatsByTheme[theme].wrong += 1

    data.answeredQuestions[questionId] = {
      lastSeen: new Date().toISOString(),
      isCorrect: isCorrect
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    return true
  },

  // --- FUNÇÕES DE FLASHCARDS ---
  getFlashcardsStatus: async () => {
    await delay()
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || JSON.stringify(defaultData))
    return data.flashcardsStatus || {}
  },

  saveFlashcardStatus: async (cardId, status) => {
    await delay()
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || JSON.stringify(defaultData))
    if (!data.flashcardsStatus) data.flashcardsStatus = {}

    data.flashcardsStatus[cardId] = {
      status: status, // 'mastered' ou 'review'
      lastReviewed: new Date().toISOString()
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    return data.flashcardsStatus
  },

  reset: async () => {
    await delay()
    localStorage.removeItem(STORAGE_KEY)
    return dataService.initialize()
  }
}

export default dataService