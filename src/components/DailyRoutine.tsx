import { useEffect, useState } from 'react'
import { Trash2 } from 'lucide-react'
import ResetConfirmation from '@/components/ResetConfirmation'
import progressService from '@/lib/services/progressService'
import { useAuth } from '@/context/AuthContext'
import { getTrackData } from '@/data/roadmapData'
import type { Task, TrackId } from '@/types'

interface DailyRoutineProps {
  trackId: TrackId
}

function DailyRoutine({ trackId }: DailyRoutineProps) {
  const { user } = useAuth()
  const [tasks, setTasks] = useState<Task[]>([])
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [showResetConfirm, setShowResetConfirm] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!user) return

    const load = async () => {
      setIsLoading(true)
      const today = await progressService.getTodayProgress(user.id, trackId)
      const track = getTrackData(trackId)
      const statuses = [today.listening, today.speaking, today.vocabulary, today.grammar]
      setTasks(track.dailyTasks.map((task, index) => ({ ...task, completed: statuses[index] ?? false })))
      setLastUpdated(new Date(today.updated_at))
      setIsLoading(false)
    }

    void load()
  }, [trackId, user])

  const handleTaskToggle = async (index: number): Promise<void> => {
    if (!user) return

    const next = [...tasks]
    next[index] = { ...next[index], completed: !next[index].completed }
    setTasks(next)

    await progressService.updateDaily(user.id, index, next[index].completed, trackId)
    setLastUpdated(new Date())
  }

  const handleReset = async (confirmed: boolean): Promise<void> => {
    if (!user) return
    if (confirmed) {
      await progressService.resetDaily(user.id, trackId)
      setTasks((prev) => prev.map((task) => ({ ...task, completed: false })))
      setLastUpdated(new Date())
    }
    setShowResetConfirm(false)
  }

  const formatTime = (date: Date | null): string => {
    if (!date) return '--:--'
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    return `${hours}:${minutes} ${day}/${month}`
  }

  const completedCount = tasks.filter((task) => task.completed).length
  const totalCount = tasks.length
  const completionPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-40 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
        ))}
      </div>
    )
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {tasks.map((task, index) => (
          <div
            key={task.id}
            className={`p-4 rounded-lg border-2 transition-smooth ${
              task.completed
                ? 'bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900 dark:to-emerald-900 border-green-300 dark:border-green-600'
                : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600'
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">{task.title}</h3>
              <input type="checkbox" checked={task.completed} onChange={() => void handleTaskToggle(index)} className="w-5 h-5 cursor-pointer" />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{task.duration}</p>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div className={`h-full transition-all ${task.completed ? 'bg-green-500 w-full' : 'bg-blue-500 w-0'}`} />
              </div>
              <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 min-w-fit">{task.completed ? '✓' : '○'}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Progresso do Dia</h3>
          <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">{completionPercentage}%</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex-1 h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300" style={{ width: `${completionPercentage}%` }} />
          </div>
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400 min-w-fit">
            {completedCount}/{totalCount}
          </span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          <p>
            Última atualização: <span className="font-semibold">{formatTime(lastUpdated)}</span>
          </p>
        </div>
        <button
          onClick={() => setShowResetConfirm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-800 transition-smooth font-medium"
        >
          <Trash2 size={18} />
          Resetar Dia
        </button>
      </div>

      {showResetConfirm && <ResetConfirmation onConfirm={(value) => void handleReset(value)} onCancel={() => setShowResetConfirm(false)} />}
    </div>
  )
}

export default DailyRoutine
