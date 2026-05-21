import React, { useState, useEffect } from 'react'
import { Shuffle } from 'lucide-react'
import dataService from '../services/dataService'
import { questionsData } from '../data/questionsData'

function Questions() {
  const [activeQuestions, setActiveQuestions] = useState([])
  const [levelFilter, setLevelFilter] = useState('All')
  const [themeFilter, setThemeFilter] = useState('All')
  const [unseenOnly, setUnseenOnly] = useState(true)
  const [shuffleSeed, setShuffleSeed] = useState(0)
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedOption, setSelectedOption] = useState(null)
  const [hasAnsweredCurrent, setHasAnsweredCurrent] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Função para verificar se a questão foi vista há menos de 3 dias
  const isSeenRecently = (lastSeenISO) => {
    if (!lastSeenISO) return false
    const lastSeenDate = new Date(lastSeenISO)
    const threeDaysAgo = new Date()
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3)
    return lastSeenDate >= threeDaysAgo
  }

  // Carrega as questões baseadas nos filtros atuais
  const loadQuestions = async () => {
    setIsLoading(true)
    const history = await dataService.getAnsweredQuestions()
    
    let filtered = questionsData.filter(q => {
      if (levelFilter !== 'All' && q.level !== levelFilter) return false
      if (themeFilter !== 'All' && q.theme !== themeFilter) return false
      if (unseenOnly) {
        const historyData = history[q.id]
        if (historyData && isSeenRecently(historyData.lastSeen)) {
          return false
        }
      }
      return true
    })

    if (shuffleSeed > 0) {
      filtered = [...filtered]
      for (let i = filtered.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [filtered[i], filtered[j]] = [filtered[j], filtered[i]];
      }
    }

    setActiveQuestions(filtered)
    setCurrentQuestionIndex(0)
    setSelectedOption(null)
    setHasAnsweredCurrent(false)
    setIsLoading(false)
  }

  // Recarrega a lista sempre que um filtro ou o embaralhar muda
  useEffect(() => {
    loadQuestions()
  }, [levelFilter, themeFilter, unseenOnly, shuffleSeed])

  const currentQuestion = activeQuestions[currentQuestionIndex]

  // Apenas seleciona a opção visualmente
  const handleOptionSelect = (index) => {
    if (hasAnsweredCurrent) return
    setSelectedOption(index)
  }

  // Confirma a resposta, exibe explicação e salva no local storage
  const handleConfirmAnswer = async () => {
    if (selectedOption === null || hasAnsweredCurrent) return
    
    setHasAnsweredCurrent(true)
    const isCorrect = selectedOption === currentQuestion.correctOptionIndex
    await dataService.saveQuestionAnswer(currentQuestion.id, isCorrect)
  }

  // Avança para a próxima
  const nextQuestion = () => {
    setSelectedOption(null)
    setHasAnsweredCurrent(false)
    
    if (currentQuestionIndex < activeQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
    } else {
      // Se chegou ao fim, recarrega a lista para remover as que acabaram de ser respondidas
      loadQuestions()
    }
  }

  const handleShuffle = () => {
    setShuffleSeed(prev => prev + 1)
  }

  const uniqueLevels = ['All', ...new Set(questionsData.map(q => q.level))]
  const uniqueThemes = ['All', ...new Set(questionsData.map(q => q.theme))]

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 py-8 transition-smooth">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Treinamento de Questões</h1>

        {/* Filtros e Botão de Embaralhar */}
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 mb-8 flex flex-col sm:flex-row sm:flex-wrap gap-4 sm:items-end justify-between">
          <div className="flex flex-wrap gap-4 items-end">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Nível</label>
              <select 
                className="border border-gray-300 dark:border-gray-600 rounded p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 outline-none" 
                value={levelFilter} 
                onChange={e => setLevelFilter(e.target.value)}
              >
                {uniqueLevels.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Tema</label>
              <select 
                className="border border-gray-300 dark:border-gray-600 rounded p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 outline-none" 
                value={themeFilter} 
                onChange={e => setThemeFilter(e.target.value)}
              >
                {uniqueThemes.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="flex items-center gap-2 mb-2 sm:ml-4">
              <input 
                type="checkbox" 
                id="unseen" 
                checked={unseenOnly} 
                onChange={e => setUnseenOnly(e.target.checked)} 
                className="w-4 h-4 cursor-pointer" 
              />
              <label htmlFor="unseen" className="text-sm font-semibold text-gray-700 dark:text-gray-300 cursor-pointer">
                Ocultar vistas (3 dias)
              </label>
            </div>
          </div>

          <button
            onClick={handleShuffle}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 font-semibold rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/60 transition-colors w-full sm:w-auto"
          >
            <Shuffle size={18} />
            Embaralhar
          </button>
        </div>

        {/* Área da Questão */}
        {isLoading ? (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            A carregar questões...
          </div>
        ) : activeQuestions.length === 0 ? (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            Nenhuma questão encontrada para estes filtros. Tente mudar os parâmetros!
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="flex gap-2 mb-4">
              <span className="bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 text-xs font-bold px-2 py-1 rounded">{currentQuestion.level}</span>
              <span className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 text-xs font-bold px-2 py-1 rounded">{currentQuestion.theme}</span>
            </div>
            
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-6">{currentQuestion.text}</h2>

            <div className="space-y-3 mb-6">
              {currentQuestion.options.map((opt, idx) => {
                let buttonStyle = "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                
                if (hasAnsweredCurrent) {
                  // Estado após confirmar a resposta
                  if (idx === currentQuestion.correctOptionIndex) {
                    buttonStyle = "bg-green-50 dark:bg-green-900/20 border-green-500 text-green-700 dark:text-green-400 font-semibold"
                  } else if (idx === selectedOption) {
                    buttonStyle = "bg-[#FFE5E5] dark:bg-red-900/20 border-[#CC0000] dark:border-red-500 text-[#CC0000] dark:text-red-400 font-semibold"
                  } else {
                    buttonStyle = "bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-500 opacity-50"
                  }
                } else {
                  // Estado antes de confirmar (apenas selecionando)
                  if (idx === selectedOption) {
                    buttonStyle = "bg-blue-50 dark:bg-blue-900/20 border-blue-500 text-blue-700 dark:text-blue-400 font-semibold ring-2 ring-blue-500/50"
                  }
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleOptionSelect(idx)}
                    disabled={hasAnsweredCurrent}
                    className={`w-full text-left p-4 rounded-lg border transition-all ${buttonStyle}`}
                  >
                    {opt}
                  </button>
                )
              })}
            </div>

            {/* Controles: Confirmar ou Próxima */}
            {!hasAnsweredCurrent ? (
              <div className="mt-6 flex justify-end">
                <button
                  onClick={handleConfirmAnswer}
                  disabled={selectedOption === null}
                  className={`px-6 py-2 font-semibold rounded-lg transition-colors w-full sm:w-auto ${
                    selectedOption !== null 
                      ? 'bg-blue-600 text-white hover:bg-blue-700' 
                      : 'bg-gray-200 text-gray-400 dark:bg-gray-700 dark:text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Confirmar Resposta
                </button>
              </div>
            ) : (
              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800 animate-fadeIn">
                <p className="text-sm text-blue-800 dark:text-blue-300"><strong>Explicação:</strong> {currentQuestion.explanation}</p>
                <div className="mt-4 flex justify-end">
                  <button 
                    onClick={nextQuestion}
                    className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors w-full sm:w-auto"
                  >
                    Próxima Questão
                  </button>
                </div>
              </div>
            )}
            
            <div className="mt-4 text-right text-sm text-gray-400 dark:text-gray-500">
              Questão {currentQuestionIndex + 1} de {activeQuestions.length}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Questions