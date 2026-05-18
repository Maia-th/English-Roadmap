import React, { useState, useEffect } from 'react'
import { Trash2, AlertTriangle } from 'lucide-react'
import dataService from '../services/dataService'
import ResetConfirmation from './ResetConfirmation'

function DailyRoutine() {
  const [tasks, setTasks] = useState([])
  const [lastUpdated, setLastUpdated] = useState(null)
  const [showResetConfirm, setShowResetConfirm] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadProgress()
    // REMOVIDO: O setInterval() que rodava a cada segundo foi removido.
    // Ele deixava a aplicação pesada e não era necessário, pois o estado 
    // já é atualizado localmente nas funções de clique (toggle e reset).
  }, [])

  const loadProgress = async () => {
    const progress = await dataService.getTodayProgress()
    const data = await dataService.getAllData()
    setTasks(data.dailyTasks.map((task, index) => ({
      ...task,
      completed: progress.tasks[index] || false,
    })))
    
    // Garantindo que a data seja lida corretamente e não quebre se for null
    setLastUpdated(progress.lastUpdated ? new Date(progress.lastUpdated) : null)
    setIsLoading(false)
  }

  const handleTaskToggle = async (index) => {
    const newTasks = [...tasks]
    newTasks[index].completed = !newTasks[index].completed
    setTasks(newTasks)
    
    // Atualiza no service e já seta a hora atual no front-end imediatamente
    await dataService.updateDailyProgress(index, newTasks[index].completed)
    setLastUpdated(new Date())
  }

  const handleReset = async (confirmed) => {
    if (confirmed) {
      await dataService.resetDailyProgress(true)
      setTasks(tasks.map(t => ({ ...t, completed: false })))
      setLastUpdated(new Date())
    }
    setShowResetConfirm(false)
  }

  const formatTime = (date) => {
    if (!date) return '--:--'
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    return `${hours}:${minutes} ${day}/${month}`
  }

  const completedCount = tasks.filter(t => t.completed).length
  const totalCount = tasks.length
  
  // Proteção: Previne o erro "NaN" caso totalCount seja 0
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
      {/* Cards da Rotina */}
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
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                {task.title}
              </h3>
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => handleTaskToggle(index)}
                className="w-5 h-5 cursor-pointer"
              />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{task.duration}</p>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all ${
                    task.completed ? 'bg-green-500 w-full' : 'bg-blue-500 w-0'
                  }`}
                />
              </div>
              <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 min-w-fit">
                {task.completed ? '✓' : '○'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Barra de Progresso Geral */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Progresso do Dia
          </h3>
          <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {completionPercentage}%
          </span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex-1 h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400 min-w-fit">
            {completedCount}/{totalCount}
          </span>
        </div>
      </div>

      {/* Info e Reset */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          <p>Última atualização: <span className="font-semibold">{formatTime(lastUpdated)}</span></p>
        </div>
        <button
          onClick={() => setShowResetConfirm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-800 transition-smooth font-medium"
        >
          <Trash2 size={18} />
          Resetar Dia
        </button>
      </div>

      {/* Modal de Confirmação */}
      {showResetConfirm && (
        <ResetConfirmation
          onConfirm={() => handleReset(true)}
          onCancel={() => setShowResetConfirm(false)}
        />
      )}
    </div>
  )
}

export default DailyRoutine