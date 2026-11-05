interface ProgressProps {
  value: number
  className?: string
}

export function Progress({ value, className = "" }: Readonly<ProgressProps>) {
  return (
    <div className={`h-2.5 w-full rounded-none border border-border bg-background overflow-hidden ${className}`}>
      <div
        className="h-full crt-bar transition-all duration-300 ease-out"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  )
}
