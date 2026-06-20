import { useState, createContext, useContext, useCallback, useMemo } from 'react'
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react'

type ToastType = 'success' | 'error' | 'info'

interface Toast {
  id: string
  message: string
  type: ToastType
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = crypto.randomUUID()
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => removeToast(id), 5000)
  }, [removeToast])

  const contextValue = useMemo(() => ({ showToast }), [showToast])

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) throw new Error('useToast must be used within ToastProvider')
  return context
}

function ToastItem({ toast, onClose }: Readonly<{ toast: Toast; onClose: () => void }>) {
  let toastClass = 'bg-surface-elevated border-border text-foreground'
  if (toast.type === 'success') toastClass = 'bg-emerald-500/10 border-emerald-500/50 text-emerald-600 dark:text-emerald-400'
  else if (toast.type === 'error') toastClass = 'bg-red-500/10 border-red-500/50 text-red-600 dark:text-red-400'

  return (
    <div className={`flex items-center gap-3 p-4 rounded-xl border shadow-2xl animate-in slide-in-from-right fade-in duration-300 ${toastClass}`}>
      {toast.type === 'success' && <CheckCircle className="w-5 h-5" />}
      {toast.type === 'error' && <AlertCircle className="w-5 h-5" />}
      {toast.type === 'info' && <Info className="w-5 h-5" />}
      
      <p className="text-sm font-medium">{toast.message}</p>
      
      <button type="button" aria-label="Close" onClick={onClose} className="ml-2 p-1 hover:bg-white/10 rounded-lg">
        <X className="w-4 h-4" aria-hidden="true" />
      </button>
    </div>
  )
}
