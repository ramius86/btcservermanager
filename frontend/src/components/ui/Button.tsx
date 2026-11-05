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
      primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
      secondary: 'bg-transparent text-foreground border border-border hover:border-foreground',
      outline: 'bg-transparent text-foreground border border-foreground/30 hover:border-foreground',
      ghost: 'bg-transparent text-muted-foreground hover:text-foreground underline-offset-4 hover:underline',
      danger: 'bg-destructive text-white hover:bg-destructive/90',
    }

    const sizes = {
      sm: 'h-8 px-3 text-[10px]',
      md: 'h-10 px-5 text-[11px]',
      lg: 'h-12 px-8 text-xs',
      icon: 'h-9 w-9',
    }

    return (
      <Comp
        type={type}
        className={cn(
          "inline-flex items-center justify-center rounded-none font-mono font-medium uppercase tracking-[0.16em] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-40",
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
