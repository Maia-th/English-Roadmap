import React, { useState, useEffect, useMemo } from 'react'
import { Shuffle, CheckCircle, Clock, RotateCcw } from 'lucide-react'
import dataService from '../services/dataService'
import { flashcardsData } from '../data/flashcardsData'

function Flashcards() {
  const [statusData, setStatusData] = useState({})
  const [levelFilter, setLevelFilter] = useState('All')
  const [themeFilter, setThemeFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All') // 'All', 'Review', 'Mastered', 'New', 'Unseen3Days'
  
  const [shuffleSeed, setShuffleSeed] = useState(0)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadStatus()
  }, [])

  const loadStatus = async () => {
    setIsLoading(true)
    const data = await dataService.getFlashcardsStatus()
    setStatusData(data)
    setIsLoading(false)
  }

  // Função para verificar se foi visto há menos de 3 dias
  const isSeenRecently = (lastSeenISO) => {
    if (!lastSeenISO) return false
    const lastSeenDate = new Date(lastSeenISO)
    const threeDaysAgo = new Date()
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3)
    return lastSeenDate >= threeDaysAgo
  }

  const filteredCards = useMemo(() => {
    let filtered = flashcardsData.filter(card => {
      if (levelFilter !== 'All' && card.level !== levelFilter) return false
      if (themeFilter !== 'All' && card.theme !== themeFilter) return false
      
      if (statusFilter === 'Review') {
        if (statusData[card.id]?.status !== 'review') return false
      } else if (statusFilter === 'Mastered') {
         if (statusData[card.id]?.status !== 'mastered') return false
      } else if (statusFilter === 'New') {
         if (statusData[card.id]) return false
      } else if (statusFilter === 'Unseen3Days') {
         const cardData = statusData[card.id]
         if (cardData && isSeenRecently(cardData.lastReviewed)) return false
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
    return filtered
  }, [levelFilter, themeFilter, statusFilter, statusData, shuffleSeed])

  const currentCard = filteredCards[currentIndex]

  const handleAction = async (status) => {
    await dataService.saveFlashcardStatus(currentCard.id, status)
    await loadStatus() 
    nextCard()
  }

  const nextCard = () => {
    setIsFlipped(false)
    if (currentIndex < filteredCards.length - 1) {
      setCurrentIndex(prev => prev + 1)
    } else {
      setCurrentIndex(0)
    }
  }

  const handleShuffle = () => {
    setShuffleSeed(prev => prev + 1)
    setCurrentIndex(0)
    setIsFlipped(false)
  }

  const uniqueLevels = ['All', ...new Set(flashcardsData.map(c => c.level))]
  const uniqueThemes = ['All', ...new Set(flashcardsData.map(c => c.theme))]

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 py-8 transition-smooth">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Treinamento de Flashcards</h1>

        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 mb-8 flex flex-col sm:flex-row sm:flex-wrap gap-4 justify-between">
          <div className="flex flex-wrap gap-4 items-end">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Nível</label>
              <select className="border border-gray-300 dark:border-gray-600 rounded p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 outline-none" value={levelFilter} onChange={e => {setLevelFilter(e.target.value); setCurrentIndex(0); setIsFlipped(false)}}>
                {uniqueLevels.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Tema</label>
              <select className="border border-gray-300 dark:border-gray-600 rounded p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 outline-none" value={themeFilter} onChange={e => {setThemeFilter(e.target.value); setCurrentIndex(0); setIsFlipped(false)}}>
                {uniqueThemes.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Status</label>
              <select className="border border-gray-300 dark:border-gray-600 rounded p-2 bg-white dark:bg-gray-700 outline-none font-medium text-blue-700 dark:text-blue-400" value={statusFilter} onChange={e => {setStatusFilter(e.target.value); setCurrentIndex(0); setIsFlipped(false)}}>
                <option value="All">Todos</option>
                <option value="New">Novos (Nunca vistos)</option>
                <option value="Unseen3Days">Não vistos nos últimos 3 dias</option>
                <option value="Review">Revisão</option>
                <option value="Mastered">Dominados</option>
              </select>
            </div>
          </div>

          <button onClick={handleShuffle} className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 font-semibold rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/60 transition-colors h-10 self-end">
            <Shuffle size={18} /> Embaralhar
          </button>
        </div>

        {isLoading ? (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">A carregar flashcards...</div>
        ) : filteredCards.length === 0 ? (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">Nenhum flashcard encontrado para os filtros.</div>
        ) : (
          <div className="w-full max-w-2xl mx-auto perspective-1000">
            <div 
              className={`relative w-full h-80 transition-transform duration-500 transform-style-3d ${!isFlipped ? 'cursor-pointer' : ''} ${isFlipped ? 'rotate-y-180' : ''}`}
              onClick={() => !isFlipped && setIsFlipped(true)}
            >
              {/* Frente */}
              <div className="absolute w-full h-full backface-hidden bg-white dark:bg-gray-800 border-2 border-blue-100 dark:border-gray-700 rounded-2xl shadow-lg flex flex-col items-center justify-center p-8 text-center hover:border-blue-300 dark:hover:border-blue-500 transition-colors">
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 text-xs font-bold px-2 py-1 rounded">{currentCard.level}</span>
                  <span className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 text-xs font-bold px-2 py-1 rounded">{currentCard.theme}</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200">{currentCard.front}</h3>
                <p className="absolute bottom-6 text-sm text-gray-400 dark:text-gray-500 font-semibold animate-pulse">Clique na carta para virar</p>
              </div>

              {/* Verso */}
              <div className="absolute w-full h-full backface-hidden bg-blue-50 dark:bg-gray-800 border-2 border-blue-200 dark:border-gray-700 rounded-2xl shadow-lg flex flex-col p-6 rotate-y-180 cursor-default">
                {/* Ícone de voltar (desvirar a carta) */}
                <button 
                  onClick={(e) => { e.stopPropagation(); setIsFlipped(false); }}
                  className="absolute top-4 right-4 p-2 text-gray-400 hover:text-blue-600 dark:text-gray-500 dark:hover:text-blue-400 bg-white dark:bg-gray-700 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-full transition-colors shadow-sm"
                  title="Ver pergunta novamente"
                >
                  <RotateCcw size={20} />
                </button>

                <div className="flex-1 flex flex-col justify-center text-center pb-4 mt-6">
                  <p className="text-xl font-bold text-gray-800 dark:text-gray-200 whitespace-pre-line">{currentCard.back}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mt-auto">
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleAction('review'); }}
                    className="flex items-center justify-center gap-2 py-3 bg-[#FFE5E5] dark:bg-red-900/20 text-[#CC0000] dark:text-red-400 border border-[#FF9999] dark:border-red-800 rounded-lg font-bold hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
                  >
                    <Clock size={20} /> Revisar
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleAction('mastered'); }}
                    className="flex items-center justify-center gap-2 py-3 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-300 dark:border-green-800 rounded-lg font-bold hover:bg-green-200 dark:hover:bg-green-900/40 transition-colors"
                  >
                    <CheckCircle size={20} /> Dominado
                  </button>
                </div>
              </div>
            </div>
            <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400 font-medium">
              Cartão {currentIndex + 1} de {filteredCards.length}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Flashcards