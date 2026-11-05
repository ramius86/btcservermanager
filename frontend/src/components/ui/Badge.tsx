import * as React from "react"
import { cn } from "./Button"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'success' | 'danger' | 'warning'
}

function Badge({ className, variant = 'primary', ...props }: Readonly<BadgeProps>) {
  const variants = {
    primary: 'bg-primary text-primary-foreground border-foreground',
    secondary: 'bg-surface text-muted-foreground border-foreground/40',
    outline: 'bg-transparent text-foreground border-foreground',
    success: 'bg-success text-background border-foreground',
    danger: 'bg-destructive text-white border-foreground',
    warning: 'bg-amber-400 text-black border-foreground',
  }

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-none border-2 px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-[0.14em] transition-colors",
        variants[variant],
        className
      )}
      {...props}
    />
  )
}

export { Badge }
