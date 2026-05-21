import { useEffect, useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react'
import progressService from '@/lib/services/progressService'
import { useAuth } from '@/context/AuthContext'
import type { HistoryEntry, TrackId } from '@/types'

interface HistoryCalendarProps {
  trackId: TrackId
}

const getLocalDateString = (date: Date): string => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function HistoryCalendar({ trackId }: HistoryCalendarProps) {
  const { user } = useAuth()
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [history, setHistory] = useState<Record<string, HistoryEntry>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [showTooltip, setShowTooltip] = useState<string | null>(null)

  useEffect(() => {
    if (!user) return

    const load = async (showLoading = true): Promise<void> => {
      if (showLoading) setIsLoading(true)
      const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1)
      const lastDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0)
      const filtered = await progressService.getHistoryMap(user.id, firstDay, lastDay, trackId)
      setHistory(filtered)
      setIsLoading(false)
    }

    void load()
    const interval = setInterval(() => void load(false), 5000)
    return () => clearInterval(interval)
  }, [currentMonth, trackId, user])

  const days = useMemo(() => {
    const output: Array<string | null> = []
    const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate()
    const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay()

    for (let i = 0; i < firstDay; i += 1) output.push(null)

    for (let i = 1; i <= daysInMonth; i += 1) {
      output.push(getLocalDateString(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i)))
    }

    return output
  }, [currentMonth])

  const monthName = currentMonth.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
  const todayStr = getLocalDateString(new Date())

  const getCompletionPercentage = (dateStr: string): number => history[dateStr]?.completion_percentage ?? 0

  const getDayColor = (percentage: number): string => {
    if (percentage === 0) return 'bg-gray-50 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700'
    if (percentage === 100) return 'bg-green-700 hover:bg-green-800 text-white'
    if (percentage >= 75) return 'bg-green-500 hover:bg-green-600 text-white'
    if (percentage >= 50) return 'bg-emerald-300 hover:bg-emerald-400 text-gray-900'
    if (percentage >= 25) return 'bg-amber-300 hover:bg-amber-400 text-gray-900'
    return 'bg-orange-300 hover:bg-orange-400 text-gray-900'
  }

  const completedDaysInMonth = Object.values(history).filter((day) => day.tasks.every(Boolean)).length

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
          <span className="text-sm font-semibold text-gray-600 dark:text-gray-400 min-w-fit capitalize px-3">{monthName}</span>
          <button
            onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-smooth border border-gray-200 dark:border-gray-600"
            aria-label="Próximo mês"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 sm:gap-2">
        {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'].map((day) => (
          <div key={day} className="h-8 flex items-center justify-center font-semibold text-gray-500 dark:text-gray-400 text-[11px] sm:text-xs">
            {day}
          </div>
        ))}

        {days.map((dateStr, index) => {
          const percentage = dateStr ? getCompletionPercentage(dateStr) : 0
          const displayDay = dateStr ? parseInt(dateStr.split('-')[2], 10) : ''
          const isToday = dateStr === todayStr

          return (
            <div key={index} onMouseEnter={() => dateStr && setShowTooltip(dateStr)} onMouseLeave={() => setShowTooltip(null)} className="relative">
              <button
                onClick={() => dateStr && setShowTooltip(showTooltip === dateStr ? null : dateStr)}
                aria-label={dateStr ? `${displayDay} de ${monthName}, ${percentage}% completo` : 'Dia vazio'}
                className={`w-full aspect-square rounded-lg flex items-center justify-center font-semibold text-xs sm:text-sm transition-all ${
                  dateStr ? getDayColor(percentage) : 'bg-transparent'
                } ${isToday ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-white dark:ring-offset-gray-800' : ''} ${!dateStr ? 'pointer-events-none' : ''}`}
                disabled={!dateStr}
              >
                <span className={dateStr ? '' : 'invisible'}>{displayDay}</span>
              </button>

              {showTooltip === dateStr && dateStr && history[dateStr] && percentage > 0 && (
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-gray-900 dark:bg-gray-700 text-white text-xs py-2 px-3 rounded whitespace-nowrap z-10 shadow-lg">
                  {percentage}% completo
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900 dark:border-t-gray-700" />
                </div>
              )}
            </div>
          )
        })}
      </div>

      {isLoading && <p className="text-sm text-center text-gray-500 dark:text-gray-400 mt-3">Carregando histórico...</p>}
    </div>
  )
}

export default HistoryCalendar
