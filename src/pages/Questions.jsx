import React, { useState, useEffect, useMemo } from 'react'
import { Shuffle } from 'lucide-react'
import dataService from '../services/dataService'
import { questionsData } from '../data/questionsData'

function Questions() {
  const [activeQuestions, setActiveQuestions] = useState([])
  const [levelFilter, setLevelFilter] = useState('All')
  const [themeFilter, setThemeFilter] = useState('All')
  const [visibilityFilter, setVisibilityFilter] = useState('All') 
  const [shuffleSeed, setShuffleSeed] = useState(0)
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedOption, setSelectedOption] = useState(null)
  const [hasAnsweredCurrent, setHasAnsweredCurrent] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const isSeenRecently = (lastSeenISO) => {
    if (!lastSeenISO) return false
    const lastSeenDate = new Date(lastSeenISO)
    const threeDaysAgo = new Date()
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3)
    return lastSeenDate >= threeDaysAgo
  }

  const loadQuestions = async () => {
    setIsLoading(true)
    const history = await dataService.getAnsweredQuestions()
    
    let filtered = questionsData.filter(q => {
      if (levelFilter !== 'All' && q.level !== levelFilter) return false
      if (themeFilter !== 'All' && q.theme !== themeFilter) return false
      
      if (visibilityFilter === 'Unseen3Days') {
        const historyData = history[q.id]
        if (historyData && isSeenRecently(historyData.lastSeen)) return false
      } else if (visibilityFilter === 'UnseenEver') {
        if (history[q.id]) return false 
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

  useEffect(() => {
    loadQuestions()
  }, [levelFilter, themeFilter, visibilityFilter, shuffleSeed])

  const currentQuestion = activeQuestions[currentQuestionIndex]

  const handleOptionSelect = (index) => {
    if (hasAnsweredCurrent) return
    setSelectedOption(index)
  }

  const handleConfirmAnswer = async () => {
    if (selectedOption === null || hasAnsweredCurrent) return
    
    setHasAnsweredCurrent(true)
    const isCorrect = selectedOption === currentQuestion.correctOptionIndex
    
    await dataService.saveQuestionAnswer(currentQuestion.id, isCorrect, currentQuestion.level, currentQuestion.theme)
  }

  const nextQuestion = () => {
    setSelectedOption(null)
    setHasAnsweredCurrent(false)
    
    if (currentQuestionIndex < activeQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
    } else {
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

        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 mb-8 flex flex-col sm:flex-row sm:flex-wrap gap-4 justify-between">
          <div className="flex flex-wrap gap-4 items-end">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Nível</label>
              <select 
                className="border border-gray-300 dark:border-gray-600 rounded p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 outline-none" 
                value={levelFilter} onChange={e => setLevelFilter(e.target.value)}
              >
                {uniqueLevels.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Tema</label>
              <select 
                className="border border-gray-300 dark:border-gray-600 rounded p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 outline-none" 
                value={themeFilter} onChange={e => setThemeFilter(e.target.value)}
              >
                {uniqueThemes.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Exibição</label>
              <select 
                className="border border-gray-300 dark:border-gray-600 rounded p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 outline-none" 
                value={visibilityFilter} onChange={e => setVisibilityFilter(e.target.value)}
              >
                <option value="All">Todas</option>
                <option value="Unseen3Days">Não vistas nos últimos 3 dias</option>
                <option value="UnseenEver">Inéditas (Nunca vistas)</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleShuffle}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 font-semibold rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/60 transition-colors h-10 self-end"
          >
            <Shuffle size={18} />
            Embaralhar
          </button>
        </div>

        {isLoading ? (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">A carregar questões...</div>
        ) : activeQuestions.length === 0 ? (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">Nenhuma questão encontrada para estes filtros.</div>
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
                  if (idx === currentQuestion.correctOptionIndex) {
                    buttonStyle = "bg-green-50 dark:bg-green-900/20 border-green-500 text-green-700 dark:text-green-400 font-semibold"
                  } else if (idx === selectedOption) {
                    buttonStyle = "bg-[#FFE5E5] dark:bg-red-900/20 border-[#CC0000] dark:border-red-500 text-[#CC0000] dark:text-red-400 font-semibold"
                  } else {
                    buttonStyle = "bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-500 opacity-50"
                  }
                } else {
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

            {!hasAnsweredCurrent ? (
              <div className="mt-6 flex justify-end">
                <button
                  onClick={handleConfirmAnswer}
                  disabled={selectedOption === null}
                  className={`px-6 py-2 font-semibold rounded-lg transition-colors w-full sm:w-auto ${
                    selectedOption !== null 
                      ? 'bg-blue-600 text-white hover:bg-blue-700 dark:hover:bg-blue-500' 
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