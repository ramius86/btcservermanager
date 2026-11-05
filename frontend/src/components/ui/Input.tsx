import * as React from "react"
import { cn } from "./Button"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-11 w-full rounded-none border-2 border-foreground bg-background px-3 py-2 text-sm font-medium ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-black file:uppercase file:tracking-widest placeholder:font-mono placeholder:text-[11px] placeholder:uppercase placeholder:tracking-[0.08em] placeholder:text-muted-foreground/70 focus-visible:outline-none focus-visible:bg-primary/5 focus-visible:shadow-[4px_4px_0_0_var(--color-foreground)] disabled:cursor-not-allowed disabled:opacity-40 transition-all",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
