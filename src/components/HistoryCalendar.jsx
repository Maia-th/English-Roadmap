import React, { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react'
import dataService from '../services/dataService'

// Função auxiliar para evitar o bug de fuso horário do toISOString()
const getLocalDateString = (date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function HistoryCalendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [history, setHistory] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [showTooltip, setShowTooltip] = useState(null)

  useEffect(() => {
    // Carrega a primeira vez e remove o loading
    loadHistory().then(() => setIsLoading(false))
    
    // Configura o intervalo para atualizar o calendário sozinho a cada 5 segundos
    // (Igual foi feito no componente de ofensiva)
    const interval = setInterval(() => {
      loadHistory(false) // false indica que não queremos mostrar a tela de 'Carregando' a cada 5s
    }, 5000)

    return () => clearInterval(interval)
  }, [currentMonth])

  const loadHistory = async (showLoading = true) => {
    if (showLoading) setIsLoading(true)
    const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1)
    const lastDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0)
    
    const filtered = await dataService.getHistoryFiltered(firstDay, lastDay)
    setHistory(filtered)
    // Nota: O setIsLoading(false) da primeira carga agora é gerido no useEffect
  }

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const getCompletionPercentage = (dateStr) => {
    if (!history[dateStr]) return 0
    if (!history[dateStr].tasks || history[dateStr].tasks.length === 0) return 0
    const completed = history[dateStr].tasks.filter(t => t).length
    return Math.round((completed / history[dateStr].tasks.length) * 100)
  }

  const getDayColor = (dateStr, percentage) => {
    // CORREÇÃO 1: Se a porcentagem é 0, independente de existir ou não no histórico,
    // a cor deve ser a neutra (cinza).
    if (percentage === 0) {
      return 'bg-gray-50 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700'
    }
    
    // Se for maior que 0, entra nas regras de cor:
    if (percentage === 100) return 'bg-green-700 hover:bg-green-800 text-white'
    if (percentage >= 75) return 'bg-green-500 hover:bg-green-600 text-white'
    if (percentage >= 50) return 'bg-emerald-300 hover:bg-emerald-400 text-gray-900'
    if (percentage >= 25) return 'bg-amber-300 hover:bg-amber-400 text-gray-900'
    
    // Fallback para 1% a 24% (já que 0% foi tratado no começo)
    return 'bg-orange-300 hover:bg-orange-400 text-gray-900'
  }

  const days = []
  const daysInMonth = getDaysInMonth(currentMonth)
  const firstDay = getFirstDayOfMonth(currentMonth)
  const todayStr = getLocalDateString(new Date())

  // Dias vazios antes do primeiro dia do mês
  for (let i = 0; i < firstDay; i++) {
    days.push(null)
  }

  // Dias do mês
  for (let i = 1; i <= daysInMonth; i++) {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i)
    days.push(getLocalDateString(date))
  }

  const monthName = currentMonth.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
  
  const completedDaysInMonth = Object.entries(history).filter(([dateStr, day]) => {
    const [year, month] = dateStr.split('-')
    return (
      parseInt(year, 10) === currentMonth.getFullYear()
      && parseInt(month, 10) === currentMonth.getMonth() + 1
      && day.tasks && day.tasks.length > 0
      && day.tasks.every(task => task)
    )
  }).length

  return (
    <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2">
            <Calendar size={24} />
            Histórico
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Dias completos no mês: <span className="font-bold">{completedDaysInMonth}</span>
          </p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-smooth border border-gray-200 dark:border-gray-600"
            aria-label="Mês anterior"
          >
            <ChevronLeft size={20} />
          </button>
          <span className="text-sm font-semibold text-gray-600 dark:text-gray-400 min-w-fit capitalize px-3">
            {monthName}
          </span>
          <button
            onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-smooth border border-gray-200 dark:border-gray-600"
            aria-label="Próximo mês"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
        
        {/* Legenda */}
        <div className="w-full lg:w-48 xl:w-56 flex-shrink-0">
          <h3 className="text-sm font-semibold mb-3 hidden lg:block text-gray-700 dark:text-gray-300">
            Legenda
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-1 gap-2 text-xs">
            <div className="flex items-center gap-2 p-2 rounded-lg bg-gray-50 dark:bg-gray-700/50">
              <div className="w-4 h-4 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded flex-shrink-0" />
              <span className="text-gray-600 dark:text-gray-400">0%</span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-lg bg-gray-50 dark:bg-gray-700/50">
              <div className="w-4 h-4 bg-orange-300 rounded flex-shrink-0" />
              <span className="text-gray-600 dark:text-gray-400">1-24%</span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-lg bg-gray-50 dark:bg-gray-700/50">
              <div className="w-4 h-4 bg-amber-300 rounded flex-shrink-0" />
              <span className="text-gray-600 dark:text-gray-400">25-49%</span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-lg bg-gray-50 dark:bg-gray-700/50">
              <div className="w-4 h-4 bg-emerald-300 rounded flex-shrink-0" />
              <span className="text-gray-600 dark:text-gray-400">50-74%</span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-lg bg-gray-50 dark:bg-gray-700/50">
              <div className="w-4 h-4 bg-green-500 rounded flex-shrink-0" />
              <span className="text-gray-600 dark:text-gray-400">75-99%</span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-lg bg-gray-50 dark:bg-gray-700/50">
              <div className="w-4 h-4 bg-green-700 rounded flex-shrink-0" />
              <span className="text-gray-600 dark:text-gray-400">100%</span>
            </div>
          </div>
        </div>

        {/* Calendário */}
        <div className="w-full lg:flex-1 overflow-x-auto">
          <div className="min-w-[250px] lg:max-w-full lg:h-[350px] flex flex-col rounded-xl border border-gray-100 dark:border-gray-700 p-2 sm:p-3 mx-auto">
            <div className="grid grid-cols-7 lg:grid-rows-7 gap-1 sm:gap-2 flex-1">
              {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'].map(day => (
                <div key={day} className="h-8 sm:h-10 lg:h-auto flex items-center justify-center font-semibold text-gray-500 dark:text-gray-400 text-[11px] sm:text-xs">
                  {day}
                </div>
              ))}

              {days.map((dateStr, index) => {
                const percentage = dateStr ? getCompletionPercentage(dateStr) : 0
                const color = dateStr ? getDayColor(dateStr, percentage) : 'bg-transparent'
                const displayDay = dateStr ? parseInt(dateStr.split('-')[2], 10) : ''
                const isToday = dateStr === todayStr

                return (
                  <div
                    key={index}
                    onMouseEnter={() => dateStr && setShowTooltip(dateStr)}
                    onMouseLeave={() => setShowTooltip(null)}
                    className="relative lg:h-full"
                  >
                    <button
                      onClick={() => dateStr && setShowTooltip(showTooltip === dateStr ? null : dateStr)}
                      aria-label={dateStr ? `${displayDay} de ${monthName}, ${percentage}% completo` : 'Dia vazio'}
                      className={`w-full aspect-square lg:aspect-auto lg:h-full rounded-lg sm:rounded-xl flex items-center justify-center font-semibold text-xs sm:text-sm transition-all ${
                        color
                      } ${
                        isToday ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-white dark:ring-offset-gray-800' : ''
                      } ${
                        !dateStr ? 'pointer-events-none' : ''
                      }`}
                      disabled={!dateStr}
                    >
                      <span className={dateStr ? '' : 'invisible'}>{displayDay}</span>
                    </button>

                    {showTooltip === dateStr && history[dateStr] && percentage > 0 && (
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-gray-900 dark:bg-gray-700 text-white text-xs py-2 px-3 rounded whitespace-nowrap z-10 shadow-lg">
                        {percentage}% completo
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900 dark:border-t-gray-700" />
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
          {isLoading && (
            <p className="text-sm text-center text-gray-500 dark:text-gray-400 mt-3">Carregando histórico...</p>
          )}
        </div>
        
      </div>
    </div>
  )
}

export default HistoryCalendar