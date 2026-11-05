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
      primary: 'bg-primary text-primary-foreground shadow-[inset_0_-2px_0_color-mix(in_srgb,var(--color-foreground)_18%,transparent),0_10px_20px_-12px_color-mix(in_srgb,var(--color-primary)_80%,transparent)] hover:-translate-y-0.5 hover:shadow-[inset_0_-2px_0_color-mix(in_srgb,var(--color-foreground)_18%,transparent),0_14px_24px_-12px_color-mix(in_srgb,var(--color-primary)_85%,transparent)] active:translate-y-0 active:shadow-[inset_0_1px_2px_color-mix(in_srgb,var(--color-foreground)_20%,transparent)]',
      secondary: 'bg-surface text-foreground border border-border hover:bg-accent hover:border-border-active/40',
      outline: 'bg-transparent text-foreground border border-border-active/40 hover:border-border-active hover:text-primary',
      ghost: 'bg-transparent text-muted-foreground hover:bg-accent/70 hover:text-foreground',
      danger: 'bg-destructive text-white shadow-[0_10px_20px_-12px_color-mix(in_srgb,var(--color-destructive)_80%,transparent)] hover:-translate-y-0.5',
    }

    const sizes = {
      sm: 'h-8 px-3.5 text-xs',
      md: 'h-10 px-5 text-sm',
      lg: 'h-12 px-7 text-base',
      icon: 'h-9 w-9',
    }

    return (
      <Comp
        type={type}
        className={cn(
          "inline-flex items-center justify-center rounded-full font-extrabold tracking-tight transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-active focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-40",
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
