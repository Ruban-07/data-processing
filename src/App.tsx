import { useState } from 'react'
import { ProcessedDataSheet } from '@/components/ProcessedDataSheet'
import { initialResponse } from '@/data/mockData'
import { Plus } from 'lucide-react'

function App() {
  const [isSheetOpen, setIsSheetOpen] = useState(false)

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50">
      <button 
        onClick={() => setIsSheetOpen(true)}
        className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold shadow-lg hover:bg-indigo-700 hover:scale-105 active:scale-95 transition-all duration-200"
      >
        <Plus size={20} />
        Open Data Sheet
      </button>

      <ProcessedDataSheet 
        isOpen={isSheetOpen} 
        onOpenChange={setIsSheetOpen} 
        data={initialResponse} 
      />
    </div>
  )
}

export default App
