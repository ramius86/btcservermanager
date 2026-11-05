import * as React from "react"
import { cn } from "./Button"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'success' | 'danger' | 'warning'
}

function Badge({ className, variant = 'primary', ...props }: Readonly<BadgeProps>) {
  const variants = {
    primary: 'bg-primary/12 text-primary border-primary/25',
    secondary: 'bg-accent text-muted-foreground border-border',
    outline: 'bg-transparent text-foreground border-border',
    success: 'bg-success/15 text-success border-success/25',
    danger: 'bg-destructive/12 text-destructive border-destructive/25',
    warning: 'bg-amber-500/15 text-amber-600 border-amber-500/25',
  }

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-0.5 text-[11px] font-extrabold tracking-tight transition-colors",
        variants[variant],
        className
      )}
      {...props}
    />
  )
}

export { Badge }
