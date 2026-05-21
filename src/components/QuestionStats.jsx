import React, { useState, useEffect } from 'react'
import { Target, CheckCircle2, AlertCircle } from 'lucide-react'
import dataService from '../services/dataService'

function QuestionStats() {
  const [stats, setStats] = useState({ total: 0, correct: 0, wrong: 0 })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    const data = await dataService.getQuestionStats()
    setStats(data)
    setIsLoading(false)
  }

  const accuracy = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0

  if (isLoading) return <div className="h-32 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse" />

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2">
          <Target size={28} className="text-blue-600 dark:text-blue-400" />
          Desempenho em Questões
        </h2>
        <span className="text-xl font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-4 py-2 rounded-lg">
          {accuracy}% de Acerto
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-100 dark:border-gray-600">
          <div className="text-gray-500 dark:text-gray-400 text-sm font-semibold mb-1">Total Resolvidas</div>
          <div className="text-3xl font-bold text-gray-800 dark:text-gray-100">{stats.total}</div>
        </div>
        
        <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-800">
          <div className="flex items-center gap-2 text-green-700 dark:text-green-400 text-sm font-semibold mb-1">
            <CheckCircle2 size={16} /> Acertos
          </div>
          <div className="text-3xl font-bold text-green-700 dark:text-green-500">{stats.correct}</div>
        </div>

        <div className="p-4 bg-[#FFE5E5] dark:bg-red-900/20 rounded-lg border border-[#FF9999] dark:border-red-800">
          <div className="flex items-center gap-2 text-[#CC0000] dark:text-red-400 text-sm font-semibold mb-1">
            <AlertCircle size={16} /> Erros
          </div>
          <div className="text-3xl font-bold text-[#CC0000] dark:text-red-500">{stats.wrong}</div>
        </div>
      </div>
    </div>
  )
}

export default QuestionStats