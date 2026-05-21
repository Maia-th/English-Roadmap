import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'

function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault()
    setError('')

    if (!email || !password) {
      setError('Preencha email e senha.')
      return
    }

    try {
      setIsLoading(true)
      await login(email, password)
      navigate('/dashboard', { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha no login.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">Entrar</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Email"
          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent"
        />
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Senha"
          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent"
        />

        {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full px-4 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-60"
        >
          {isLoading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>

      <div className="mt-4 flex flex-col gap-2 text-sm">
        <Link to="/auth/forgot-password" className="text-blue-600 dark:text-blue-400 hover:underline">
          Esqueceu a senha?
        </Link>
        <Link to="/auth/signup" className="text-blue-600 dark:text-blue-400 hover:underline">
          Cadastre-se
        </Link>
      </div>
    </div>
  )
}

export default Login
