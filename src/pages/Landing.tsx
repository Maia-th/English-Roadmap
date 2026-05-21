import { Link } from 'react-router-dom'

function Landing() {
  return (
    <div className="min-h-[calc(100vh-180px)] bg-gradient-to-b from-indigo-50 to-white dark:from-gray-950 dark:to-gray-900 py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <section className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">English & Spanish Roadmap</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8">
            Plataforma 100% gratuita para evoluir em inglês e espanhol com rotina diária, roadmap completo e progresso persistido localmente.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/auth/signup" className="px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-smooth">
              Começar Grátis
            </Link>
            <Link to="/auth/login" className="px-6 py-3 rounded-lg border border-gray-300 dark:border-gray-600 font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 transition-smooth">
              Login
            </Link>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
            <h2 className="text-2xl font-bold mb-2">🇺🇸 English</h2>
            <p className="text-gray-600 dark:text-gray-300">Roadmap estruturado para atingir C1 em 12 meses com foco em listening, speaking e contexto profissional.</p>
          </div>
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
            <h2 className="text-2xl font-bold mb-2">🇪🇸 Spanish</h2>
            <p className="text-gray-600 dark:text-gray-300">Trilha dedicada com ferramentas específicas para desenvolver fluência natural e avançar até nível profissional.</p>
          </div>
        </section>
      </div>
    </div>
  )
}

export default Landing
