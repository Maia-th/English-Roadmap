import React, { useState, useEffect } from 'react'
import { Sun, Moon, BookOpen, BarChart3 } from 'lucide-react'
import Dashboard from './pages/Dashboard'
import Roadmap from './pages/Roadmap'
import './App.css'

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard')
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' ||
        (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)
    }
    return false
  })

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

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-smooth">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 dark:bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                🇺🇸
              </div>
              <h1 className="text-2xl font-bold gradient-text hidden sm:block">
                English Roadmap
              </h1>
            </div>

            {/* Navigation */}
            <nav className="flex items-center gap-6">
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

              {/* Theme Toggle */}
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

      {/* Main Content */}
      <main className="min-h-screen">
        {currentPage === 'dashboard' && <Dashboard />}
        {currentPage === 'roadmap' && <Roadmap />}
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              © 2026 English Roadmap. Alcançar C1 em 12 meses 🚀
            </p>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Made with ❤️ by Maia-th
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
