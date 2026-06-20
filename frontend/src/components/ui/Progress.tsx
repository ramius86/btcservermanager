interface ProgressProps {
  value: number
  className?: string
}

export function Progress({ value, className = "" }: Readonly<ProgressProps>) {
  return (
    <div className={`h-2 w-full bg-gray-800 rounded-full overflow-hidden ${className}`}>
      <div 
        className="h-full bg-blue-500 transition-all duration-500 ease-out"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  )
}
