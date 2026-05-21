import React, { useState, useEffect } from 'react'
import { Sun, Moon, BookOpen, BarChart3, Home } from 'lucide-react'
import Dashboard from './pages/Dashboard'
import Roadmap from './pages/Roadmap'
import Welcome from './pages/Welcome'
import { tracksData, getTrackData, defaultTrackId } from './data/roadmapData'
import './App.css'

const TRACK_STORAGE_KEY = 'selected_roadmap_track'

function App() {
  const [currentPage, setCurrentPage] = useState('welcome')
  const [selectedTrackId, setSelectedTrackId] = useState(() => {
    if (typeof window === 'undefined') return null
    return localStorage.getItem(TRACK_STORAGE_KEY)
  })
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark'
        || (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)
    }
    return false
  })

  const selectedTrackData = getTrackData(selectedTrackId || defaultTrackId)

  useEffect(() => {
    const html = document.documentElement
    if (isDark) {
      html.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      html.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }, [isDark])

  useEffect(() => {
    if (selectedTrackId) {
      localStorage.setItem(TRACK_STORAGE_KEY, selectedTrackId)
      setCurrentPage('dashboard')
      return
    }

    localStorage.removeItem(TRACK_STORAGE_KEY)
    setCurrentPage('welcome')
  }, [selectedTrackId])

  const handleSelectTrack = (trackId) => {
    setSelectedTrackId(trackId)
  }

  const showTrackNavigation = Boolean(selectedTrackId)

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-smooth">
      <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 dark:bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                {showTrackNavigation ? selectedTrackData.flag : '🌍'}
              </div>
              <h1 className="text-2xl font-bold gradient-text hidden sm:block">
                {showTrackNavigation ? selectedTrackData.name : 'Language Roadmaps'}
              </h1>
            </div>

            <nav className="flex items-center gap-3 sm:gap-6">
              {showTrackNavigation && (
                <>
                  <button
                    onClick={() => setCurrentPage('welcome')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-smooth ${
                      currentPage === 'welcome'
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    <Home size={20} />
                    <span className="hidden sm:inline">Trilhas</span>
                  </button>

                  <button
                    onClick={() => setCurrentPage('dashboard')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-smooth ${
                      currentPage === 'dashboard'
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    <BarChart3 size={20} />
                    <span className="hidden sm:inline">Dashboard</span>
                  </button>

                  <button
                    onClick={() => setCurrentPage('roadmap')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-smooth ${
                      currentPage === 'roadmap'
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    <BookOpen size={20} />
                    <span className="hidden sm:inline">Roadmap</span>
                  </button>
                </>
              )}

              <button
                onClick={() => setIsDark(!isDark)}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-smooth"
                aria-label="Toggle theme"
              >
                {isDark ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            </nav>
          </div>
        </div>
      </header>

      <main className="min-h-screen">
        {currentPage === 'welcome' && (
          <Welcome tracks={Object.values(tracksData)} onSelectTrack={handleSelectTrack} />
        )}
        {currentPage === 'dashboard' && selectedTrackId && (
          <Dashboard key={`dashboard-${selectedTrackId}`} trackId={selectedTrackId} trackData={selectedTrackData} />
        )}
        {currentPage === 'roadmap' && selectedTrackId && (
          <Roadmap key={`roadmap-${selectedTrackId}`} trackData={selectedTrackData} />
        )}
      </main>

      <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              © 2026 Language Roadmaps
            </p>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Developed by Maia-th
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
