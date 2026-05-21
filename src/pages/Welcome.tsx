import type { TrackData } from '@/types'

interface WelcomeProps {
  tracks: TrackData[]
  onSelectTrack: (trackId: TrackData['id']) => void
}

function Welcome({ tracks, onSelectTrack }: WelcomeProps) {
  return (
    <div className="bg-gradient-to-b from-indigo-50 to-white dark:from-gray-950 dark:to-gray-900 py-8 rounded-2xl border border-gray-100 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">🌍 Escolha sua Trilha de Idioma</h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg max-w-3xl mx-auto">
            Selecione a trilha disponível para acompanhar seu progresso diário e seguir o roadmap completo até o C1.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tracks.map((track) => (
            <div key={track.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-smooth">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <p className="text-4xl mb-2">{track.flag}</p>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{track.name}</h2>
                </div>
                <span className="text-xs px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-semibold">100% Gratuito</span>
              </div>

              <p className="text-gray-600 dark:text-gray-300 mb-6">{track.dashboardSubtitle}</p>

              <button
                onClick={() => onSelectTrack(track.id)}
                className="w-full px-4 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-smooth"
              >
                Entrar na trilha
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Welcome
