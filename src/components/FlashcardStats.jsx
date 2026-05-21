import React, { useState, useEffect } from 'react'
import { Layers, CheckCircle2, Clock } from 'lucide-react'
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid, Cell
} from 'recharts'
import dataService from '../services/dataService'
import { flashcardsData } from '../data/flashcardsData'

const THEME_COLORS = [
  '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#14B8A6', '#F43F5E'
]

const CustomBarLabel = ({ x, y, width, height, value }) => {
  if (!value || value === 0) return null;
  return (
    <text x={x + width / 2} y={y + height / 2} fill="#ffffff" textAnchor="middle" dominantBaseline="central" fontSize={12} fontWeight="bold">
      {value}
    </text>
  );
};

function FlashcardStats() {
  const [stats, setStats] = useState({ total: 0, mastered: 0, review: 0, byLevel: {}, byTheme: {} })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    const statusData = await dataService.getFlashcardsStatus()
    let total = 0, mastered = 0, review = 0
    const byLevel = {}, byTheme = {}

    flashcardsData.forEach(card => {
      const cardStatus = statusData[card.id]
      if (cardStatus) {
        total++
        if (cardStatus.status === 'mastered') mastered++
        else if (cardStatus.status === 'review') review++

        if (!byLevel[card.level]) byLevel[card.level] = { mastered: 0, review: 0 }
        if (cardStatus.status === 'mastered') byLevel[card.level].mastered++
        else if (cardStatus.status === 'review') byLevel[card.level].review++

        if (!byTheme[card.theme]) byTheme[card.theme] = 0
        byTheme[card.theme]++
      }
    })
    setStats({ total, mastered, review, byLevel, byTheme })
    setIsLoading(false)
  }

  const masteryRate = stats.total > 0 ? Math.round((stats.mastered / stats.total) * 100) : 0
  
  const levelData = Object.keys(stats.byLevel).map(key => ({
    name: key,
    Dominados: stats.byLevel[key].mastered,
    Revisar: stats.byLevel[key].review,
  })).sort((a, b) => a.name.localeCompare(b.name))

  const themeBarData = Object.keys(stats.byTheme).map(key => ({
    name: key,
    value: stats.byTheme[key]
  }))

  if (isLoading) return <div className="h-32 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse" />

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm mb-12 transition-smooth">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4 sm:gap-0">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2">
          <Layers size={28} className="text-blue-600 dark:text-blue-400" />
          Flashcards
        </h2>
        <span className="text-xl font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-4 py-2 rounded-lg self-end sm:self-auto">
          {masteryRate}% Dominados
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-100 dark:border-gray-600">
          <div className="text-gray-500 dark:text-gray-400 text-sm font-semibold mb-1">Total Vistos</div>
          <div className="text-3xl font-bold text-gray-800 dark:text-gray-100">{stats.total}</div>
        </div>
        <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-800/50">
          <div className="flex items-center gap-2 text-green-700 dark:text-green-400 text-sm font-semibold mb-1"><CheckCircle2 size={16} /> Dominados</div>
          <div className="text-3xl font-bold text-green-700 dark:text-green-500">{stats.mastered}</div>
        </div>
        <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-100 dark:border-red-800/50">
          <div className="flex items-center gap-2 text-red-600 dark:text-red-400 text-sm font-semibold mb-1"><Clock size={16} /> Para Revisão</div>
          <div className="text-3xl font-bold text-red-600 dark:text-red-500">{stats.review}</div>
        </div>
      </div>

      {stats.total > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Gráfico 1: Barras Horizontais (Vistos por Tema) */}
          <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4 text-center">Vistos por Tema</h3>
            <div className="h-64 w-full"> 
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={themeBarData} layout="vertical" margin={{ top: 0, right: 40, left: 20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#52525b" opacity={0.1} />
                  <YAxis dataKey="name" type="category" tick={{fill: '#888888', fontSize: 12}} axisLine={false} tickLine={false} />
                  <XAxis type="number" hide={true} />
                  <Tooltip cursor={{fill: '#888888', opacity: 0.1}} contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#f3f4f6', borderRadius: '0.5rem' }} />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]} maxBarSize={30} label={{ position: 'right', fill: '#888888', fontSize: 12 }}>
                    {themeBarData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={THEME_COLORS[index % THEME_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Gráfico 2: Barras (Dominados/Revisar por Nível) */}
          <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2 text-center">Status por Nível</h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={levelData} margin={{ top: 20, right: 0, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#52525b" opacity={0.1} />
                  <XAxis dataKey="name" tick={{fill: '#888888'}} axisLine={false} tickLine={false} />
                  <YAxis hide={true} />
                  <Tooltip cursor={{fill: '#888888', opacity: 0.1}} contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#f3f4f6', borderRadius: '0.5rem' }} />
                  <Legend verticalAlign="bottom" align="center" wrapperStyle={{ color: '#888888', fontSize: '14px', paddingTop: '10px' }} />
                  <Bar dataKey="Dominados" stackId="a" fill="#22c55e" radius={[0, 0, 4, 4]} maxBarSize={50} label={<CustomBarLabel />} />
                  <Bar dataKey="Revisar" stackId="a" fill="#ef4444" radius={[4, 4, 0, 0]} maxBarSize={50} label={<CustomBarLabel />} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default FlashcardStats