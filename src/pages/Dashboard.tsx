import DailyOffensive from '@/components/DailyOffensive'
import DailyRoutine from '@/components/DailyRoutine'
import PlatformLinks from '@/components/PlatformLinks'
import HistoryCalendar from '@/components/HistoryCalendar'
import { tracksData } from '@/data/roadmapData'
import type { TrackData, TrackId } from '@/types'

interface DashboardProps {
  trackId: TrackId
  trackData: TrackData
  onSelectTrack: (trackId: TrackId) => void
}

function Dashboard({ trackId, trackData, onSelectTrack }: DashboardProps) {
  return (
    <div className={`min-h-screen bg-gradient-to-b ${trackData.dashboardGradient} py-8`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-wrap gap-3">
          {Object.values(tracksData).map((track) => (
            <button
              key={track.id}
              onClick={() => onSelectTrack(track.id)}
              className={`px-4 py-2 rounded-lg font-semibold border transition-smooth ${
                trackId === track.id
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-700 hover:border-blue-400'
              }`}
            >
              {track.flag} {track.shortName}
            </button>
          ))}
        </div>

        <div className="mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-2">{trackData.dashboardTitle}</h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">{trackData.dashboardSubtitle}</p>
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
