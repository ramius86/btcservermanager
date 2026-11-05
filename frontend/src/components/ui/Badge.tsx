import * as React from "react"
import { cn } from "./Button"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'success' | 'danger' | 'warning'
}

function Badge({ className, variant = 'primary', ...props }: Readonly<BadgeProps>) {
  const variants = {
    primary: 'bg-primary/15 text-primary border-primary/30',
    secondary: 'bg-surface text-muted-foreground border-border',
    outline: 'bg-transparent text-foreground border-border',
    success: 'bg-success/15 text-success border-success/30',
    danger: 'bg-destructive/15 text-destructive border-destructive/30',
    warning: 'bg-amber-500/15 text-amber-500 border-amber-500/30',
  }

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.12em] backdrop-blur transition-colors",
        variants[variant],
        className
      )}
      {...props}
    />
  )
}

export { Badge }
