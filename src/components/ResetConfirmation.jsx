import React, { useState } from 'react'
import { AlertTriangle } from 'lucide-react'

function ResetConfirmation({ onConfirm, onCancel }) {
  const [step, setStep] = useState(1)

  const handleFirstConfirm = () => {
    setStep(2)
  }

  const handleFinalConfirm = () => {
    onConfirm(true)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl max-w-sm w-full p-6 animate-slideDown">
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
            <AlertTriangle size={24} className="text-red-600 dark:text-red-400" />
          </div>
        </div>

        {/* Step 1 */}
        {step === 1 && (
          <>
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 text-center mb-3">
              Resetar progresso de hoje?
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-center text-sm mb-6">
              Todos os checkboxes marcados hoje serão limpos. Esta ação não pode ser desfeita.
            </p>
            <div className="flex gap-3">
              <button
                onClick={onCancel}
                className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-smooth font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={handleFirstConfirm}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-smooth font-medium"
              >
                Continuar
              </button>
            </div>
          </>
        )}

        {/* Step 2 - Dupla Confirmação */}
        {step === 2 && (
          <>
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 text-center mb-3">
              Tem certeza?
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-center text-sm mb-6">
              Esta é sua última chance de confirmar. Clique em "Resetar" para confirmar permanentemente.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-smooth font-medium"
              >
                Voltar
              </button>
              <button
                onClick={handleFinalConfirm}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-smooth font-medium"
              >
                Resetar
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default ResetConfirmation
