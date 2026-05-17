// Data Service - Simulando API com LocalStorage
// Futuramente, basta trocar localStorage por fetch('/api/...')

const STORAGE_KEY = 'english_roadmap_data'
const SETTINGS_KEY = 'english_roadmap_settings'

const defaultData = {
  dailyTasks: [
    { id: 0, title: '🎧 Listening / Input', duration: '1h15', completed: false },
    { id: 1, title: '🗣️ Speaking', duration: '45m', completed: false },
    { id: 2, title: '📚 Vocabulary', duration: '30m', completed: false },
    { id: 3, title: '✍️ Grammar & Writing', duration: '30m', completed: false },
  ],
  history: {}, // { YYYY-MM-DD: { tasks: [true, false, ...], lastUpdated: timestamp } }
  currentPhase: 1,
  startDate: new Date(2026, 0, 1).toISOString(),
}

// Simular delay de API
const delay = (ms = 100) => new Promise(resolve => setTimeout(resolve, ms))

const dataService = {
  // Inicializar dados
  initialize: async () => {
    await delay()
    const existing = localStorage.getItem(STORAGE_KEY)
    if (!existing) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultData))
    }
    return dataService.getAllData()
  },

  // Obter todos os dados
  getAllData: async () => {
    await delay()
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : defaultData
  },

  // Obter progresso de hoje
  getTodayProgress: async () => {
    await delay()
    const today = new Date().toISOString().split('T')[0]
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || JSON.stringify(defaultData))
    
    if (!data.history[today]) {
      // Se é um novo dia, verificar se deve resetar
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

  // Atualizar progresso diário
  updateDailyProgress: async (taskIndex, completed) => {
    await delay()
    const today = new Date().toISOString().split('T')[0]
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

  // Resetar dia com dupla confirmação
  resetDailyProgress: async (confirmed = false) => {
    await delay()
    if (!confirmed) {
      return { requiresConfirmation: true }
    }

    const today = new Date().toISOString().split('T')[0]
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || JSON.stringify(defaultData))

    data.history[today] = {
      tasks: data.dailyTasks.map(() => false),
      lastUpdated: new Date().toISOString(),
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    return data.history[today]
  },

  // Calcular dias seguidos (streak)
  getStreak: async () => {
    await delay()
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || JSON.stringify(defaultData))
    const history = data.history
    
    if (Object.keys(history).length === 0) return 0

    const days = Object.keys(history).sort().reverse()
    let streak = 0
    let currentDate = new Date()

    for (const day of days) {
      const dayStr = currentDate.toISOString().split('T')[0]
      
      if (day === dayStr) {
        const completed = history[day].tasks.every(task => task)
        if (completed) {
          streak++
          currentDate.setDate(currentDate.getDate() - 1)
        } else {
          break
        }
      } else {
        break
      }
    }

    return streak
  },

  // Obter estatísticas gerais
  getStats: async () => {
    await delay()
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || JSON.stringify(defaultData))
    const history = data.history
    const today = new Date().toISOString().split('T')[0]
    const todayData = history[today]

    const totalDays = Object.keys(history).length
    const completedDays = Object.values(history).filter(day =>
      day.tasks.every(task => task)
    ).length

    const todayCompleted = todayData ? todayData.tasks.filter(t => t).length : 0
    const totalTasks = data.dailyTasks.length

    // Calcular fase baseado no tempo (simplificado)
    const startDate = new Date(data.startDate)
    const daysPassed = Math.floor((new Date() - startDate) / (1000 * 60 * 60 * 24))
    let phase = 1
    if (daysPassed > 60) phase = 2
    if (daysPassed > 120) phase = 3
    if (daysPassed > 240) phase = 4
    if (daysPassed > 330) phase = 5

    return {
      totalDays,
      completedDays,
      todayCompleted,
      totalTasks,
      streak: await dataService.getStreak(),
      phase,
      completionRate: totalDays > 0 ? Math.round((completedDays / totalDays) * 100) : 0,
    }
  },

  // Obter histórico com filtro
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

  // Obter todas as datas com dados
  getAllDates: async () => {
    await delay()
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || JSON.stringify(defaultData))
    return Object.keys(data.history).sort()
  },

  // Obter dado de um dia específico
  getDayData: async (dateStr) => {
    await delay()
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || JSON.stringify(defaultData))
    return data.history[dateStr] || null
  },

  // Calcular porcentagem de conclusão de um dia
  getDayCompletionPercentage: async (dateStr) => {
    await delay()
    const dayData = await dataService.getDayData(dateStr)
    if (!dayData) return 0
    const completed = dayData.tasks.filter(t => t).length
    return Math.round((completed / dayData.tasks.length) * 100)
  },

  // Obter cor do dia baseado na conclusão
  getDayColor: async (dateStr) => {
    const percentage = await dataService.getDayCompletionPercentage(dateStr)
    if (percentage === 0) return 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
    if (percentage === 100) return 'bg-green-700 dark:bg-green-600'
    if (percentage >= 75) return 'bg-green-500'
    if (percentage >= 50) return 'bg-green-300'
    if (percentage >= 25) return 'bg-yellow-300'
    return 'bg-orange-300'
  },

  // Resetar tudo (para testes)
  reset: async () => {
    await delay()
    localStorage.removeItem(STORAGE_KEY)
    return dataService.initialize()
  },
}

export default dataService
