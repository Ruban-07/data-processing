import { useState } from 'react'
import { ProcessedDataSheet } from '@/components/ProcessedDataSheet'
import { initialResponse } from '@/data/mockData'
import { FileText, ArrowRight, CheckCircle2, ChevronRight } from 'lucide-react'

function App() {
  const [isSheetOpen, setIsSheetOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Decorative elements */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-500 via-indigo-500 to-purple-500 z-50"></div>
      <div className="absolute top-0 right-0 -z-10 opacity-20 pointer-events-none">
        <div className="w-[500px] h-[500px] bg-indigo-300 rounded-full blur-[120px]"></div>
      </div>
      <div className="absolute bottom-0 left-0 -z-10 opacity-20 pointer-events-none">
        <div className="w-[400px] h-[400px] bg-purple-300 rounded-full blur-[100px]"></div>
      </div>

      <nav className="flex items-center justify-between px-8 py-6 border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
            <FileText className="text-white" size={20} />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-800">Data<span className="text-indigo-600">Pilot</span></span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-500">
          <a href="#" className="hover:text-indigo-600 transition-colors">Dashboard</a>
          <a href="#" className="hover:text-indigo-600 transition-colors">Documents</a>
          <a href="#" className="hover:text-indigo-600 transition-colors">Settings</a>
        </div>
        <button className="px-5 py-2 bg-slate-900 text-white rounded-lg text-sm font-semibold hover:bg-slate-800 transition-all shadow-sm">
          Get Started
        </button>
      </nav>

      <main className="max-w-6xl mx-auto px-8 py-16 md:py-24">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-bold border border-indigo-100 mb-8 animate-in fade-in slide-in-from-bottom-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            NEW: AI POWERED EXTRACTION
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-8 leading-[1.1]">
            Automate your <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-600">Document Workflow</span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-500 mb-12 max-w-2xl leading-relaxed">
            Extract, validate, and process data from any document with 99% accuracy. 
            Harness the power of AI to transform unstructured data into actionable insights instantly.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <button 
              onClick={() => setIsSheetOpen(true)}
              className="w-full sm:w-auto px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 flex items-center justify-center gap-2 group"
            >
              Process Data
              <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
            </button>
            <button className="w-full sm:w-auto px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-2xl font-bold text-lg hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
              Learn More
            </button>
          </div>

          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 w-full max-w-4xl opacity-60">
            {['Invoices', 'Receipts', 'Contracts', 'ID Cards'].map((item) => (
              <div key={item} className="flex items-center gap-2 justify-center py-4 border border-slate-200 rounded-2xl bg-white shadow-sm">
                <CheckCircle2 className="text-indigo-500" size={16} />
                <span className="text-sm font-bold text-slate-700 italic">{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-32">
           <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative px-8 py-12 bg-white ring-1 ring-slate-900/5 rounded-3xl leading-none flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex flex-col gap-2">
                  <h3 className="text-2xl font-bold text-slate-900">Ready to see it in action?</h3>
                  <p className="text-slate-500">Test our processing engine with your sample data instantly.</p>
                </div>
                <button 
                  onClick={() => setIsSheetOpen(true)}
                  className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold flex items-center gap-2 hover:scale-105 transition-transform"
                >
                  Open Sandbox
                  <ChevronRight size={20} />
                </button>
              </div>
           </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-12">
        <div className="max-w-6xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 opacity-60 grayscale hover:grayscale-0 transition-all cursor-default">
            <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center">
              <FileText className="text-white" size={16} />
            </div>
            <span className="text-lg font-bold tracking-tight text-slate-800">DataPilot</span>
          </div>
          <p className="text-sm text-slate-400">© 2026 DataPilot Inc. All rights reserved.</p>
          <div className="flex gap-6 text-sm font-medium text-slate-400">
            <a href="#" className="hover:text-indigo-600 transition-colors">Privacy</a>
            <a href="#" className="hover:text-indigo-600 transition-colors">Terms</a>
            <a href="#" className="hover:text-indigo-600 transition-colors">API docs</a>
          </div>
        </div>
      </footer>

      <ProcessedDataSheet 
        isOpen={isSheetOpen} 
        onOpenChange={setIsSheetOpen} 
        data={initialResponse} 
      />
    </div>
  )
}

export default App
