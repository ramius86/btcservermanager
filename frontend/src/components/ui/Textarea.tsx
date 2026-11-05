import * as React from "react"
import { cn } from "./Button"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[96px] w-full rounded-none border-2 border-foreground bg-background px-3 py-2 text-sm font-medium ring-offset-background placeholder:font-mono placeholder:text-[11px] placeholder:uppercase placeholder:tracking-[0.08em] placeholder:text-muted-foreground/70 focus-visible:outline-none focus-visible:bg-primary/5 focus-visible:shadow-[4px_4px_0_0_var(--color-foreground)] disabled:cursor-not-allowed disabled:opacity-40 transition-all",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
