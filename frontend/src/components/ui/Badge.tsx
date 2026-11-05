import * as React from "react"
import { cn } from "./Button"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'success' | 'danger' | 'warning'
}

function Badge({ className, variant = 'primary', ...props }: Readonly<BadgeProps>) {
  const variants = {
    primary: 'bg-primary/10 text-primary border-primary/40',
    secondary: 'bg-transparent text-muted-foreground border-border',
    outline: 'bg-transparent text-foreground border-foreground/30',
    success: 'bg-success/10 text-success border-success/40',
    danger: 'bg-destructive/10 text-destructive border-destructive/40',
    warning: 'bg-amber-500/10 text-amber-500 border-amber-500/40',
  }

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-none border px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em] transition-colors",
        variants[variant],
        className
      )}
      {...props}
    />
  )
}

export { Badge }
