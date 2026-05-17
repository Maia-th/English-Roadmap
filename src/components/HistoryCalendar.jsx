import React, { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react'
import dataService from '../services/dataService'

function HistoryCalendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [history, setHistory] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [showTooltip, setShowTooltip] = useState(null)

  useEffect(() => {
    loadHistory()
  }, [currentMonth])

  const loadHistory = async () => {
    setIsLoading(true)
    const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1)
    const lastDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0)
    
    const filtered = await dataService.getHistoryFiltered(firstDay, lastDay)
    setHistory(filtered)
    setIsLoading(false)
  }

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const getCompletionPercentage = (dateStr) => {
    if (!history[dateStr]) return 0
    const completed = history[dateStr].tasks.filter(t => t).length
    return Math.round((completed / history[dateStr].tasks.length) * 100)
  }

  const getDayColor = (dateStr, percentage) => {
    if (percentage === 0 && !history[dateStr]) {
      return 'bg-gray-50 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700'
    }
    if (percentage === 100) return 'bg-green-700 hover:bg-green-800 text-white'
    if (percentage >= 75) return 'bg-green-500 hover:bg-green-600 text-white'
    if (percentage >= 50) return 'bg-emerald-300 hover:bg-emerald-400 text-emerald-950'
    if (percentage >= 25) return 'bg-amber-300 hover:bg-amber-400 text-amber-950'
    return 'bg-orange-300 hover:bg-orange-400 text-orange-950'
  }

  const days = []
  const daysInMonth = getDaysInMonth(currentMonth)
  const firstDay = getFirstDayOfMonth(currentMonth)

  // Dias vazios antes do primeiro dia do mês
  for (let i = 0; i < firstDay; i++) {
    days.push(null)
  }

  // Dias do mês
  for (let i = 1; i <= daysInMonth; i++) {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i)
    const dateStr = date.toISOString().split('T')[0]
    days.push(dateStr)
  }

  const monthName = currentMonth.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
  const completedDaysInMonth = Object.entries(history).filter(([date, day]) => {
    const dayDate = new Date(date + 'T00:00:00')
    return (
      dayDate.getMonth() === currentMonth.getMonth()
      && dayDate.getFullYear() === currentMonth.getFullYear()
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

      {/* Legenda */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 mb-6 text-xs">
        <div className="flex items-center gap-2 p-2 rounded-lg bg-gray-50 dark:bg-gray-700/50">
          <div className="w-4 h-4 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded" />
          <span className="text-gray-600 dark:text-gray-400">0%</span>
        </div>
        <div className="flex items-center gap-2 p-2 rounded-lg bg-gray-50 dark:bg-gray-700/50">
          <div className="w-4 h-4 bg-orange-300 rounded" />
          <span className="text-gray-600 dark:text-gray-400">1-24%</span>
        </div>
        <div className="flex items-center gap-2 p-2 rounded-lg bg-gray-50 dark:bg-gray-700/50">
          <div className="w-4 h-4 bg-amber-300 rounded" />
          <span className="text-gray-600 dark:text-gray-400">25-49%</span>
        </div>
        <div className="flex items-center gap-2 p-2 rounded-lg bg-gray-50 dark:bg-gray-700/50">
          <div className="w-4 h-4 bg-emerald-300 rounded" />
          <span className="text-gray-600 dark:text-gray-400">50-74%</span>
        </div>
        <div className="flex items-center gap-2 p-2 rounded-lg bg-gray-50 dark:bg-gray-700/50">
          <div className="w-4 h-4 bg-green-500 rounded" />
          <span className="text-gray-600 dark:text-gray-400">75-99%</span>
        </div>
        <div className="flex items-center gap-2 p-2 rounded-lg bg-gray-50 dark:bg-gray-700/50">
          <div className="w-4 h-4 bg-green-700 rounded" />
          <span className="text-gray-600 dark:text-gray-400">100%</span>
        </div>
      </div>

      {/* Calendário */}
      <div className="overflow-x-auto">
        <div className="min-w-[320px] rounded-xl border border-gray-100 dark:border-gray-700 p-2 sm:p-3">
          <div className="grid grid-cols-7 gap-1 sm:gap-2">
            {/* Cabeçalho dos dias da semana */}
            {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'].map(day => (
              <div key={day} className="h-8 sm:h-10 flex items-center justify-center font-semibold text-gray-500 dark:text-gray-400 text-[11px] sm:text-xs">
                {day}
              </div>
            ))}

            {/* Dias */}
            {days.map((dateStr, index) => {
              const percentage = dateStr ? getCompletionPercentage(dateStr) : 0
              const color = dateStr ? getDayColor(dateStr, percentage) : 'bg-transparent'
              const displayDay = dateStr ? new Date(dateStr + 'T00:00:00').getDate() : ''
              const isToday = dateStr === new Date().toISOString().split('T')[0]

              return (
                <div
                  key={index}
                  onMouseEnter={() => dateStr && setShowTooltip(dateStr)}
                  onMouseLeave={() => setShowTooltip(null)}
                  className="relative"
                >
                  <button
                    onClick={() => dateStr && setShowTooltip(showTooltip === dateStr ? null : dateStr)}
                    aria-label={dateStr ? `${displayDay} ${monthName}, ${percentage}% completo` : 'Dia vazio'}
                    className={`w-full aspect-square rounded-lg sm:rounded-xl flex items-center justify-center font-semibold text-xs sm:text-sm transition-all ${
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

                  {/* Tooltip */}
                  {showTooltip === dateStr && history[dateStr] && (
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
      </div>
      {isLoading && (
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">Carregando histórico...</p>
      )}
    </div>
  )
}

export default HistoryCalendar
