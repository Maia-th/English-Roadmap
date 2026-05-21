import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'

function ForgotPassword() {
  const { resetPassword } = useAuth()
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault()
    setError('')
    setMessage('')

    if (!email) {
      setError('Informe seu email.')
      return
    }

    try {
      setIsLoading(true)
      await resetPassword(email)
      setMessage('Email processado com sucesso. Confira o console para senha temporária (mock).')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha ao processar recuperação.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">Recuperar senha</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Email"
          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent"
        />

        {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
        {message && <p className="text-sm text-green-600 dark:text-green-400">{message}</p>}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full px-4 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-60"
        >
          {isLoading ? 'Enviando...' : 'Enviar'}
        </button>
      </form>

      <div className="mt-4 text-sm">
        <Link to="/auth/login" className="text-blue-600 dark:text-blue-400 hover:underline">
          Voltar para login
        </Link>
      </div>
    </div>
  )
}

export default ForgotPassword
