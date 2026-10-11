import { Component, ErrorInfo, ReactNode } from 'react'
import { AlertTriangle, RotateCcw } from 'lucide-react'

interface Props {
  children: ReactNode
  fallback?: ReactNode | ((error: Error, reset: () => void) => ReactNode)
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  public override state: State = {
    hasError: false,
    error: null,
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[ErrorBoundary] Uncaught component error:', error, errorInfo)
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null })
  }

  public override render() {
    if (this.state.hasError) {
      if (typeof this.props.fallback === 'function') {
        return this.props.fallback(this.state.error ?? new Error('Unknown error'), this.handleReset)
      }
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="flex items-center justify-center min-h-[400px] p-6">
          <div className="w-full max-w-lg p-6 bg-surface-elevated/80 border border-destructive/30 rounded-2xl shadow-2xl backdrop-blur-md flex flex-col gap-4 text-center items-center">
            <div className="w-12 h-12 rounded-full bg-destructive/10 text-destructive flex items-center justify-center shrink-0">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="flex flex-col gap-1">
              <h3 className="text-lg font-bold text-foreground">Si è verificato un errore inaspettato</h3>
              <p className="text-sm text-muted-foreground">
                Il componente ha riscontrato un'eccezione durante il rendering.
              </p>
            </div>
            {this.state.error && (
              <div className="w-full p-3 bg-background/50 border border-border/50 rounded-lg text-left overflow-auto max-h-36">
                <code className="text-xs font-mono text-destructive/90 break-words whitespace-pre-wrap">
                  {this.state.error.message || String(this.state.error)}
                </code>
              </div>
            )}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={this.handleReset}
                className="flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-surface border border-border hover:bg-surface-elevated transition-colors text-foreground cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Riprova
              </button>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors cursor-pointer"
              >
                Ricarica Pagina
              </button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
