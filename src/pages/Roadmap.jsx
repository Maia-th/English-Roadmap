import React, { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { roadmapData } from '../data/roadmapData'

function Roadmap() {
  const [expandedPhase, setExpandedPhase] = useState(null)

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white dark:from-gray-950 dark:to-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            📊 Roadmap - C1 em 12 Meses
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
            Estrutura completa com 5 fases progressivas para alcançar o nível C1 de inglês
          </p>
        </div>

        {/* Timeline das Fases */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-8">🎯 Planejamento de 12 Meses</h2>

          <div className="relative space-y-6">
            <div className="hidden md:block absolute left-7 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-300 via-purple-300 to-orange-300 dark:from-blue-700 dark:via-purple-700 dark:to-orange-700" />
            {roadmapData.phases.map((phase, index) => (
              <div key={phase.id} className="relative">
                <div className="hidden md:flex absolute left-4 top-7 w-6 h-6 rounded-full bg-white dark:bg-gray-900 border-4 border-blue-400 dark:border-blue-600 items-center justify-center z-10">
                  <span className="text-[10px] font-bold text-blue-600 dark:text-blue-300">{index + 1}</span>
                </div>
                <button
                  onClick={() => setExpandedPhase(expandedPhase === phase.id ? null : phase.id)}
                  className="w-full group md:pl-16"
                >
                  <div className="bg-white dark:bg-gray-800 p-5 sm:p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-md hover:shadow-lg transition-smooth cursor-pointer">
                    <div className="flex items-start justify-between gap-4">
                      <div className="text-left flex-1">
                        <div className="flex flex-wrap items-center gap-3 mb-3">
                          <span className={`text-2xl p-2 rounded-xl bg-gradient-to-r ${phase.color} text-white shadow-md`}>{phase.icon}</span>
                          <div>
                            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">Fase {phase.id} — {phase.title}</h3>
                            <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">Meses {phase.months}</p>
                          </div>
                        </div>
                        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">{phase.description}</p>
                      </div>
                      {expandedPhase === phase.id ? (
                        <ChevronUp size={24} className="text-gray-500 dark:text-gray-300 mt-1" />
                      ) : (
                        <ChevronDown size={24} className="text-gray-500 dark:text-gray-300 mt-1" />
                      )}
                    </div>
                  </div>
                </button>

                {/* Detalhes Expandidos */}
                {expandedPhase === phase.id && (
                  <div className="mt-4 p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 animate-slideDown md:ml-16">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {/* Foco */}
                      <div>
                        <h4 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-4">📍 Foco Principal</h4>
                        <ul className="space-y-2">
                          {phase.focus.map((item, i) => (
                            <li key={i} className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                              <span className="text-blue-500 font-bold mt-1">→</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Objetivos */}
                      <div>
                        <h4 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-4">🎯 Objetivos</h4>
                        <ul className="space-y-2">
                          {phase.goals.map((goal, i) => (
                            <li key={i} className="text-gray-700 dark:text-gray-300">
                              {goal}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Estratégia */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-8">🧭 Estratégia</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {roadmapData.strategies.map((strategy, index) => (
              <div key={index} className="p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-smooth">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">{strategy.icon}</span>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">{strategy.title}</h3>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">{strategy.description}</p>
                <ul className="space-y-2">
                  {strategy.tips.map((tip, tipIndex) => (
                    <li key={tipIndex} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                      <span className="text-blue-500 font-bold">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Milestones de Speaking */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-8">🗣️ Milestones de Speaking</h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {roadmapData.speakingMilestones.map((milestone, index) => (
              <div key={index} className="p-4 bg-white dark:bg-gray-800 border-2 border-blue-400 dark:border-blue-600 rounded-lg text-center">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-2">Mês {milestone.month}</div>
                <p className="text-gray-700 dark:text-gray-300 font-medium">{milestone.goal}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Indicadores de Nível */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-8">📈 Indicadores de Nível</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {roadmapData.levelIndicators.map((level, index) => (
              <div key={index} className="p-6 bg-white dark:bg-gray-800 rounded-lg border-2 border-purple-400 dark:border-purple-600 hover:shadow-lg transition-shadow">
                <h3 className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-4">{level.level}</h3>
                <ul className="space-y-2">
                  {level.characteristics.map((char, i) => (
                    <li key={i} className="flex items-start gap-2 text-gray-700 dark:text-gray-300 text-sm">
                      <span className="text-purple-500 font-bold">✓</span>
                      <span>{char}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Erros e Aceleradores */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {/* Erros */}
          <div className="bg-red-50 dark:bg-red-900/20 p-8 rounded-lg border-2 border-red-200 dark:border-red-800">
            <h2 className="text-2xl font-bold text-red-700 dark:text-red-400 mb-6">⚠️ Erros que MAIS Atrasam</h2>
            <ul className="space-y-3">
              {roadmapData.mistakes.map((mistake, index) => (
                <li key={index} className="text-gray-700 dark:text-gray-300 font-medium">
                  {mistake}
                </li>
              ))}
            </ul>
          </div>

          {/* Aceleradores */}
          <div className="bg-green-50 dark:bg-green-900/20 p-8 rounded-lg border-2 border-green-200 dark:border-green-800">
            <h2 className="text-2xl font-bold text-green-700 dark:text-green-400 mb-6">✅ O que MAIS Acelera</h2>
            <ul className="space-y-3">
              {roadmapData.accelerators.map((accelerator, index) => (
                <li key={index} className="text-gray-700 dark:text-gray-300 font-medium">
                  {accelerator}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Plataformas */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-8">🌐 Plataformas Recomendadas</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Beginner */}
            <div>
              <h3 className="text-xl font-bold text-blue-600 dark:text-blue-400 mb-4">Beginner / Intermediate</h3>
              <ul className="space-y-3">
                {roadmapData.platforms.beginner.map((platform, i) => (
                  <li key={i}>
                    <a
                      href={platform.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline font-medium"
                    >
                      → {platform.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Technical */}
            <div>
              <h3 className="text-xl font-bold text-purple-600 dark:text-purple-400 mb-4">Conteúdo Técnico</h3>
              <ul className="space-y-3">
                {roadmapData.platforms.technical.map((platform, i) => (
                  <li key={i}>
                    <a
                      href={platform.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-purple-600 dark:text-purple-400 hover:underline font-medium"
                    >
                      → {platform.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Advanced */}
            <div>
              <h3 className="text-xl font-bold text-green-600 dark:text-green-400 mb-4">Conteúdo Avançado (C1)</h3>
              <ul className="space-y-3">
                {roadmapData.platforms.advanced.map((platform, i) => (
                  <li key={i}>
                    <a
                      href={platform.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-green-600 dark:text-green-400 hover:underline font-medium"
                    >
                      → {platform.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Mensagem Final */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-8 rounded-lg text-center">
          <h2 className="text-3xl font-bold mb-4">📌 Regra Final</h2>
          <p className="text-lg mb-2">
            <strong>Não tente "estudar inglês".</strong>
          </p>
          <p className="text-lg opacity-95">
            Tente viver parcialmente em inglês todos os dias.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Roadmap
