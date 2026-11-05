import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg' | 'icon'
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', asChild = false, type = 'button', ...props }, ref) => {
    const Comp = asChild ? Slot : "button"

    const variants = {
      primary: 'bg-gradient-to-b from-primary to-primary/80 text-primary-foreground ring-1 ring-white/25 shadow-[0_10px_30px_-12px_color-mix(in_srgb,var(--color-primary)_90%,transparent)] hover:brightness-110 hover:-translate-y-0.5',
      secondary: 'bg-surface/70 text-foreground border border-border backdrop-blur-xl hover:bg-accent',
      outline: 'bg-transparent text-foreground border border-border hover:border-primary/50 hover:bg-accent/50',
      ghost: 'bg-transparent text-muted-foreground hover:bg-accent/40 hover:text-foreground',
      danger: 'bg-destructive/90 text-white ring-1 ring-white/20 hover:bg-destructive hover:-translate-y-0.5',
    }

    const sizes = {
      sm: 'h-8 px-3.5 text-xs rounded-xl',
      md: 'h-10 px-5 text-sm rounded-2xl',
      lg: 'h-12 px-7 text-base rounded-2xl',
      icon: 'h-9 w-9 rounded-xl',
    }

    return (
      <Comp
        type={type}
        className={cn(
          "inline-flex items-center justify-center font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-40",
          variants[variant],
          sizes[size],
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
