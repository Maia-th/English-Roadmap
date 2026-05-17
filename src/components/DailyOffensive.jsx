import React, { useState, useEffect } from 'react'
import { Flame, TrendingUp, Target } from 'lucide-react'
import dataService from '../services/dataService'
import { roadmapData } from '../data/roadmapData'

function DailyOffensive() {
  const [stats, setStats] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadStats()
    // Atualizar stats a cada 5 segundos
    const interval = setInterval(loadStats, 5000)
    return () => clearInterval(interval)
  }, [])

  const loadStats = async () => {
    const stats = await dataService.getStats()
    setStats(stats)
    setIsLoading(false)
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
        ))}
      </div>
    )
  }

  const currentPhase = roadmapData.phases.find(p => p.id === stats.phase)

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      {/* Streak */}
      <div className="bg-gradient-to-br from-orange-500 to-red-500 p-6 rounded-lg text-white shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Ofensiva</h3>
          <Flame size={28} />
        </div>
        <div className="text-4xl font-bold mb-2">{stats.streak}</div>
        <p className="text-sm opacity-90">dias seguidos</p>
        <p className="text-xs opacity-75 mt-2">Mantenha a consistência! 🔥</p>
      </div>

      {/* Progresso Hoje */}
      <div className="bg-gradient-to-br from-blue-500 to-cyan-500 p-6 rounded-lg text-white shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Hoje</h3>
          <TrendingUp size={28} />
        </div>
        <div className="text-4xl font-bold mb-2">{stats.todayCompleted}/{stats.totalTasks}</div>
        <p className="text-sm opacity-90">tarefas completas</p>
        <div className="mt-3 h-2 bg-white/30 rounded-full overflow-hidden">
          <div
            className="h-full bg-white transition-all"
            style={{ width: `${(stats.todayCompleted / stats.totalTasks) * 100}%` }}
          />
        </div>
      </div>

      {/* Fase Atual */}
      <div className={`bg-gradient-to-br ${currentPhase.color} p-6 rounded-lg text-white shadow-lg`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Fase {stats.phase}</h3>
          <Target size={28} />
        </div>
        <div className="text-2xl font-bold mb-2">{currentPhase.title}</div>
        <p className="text-sm opacity-90">{currentPhase.months}</p>
        <p className="text-xs opacity-75 mt-2">{currentPhase.objective}</p>
      </div>
    </div>
  )
}

export default DailyOffensive
