import { useEffect, useState } from 'react'
import { BrowserRouter, Link, Navigate, Route, Routes } from 'react-router-dom'
import { Sun, Moon, BookOpen, BarChart3, Settings as SettingsIcon, LogOut } from 'lucide-react'
import Dashboard from '@/pages/Dashboard'
import Roadmap from '@/pages/Roadmap'
import Welcome from '@/pages/Welcome'
import Landing from '@/pages/Landing'
import Login from '@/pages/Auth/Login'
import Signup from '@/pages/Auth/Signup'
import ForgotPassword from '@/pages/Auth/ForgotPassword'
import Settings from '@/pages/Account/Settings'
import ProtectedRoute from '@/components/ProtectedRoute'
import { AuthProvider, useAuth } from '@/context/AuthContext'
import { defaultTrackId, getTrackData, tracksData } from '@/data/roadmapData'
import type { TrackId } from '@/types'
import './App.css'

const TRACK_STORAGE_KEY = 'selected_roadmap_track'

function AppContent() {
  const { user, logout } = useAuth()
  const [selectedTrackId, setSelectedTrackId] = useState<TrackId>(() => {
    if (typeof window === 'undefined') return defaultTrackId
    const stored = localStorage.getItem(TRACK_STORAGE_KEY)
    return stored === 'spanish' ? 'spanish' : 'english'
  })
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return (
        localStorage.getItem('theme') === 'dark' ||
        (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)
      )
    }
    return false
  })

  const selectedTrackData = getTrackData(selectedTrackId)

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
    localStorage.setItem(TRACK_STORAGE_KEY, selectedTrackId)
  }, [selectedTrackId])

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-smooth">
      <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 dark:bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                {user ? selectedTrackData.flag : '🌍'}
              </div>
              <h1 className="text-2xl font-bold gradient-text hidden sm:block">{user ? selectedTrackData.name : 'Language Roadmaps'}</h1>
            </div>

            <nav className="flex items-center gap-2 sm:gap-4">
              {user && (
                <>
                  <Link to="/dashboard" className="flex items-center gap-2 px-3 py-2 rounded-lg font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800">
                    <BarChart3 size={18} /> <span className="hidden sm:inline">Dashboard</span>
                  </Link>
                  <Link to="/roadmap" className="flex items-center gap-2 px-3 py-2 rounded-lg font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800">
                    <BookOpen size={18} /> <span className="hidden sm:inline">Roadmap</span>
                  </Link>
                  <Link to="/account/settings" className="flex items-center gap-2 px-3 py-2 rounded-lg font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800">
                    <SettingsIcon size={18} /> <span className="hidden sm:inline">Settings</span>
                  </Link>
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={user ? <Navigate to="/dashboard" replace /> : <Landing />} />
            <Route path="/auth/login" element={user ? <Navigate to="/dashboard" replace /> : <Login />} />
            <Route path="/auth/signup" element={user ? <Navigate to="/dashboard" replace /> : <Signup />} />
            <Route path="/auth/forgot-password" element={user ? <Navigate to="/dashboard" replace /> : <ForgotPassword />} />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <div className="space-y-8">
                    <Welcome tracks={Object.values(tracksData)} onSelectTrack={setSelectedTrackId} />
                    <Dashboard trackId={selectedTrackId} trackData={selectedTrackData} onSelectTrack={setSelectedTrackId} />
                  </div>
                </ProtectedRoute>
              }
            />
            <Route
              path="/roadmap"
              element={
                <ProtectedRoute>
                  <Roadmap trackData={selectedTrackData} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/account/settings"
              element={
                <ProtectedRoute>
                  <Settings trackId={selectedTrackId} />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </main>

      <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-gray-600 dark:text-gray-400 text-sm">© 2026 Language Roadmaps</p>
            {user ? (
              <button
                onClick={logout}
                className="text-gray-600 dark:text-gray-400 text-sm flex items-center gap-2 hover:text-red-600 dark:hover:text-red-400"
              >
                <LogOut size={16} /> Logout
              </button>
            ) : (
              <p className="text-gray-600 dark:text-gray-400 text-sm">Developed by Maia-th</p>
            )}
          </div>
        </div>
      </footer>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
