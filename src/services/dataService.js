// Data Service - Simulando API com LocalStorage
// Futuramente, basta trocar localStorage por fetch('/api/...')

const STORAGE_KEY = 'english_roadmap_data'
const SETTINGS_KEY = 'english_roadmap_settings'

// Função auxiliar para evitar o bug de fuso horário (timezone) do toISOString()
const getLocalDateString = (date = new Date()) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}` // Retorna sempre o dia real local, ex: "2026-05-17"
}

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
    const existingSettings = localStorage.getItem(SETTINGS_KEY)
    if (!existingSettings) {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(defaultSettings))
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
    const today = getLocalDateString() // Correção aplicada aqui
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || JSON.stringify(defaultData))
    
    if (!data.history[today]) {
      // Se é um novo dia, verificar se deve resetar
      const lastDay = Object.keys(data.history).sort().pop()
      if (lastDay !== today) {
        data.history[today] = {
          tasks: data.dailyTasks.map(() => false),
          lastUpdated: new Date().toISOString(), // lastUpdated pode continuar UTC pois é só pra marcação de tempo
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
    const today = getLocalDateString() // Correção aplicada aqui
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

    const today = getLocalDateString() // Correção aplicada aqui
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

    let streak = 0
    let currentDate = new Date()

    // 1. Verifica HOJE
    const todayStr = getLocalDateString(currentDate) // Usa a função de data local que criamos antes
    const todayData = history[todayStr]
    
    // Se hoje tem dados e todas as tarefas estão completas (100%)
    const isTodayCompleted = todayData && todayData.tasks.length > 0 && todayData.tasks.every(task => task)
    
    if (isTodayCompleted) {
      streak++
    }

    // 2. Volta dia por dia, começando por ONTEM
    currentDate.setDate(currentDate.getDate() - 1)

    while (true) {
      const checkDayStr = getLocalDateString(currentDate)
      const dayData = history[checkDayStr]
      
      const isCompleted = dayData && dayData.tasks.length > 0 && dayData.tasks.every(task => task)

      if (isCompleted) {
        streak++ // Se ontem (e dias anteriores) completou 100%, soma na ofensiva
        currentDate.setDate(currentDate.getDate() - 1) // Volta mais um dia
      } else {
        // Se achou um dia no passado que não foi 100%, a ofensiva é quebrada
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
    const today = getLocalDateString() // Correção aplicada aqui
    const todayData = history[today]

    const totalDays = Object.keys(history).length
    const completedDays = Object.values(history).filter(day =>
      day.tasks.every(task => task)
    ).length

    const todayCompleted = todayData ? todayData.tasks.filter(t => t).length : 0
    const totalTasks = data.dailyTasks.length

    // Calcular fase baseado no tempo (simplificado)
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

  // Obter nível de proficiência atual
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

  // Atualizar nível de proficiência manualmente
  updateProficiencyLevel: async (level) => {
    await delay()
    const settings = JSON.parse(localStorage.getItem(SETTINGS_KEY) || JSON.stringify(defaultSettings))
    settings.proficiencyLevel = level
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
    return settings.proficiencyLevel
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