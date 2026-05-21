import { ExternalLink } from 'lucide-react'
import type { TrackData } from '@/types'

interface PlatformLinksProps {
  trackData: TrackData
}

function PlatformLinks({ trackData }: PlatformLinksProps) {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 mb-8">
      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-6">🔗 Ferramentas Essenciais</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {trackData.tools.map((tool) => (
          <a
            key={`${trackData.id}-${tool.name}`}
            href={tool.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500 transition-all hover:shadow-lg"
          >
            <div className="flex items-start justify-between mb-3">
              <span className="text-3xl">{tool.icon}</span>
              <ExternalLink size={16} className="text-gray-400 group-hover:text-blue-500 transition-colors" />
            </div>
            <h3 className="font-semibold text-gray-800 dark:text-gray-200">{tool.name}</h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-2 truncate opacity-0 group-hover:opacity-100 transition-opacity">
              Ir para site →
            </p>
          </a>
        ))}
      </div>
    </div>
  )
}

export default PlatformLinks
