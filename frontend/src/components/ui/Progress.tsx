interface ProgressProps {
  value: number
  className?: string
}

export function Progress({ value, className = "" }: Readonly<ProgressProps>) {
  return (
    <div className={`h-1.5 w-full rounded-full bg-muted overflow-hidden ${className}`}>
      <div
        className="h-full rounded-full bg-gradient-to-r from-primary via-primary/80 to-[#29d3e6] transition-all duration-500 ease-out"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  )
}
