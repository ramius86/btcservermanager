import { useState, useEffect } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { Loader2, CheckCircle2, QrCode, RefreshCcw, AlertCircle, ShieldCheck } from 'lucide-react'
import { SteamCmdService } from '../../services/api'
import { Button } from '../ui/Button'
import { useToast } from '../ui/Toast'

interface QRState {
  clientID: string
  challengeURL: string
  requestID: string
  interval: number
}

export function SteamQRAuthView() {
  const { showToast } = useToast()
  const [qrState, setQrState] = useState<QRState | null>(null)
  const [loading, setLoading] = useState(false)
  const [polling, setPolling] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [authStatus, setAuthStatus] = useState<any>(null)
  const [expiresIn, setExpiresIn] = useState(60)

  const fetchStatus = async () => {
    try {
      const status = await SteamCmdService.getAuthStatus()
      setAuthStatus(status)
    } catch (err) {
      console.error('Failed to fetch auth status:', err)
    }
  }

  useEffect(() => {
    fetchStatus()
  }, [])

  const startSession = async () => {
    setLoading(true)
    setError(null)
    setSuccess(false)
    setExpiresIn(60)
    try {
      const resp = await SteamCmdService.beginQr()
      setQrState({
        clientID: resp.client_id,
        challengeURL: resp.challenge_url,
        requestID: resp.request_id,
        interval: resp.interval || 5
      })
      setPolling(true)
    } catch (err: any) {
      setError(err?.message || 'Failed to initiate QR session')
      showToast('Error starting QR session', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let timer: any
    let countdown: any

    if (polling && qrState) {
      // Polling interval
      timer = setInterval(async () => {
        try {
          const resp = await SteamCmdService.pollQr(qrState.clientID, qrState.requestID)
          if (resp.refresh_token) {
            setPolling(false)
            setSuccess(true)
            showToast('Authenticated successfully via QR!', 'success')
            fetchStatus()
          } else if (resp.error && resp.error !== 'pending') {
            setPolling(false)
            setError(resp.error)
          }
        } catch (err) {
          console.error('Polling error:', err)
        }
      }, qrState.interval * 1000)

      // Expiration countdown
      countdown = setInterval(() => {
        setExpiresIn(prev => {
          if (prev <= 1) {
            setPolling(false)
            setError('Session expired')
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }

    return () => {
      clearInterval(timer)
      clearInterval(countdown)
    }
  }, [polling, qrState])

  if (authStatus?.hasToken) {
    return (
      <div className="flex flex-col items-center justify-center p-8 space-y-4 text-center bg-success/5 border border-success/20 rounded-xl">
        <div className="w-16 h-16 bg-success/10 flex items-center justify-center rounded-full">
          <ShieldCheck className="w-8 h-8 text-success" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-foreground">Authenticated via QR</h3>
          <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold mt-1">
            Account: {authStatus.accountName || authStatus.username}
          </p>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={startSession}
          className="mt-4 border-border text-[10px] font-bold uppercase tracking-widest"
        >
          <RefreshCcw className="w-3.5 h-3.5 mr-2" />
          Re-authenticate
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center space-y-6 py-4">
      {!qrState && !loading && !success && (
        <div className="text-center space-y-4 max-w-sm">
          <div className="w-16 h-16 bg-primary/10 flex items-center justify-center rounded-full mx-auto border border-primary/20">
            <QrCode className="w-8 h-8 text-primary" />
          </div>
          <p className="text-sm text-muted-foreground">
            Scan the QR code with your Steam Mobile app to log in instantly without entering your password.
          </p>
          <Button onClick={startSession} className="w-full shadow-lg shadow-primary/20 text-[10px] font-bold uppercase tracking-widest">
            Generate QR Code
          </Button>
        </div>
      )}

      {loading && (
        <div className="flex flex-col items-center space-y-4 py-8">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Contacting Steam...</p>
        </div>
      )}

      {qrState && polling && (
        <div className="flex flex-col items-center space-y-6">
          <div className="p-4 bg-white rounded-2xl shadow-2xl shadow-black/5 border-8 border-surface">
            <QRCodeSVG value={qrState.challengeURL} size={200} />
          </div>
          <div className="flex flex-col items-center gap-4 px-6 py-3 bg-surface border border-border rounded-xl shadow-sm">
            <div className="flex items-center gap-3">
              <div className="relative w-8 h-8 flex items-center justify-center">
                <svg className="absolute inset-0 w-full h-full -rotate-90">
                  <circle
                    cx="16"
                    cy="16"
                    r="14"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    className="text-primary/10"
                  />
                  <circle
                    cx="16"
                    cy="16"
                    r="14"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeDasharray={88}
                    strokeDashoffset={88 - (88 * expiresIn) / 60}
                    className="text-primary transition-all duration-1000"
                  />
                </svg>
                <span className="text-[10px] font-bold text-primary">{expiresIn}</span>
              </div>
              <div className="space-y-0.5">
                <p className="text-[10px] font-bold uppercase tracking-widest text-foreground">Waiting for Scan</p>
                <p className="text-[9px] text-muted-foreground font-medium">Authorizing via Steam App</p>
              </div>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setPolling(false)} className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-destructive">
            Cancel Session
          </Button>
        </div>
      )}

      {success && (
        <div className="flex flex-col items-center space-y-4 text-center py-8">
          <CheckCircle2 className="w-16 h-16 text-success animate-in zoom-in duration-300" />
          <div>
            <h3 className="text-lg font-bold">Login Successful!</h3>
            <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold mt-1">Your Steam account is now linked.</p>
          </div>
        </div>
      )}

      {error && (
        <div className="flex flex-col items-center space-y-4 text-center py-4 text-destructive">
          <AlertCircle className="w-12 h-12" />
          <div className="space-y-1">
            <p className="text-sm font-bold">Authentication Failed</p>
            <p className="text-[10px] uppercase tracking-widest font-bold opacity-70">{error}</p>
          </div>
          <Button variant="outline" size="sm" onClick={startSession} className="mt-2 border-destructive/20 text-[10px] font-bold uppercase tracking-widest">
            Try Again
          </Button>
        </div>
      )}
    </div>
  )
}
