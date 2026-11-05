interface ProgressProps {
  value: number
  className?: string
}

export function Progress({ value, className = "" }: Readonly<ProgressProps>) {
  return (
    <div className={`h-[3px] w-full rounded-none bg-border overflow-hidden ${className}`}>
      <div
        className="h-full bg-primary transition-all duration-300 ease-out"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  )
}
