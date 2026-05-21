import { useEffect, useState } from 'react'
import { Flame, TrendingUp, Target, Pencil, X } from 'lucide-react'
import progressService from '@/lib/services/progressService'
import { useAuth } from '@/context/AuthContext'
import type { TrackData, TrackId } from '@/types'

interface DailyOffensiveProps {
  trackId: TrackId
  trackData: TrackData
}

interface Stats {
  totalDays: number
  completedDays: number
  todayCompleted: number
  totalTasks: number
  streak: number
  longestStreak: number
  completionRate: number
  proficiencyLevel: string
}

function DailyOffensive({ trackId, trackData }: DailyOffensiveProps) {
  const { user } = useAuth()
  const [stats, setStats] = useState<Stats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showLevelModal, setShowLevelModal] = useState(false)

  const proficiencyLevels = ['A1', 'A2', 'B1', 'B2', 'C1']

  useEffect(() => {
    if (!user) return

    const loadStats = async (): Promise<void> => {
      setIsLoading(true)
      const statsData = await progressService.getStats(user.id, trackId)
      setStats(statsData)
      setIsLoading(false)
    }

    void loadStats()
    const interval = setInterval(() => {
      void loadStats()
    }, 5000)

    return () => clearInterval(interval)
  }, [trackId, user])

  if (isLoading || !stats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
        ))}
      </div>
    )
  }

  const progressPercentage = stats.totalTasks > 0 ? (stats.todayCompleted / stats.totalTasks) * 100 : 0

  const handleLevelUpdate = async (level: string): Promise<void> => {
    if (!user) return
    await progressService.updateProficiencyLevel(user.id, level, trackId)
    const statsData = await progressService.getStats(user.id, trackId)
    setStats(statsData)
    setShowLevelModal(false)
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="p-6 rounded-lg shadow-lg bg-gradient-to-br from-orange-500 to-red-500 text-white">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Ofensiva</h3>
            <Flame size={28} />
          </div>
          <div className="text-4xl font-bold mb-2">{stats.streak}</div>
          <p className="text-sm text-white/90">dias seguidos</p>
          <p className="text-xs mt-2 text-white/80">Maior sequência: {stats.longestStreak}</p>
        </div>

        <div className={`bg-gradient-to-br ${trackData.todayCardGradient} p-6 rounded-lg text-white shadow-lg`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Hoje</h3>
            <TrendingUp size={28} />
          </div>
          <div className="text-4xl font-bold mb-2">
            {stats.todayCompleted}/{stats.totalTasks}
          </div>
          <p className="text-sm opacity-90">tarefas completas</p>
          <div className="mt-3 h-2 bg-white/30 rounded-full overflow-hidden">
            <div className="h-full bg-white transition-all" style={{ width: `${progressPercentage}%` }} />
          </div>
        </div>

        <div className="bg-gradient-to-br from-violet-500 to-purple-500 p-6 rounded-lg text-white shadow-lg transition-all duration-300">
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-lg font-semibold">Proficiência Atual</h3>
            <button
              onClick={() => setShowLevelModal(true)}
              className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-smooth"
              aria-label="Editar nível de proficiência"
            >
              <Pencil size={16} />
            </button>
          </div>
          <div className="flex items-center justify-between mb-3">
            <div className="text-4xl font-bold">{stats.proficiencyLevel}</div>
            <Target size={28} />
          </div>
          <a
            href={trackData.proficiencyTestUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Fazer teste de proficiência (abre em nova aba)"
            className="text-sm text-white/90 hover:text-white underline underline-offset-4"
          >
            Fazer teste de proficiência
          </a>
        </div>
      </div>

      {showLevelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-2xl">
            <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Editar proficiência</h3>
              <button
                onClick={() => setShowLevelModal(false)}
                className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                aria-label="Fechar modal"
              >
                <X size={18} />
              </button>
            </div>
            <div className="p-5">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Selecione seu nível atual:</p>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2" role="radiogroup" aria-label="Nível de proficiência">
                {proficiencyLevels.map((level) => (
                  <button
                    key={level}
                    onClick={() => void handleLevelUpdate(level)}
                    role="radio"
                    aria-checked={stats.proficiencyLevel === level}
                    className={`px-3 py-2 rounded-lg font-bold transition-smooth ${
                      stats.proficiencyLevel === level
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default DailyOffensive
