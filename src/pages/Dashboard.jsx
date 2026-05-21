import React from 'react'
import DailyOffensive from '../components/DailyOffensive'
import DailyRoutine from '../components/DailyRoutine'
import PlatformLinks from '../components/PlatformLinks'
import HistoryCalendar from '../components/HistoryCalendar'

function Dashboard({ trackId, trackData }) {
  return (
    <div className={`min-h-screen bg-gradient-to-b ${trackData.dashboardGradient} py-8`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-2">
            {trackData.dashboardTitle}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            {trackData.dashboardSubtitle}
          </p>
        </div>

        <section className="mb-12">
          <DailyOffensive trackId={trackId} trackData={trackData} />
        </section>

        <section className="mb-12">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6">{trackData.dailyRoutineTitle}</h2>
            <DailyRoutine trackId={trackId} />
          </div>
        </section>

        <section className="mb-12">
          <PlatformLinks trackData={trackData} />
        </section>

        <section>
          <HistoryCalendar trackId={trackId} />
        </section>
      </div>
    </div>
  )
}

export default Dashboard
