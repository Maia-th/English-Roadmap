import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import progressService from '@/lib/services/progressService'
import type { TrackId } from '@/types'

interface SettingsProps {
  trackId: TrackId
}

function Settings({ trackId }: SettingsProps) {
  const navigate = useNavigate()
  const { user, logout, updateProfileName } = useAuth()
  const [name, setName] = useState(user?.name ?? '')
  const [stats, setStats] = useState<{ totalDays: number; streak: number; completionRate: number } | null>(null)
  const [feedback, setFeedback] = useState('')

  useEffect(() => {
    if (!user) return
    const load = async (): Promise<void> => {
      const next = await progressService.getStats(user.id, trackId)
      setStats({ totalDays: next.totalDays, streak: next.streak, completionRate: next.completionRate })
    }
    void load()
  }, [trackId, user])

  const handleSave = async (): Promise<void> => {
    try {
      await updateProfileName(name)
      setFeedback('Nome atualizado com sucesso.')
    } catch (err) {
      setFeedback(err instanceof Error ? err.message : 'Falha ao salvar nome.')
    }
  }

  const handleLogout = (): void => {
    if (!window.confirm('Deseja realmente sair?')) return
    logout()
    navigate('/auth/login', { replace: true })
  }

  if (!user) return <div className="text-center py-16">Carregando...</div>

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <section className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
        <h1 className="text-2xl font-bold mb-4">Configurações da Conta</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-2">Email</label>
            <input value={user.email} disabled className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700" />
          </div>
          <div>
            <label className="block text-sm mb-2">Nome</label>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent"
            />
          </div>
        </div>
        <button onClick={() => void handleSave()} className="mt-4 px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700">
          Salvar
        </button>
        {feedback && <p className="mt-3 text-sm text-green-600 dark:text-green-400">{feedback}</p>}
      </section>

      <section className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
        <h2 className="text-xl font-bold mb-4">Sessão</h2>
        <p className="text-sm text-gray-600 dark:text-gray-300">Conta criada em: {new Date(user.created_at).toLocaleString('pt-BR')}</p>
        <p className="text-sm text-gray-600 dark:text-gray-300">Último acesso: {user.last_login_at ? new Date(user.last_login_at).toLocaleString('pt-BR') : '—'}</p>
      </section>

      <section className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
        <h2 className="text-xl font-bold mb-4">Dados</h2>
        <p className="text-sm text-gray-600 dark:text-gray-300">Dias totais registrados: {stats?.totalDays ?? 0}</p>
        <p className="text-sm text-gray-600 dark:text-gray-300">Streak atual: {stats?.streak ?? 0}</p>
        <p className="text-sm text-gray-600 dark:text-gray-300">Taxa de conclusão: {stats?.completionRate ?? 0}%</p>
      </section>

      <section className="flex flex-wrap gap-3">
        <Link to="/dashboard" className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800">
          Voltar ao Dashboard
        </Link>
        <button onClick={handleLogout} className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700">
          Sair
        </button>
      </section>
    </div>
  )
}

export default Settings
