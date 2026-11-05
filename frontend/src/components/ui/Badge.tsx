import * as React from "react"
import { cn } from "./Button"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'success' | 'danger' | 'warning'
}

function Badge({ className, variant = 'primary', ...props }: Readonly<BadgeProps>) {
  const variants = {
    primary: 'bg-transparent text-primary border-primary/40',
    secondary: 'bg-transparent text-muted-foreground border-border',
    outline: 'bg-transparent text-foreground border-foreground/40',
    success: 'bg-transparent text-success border-success/40',
    danger: 'bg-transparent text-destructive border-destructive/40',
    warning: 'bg-transparent text-amber-600 border-amber-600/40',
  }

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-none border px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-[0.16em] transition-colors",
        variants[variant],
        className
      )}
      {...props}
    />
  )
}

export { Badge }
