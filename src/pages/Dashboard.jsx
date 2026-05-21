import React from 'react'
import DailyOffensive from '../components/DailyOffensive'
import DailyRoutine from '../components/DailyRoutine'
import PlatformLinks from '../components/PlatformLinks'
import HistoryCalendar from '../components/HistoryCalendar'
import QuestionStats from '../components/QuestionStats'
import FlashcardStats from '../components/FlashcardStats' // NOVO IMPORTE

function Dashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-950 dark:to-gray-900 py-8 transition-smooth">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ... Hero, Ofensiva, Rotina, Plataformas ... */}
        
        <div className="mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-2">
            🚀 Bem-vindo ao seu Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Acompanhe seu progresso diário rumo ao C1 em 12 meses
          </p>
        </div>

        <section className="mb-12">
          <DailyOffensive />
        </section>

        <section className="mb-12">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6">⏰ Rotina Diária (3h)</h2>
            <DailyRoutine />
          </div>
        </section>

        <section className="mb-12">
          <PlatformLinks />
        </section>

        {/* ESTATÍSTICAS UNIFICADAS: Questões e Flashcards */}
        <section>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            <QuestionStats />
            <FlashcardStats />
          </div>
        </section>

        {/* HISTÓRICO */}
        <section>
          <HistoryCalendar />
        </section>
      </div>
    </div>
  )
}

export default Dashboard