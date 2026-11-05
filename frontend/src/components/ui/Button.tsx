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
      primary: 'bg-primary/15 text-primary border border-primary/70 hover:bg-primary hover:text-primary-foreground shadow-[0_0_18px_-10px_var(--color-primary)]',
      secondary: 'bg-transparent text-foreground border border-border hover:border-primary/60 hover:text-primary',
      outline: 'bg-transparent text-muted-foreground border border-dashed border-border hover:border-primary/60 hover:text-primary',
      ghost: 'bg-transparent text-muted-foreground border border-transparent hover:bg-primary/10 hover:text-primary',
      danger: 'bg-destructive/15 text-destructive border border-destructive/60 hover:bg-destructive hover:text-white',
    }

    const sizes = {
      sm: 'h-8 px-3 text-[10px]',
      md: 'h-10 px-4 text-[11px]',
      lg: 'h-11 px-8 text-xs',
      icon: 'h-9 w-9',
    }

    return (
      <Comp
        type={type}
        className={cn(
          "inline-flex items-center justify-center rounded-none font-mono uppercase tracking-[0.14em] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-40",
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
