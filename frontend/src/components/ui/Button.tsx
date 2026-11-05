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
      primary: 'bg-primary text-primary-foreground border-2 border-foreground shadow-[4px_4px_0_0_var(--color-foreground)] hover:translate-x-px hover:translate-y-px hover:shadow-[3px_3px_0_0_var(--color-foreground)] active:translate-x-1 active:translate-y-1 active:shadow-none',
      secondary: 'bg-surface-elevated text-foreground border-2 border-foreground shadow-[4px_4px_0_0_var(--color-foreground)] hover:bg-accent hover:translate-x-px hover:translate-y-px hover:shadow-[3px_3px_0_0_var(--color-foreground)] active:translate-x-1 active:translate-y-1 active:shadow-none',
      outline: 'border-2 border-foreground bg-transparent text-foreground hover:bg-primary hover:text-primary-foreground',
      ghost: 'border-2 border-transparent bg-transparent text-foreground hover:border-foreground hover:bg-primary/10',
      danger: 'bg-destructive text-white border-2 border-foreground shadow-[4px_4px_0_0_var(--color-foreground)] hover:translate-x-px hover:translate-y-px hover:shadow-[3px_3px_0_0_var(--color-foreground)] active:translate-x-1 active:translate-y-1 active:shadow-none',
    }

    const sizes = {
      sm: 'h-8 px-3 text-[10px]',
      md: 'h-10 px-4 py-2 text-[11px]',
      lg: 'h-12 px-8 text-xs',
      icon: 'h-9 w-9',
    }

    return (
      <Comp
        type={type}
        className={cn(
          "inline-flex items-center justify-center rounded-none font-black uppercase tracking-[0.09em] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-40",
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
