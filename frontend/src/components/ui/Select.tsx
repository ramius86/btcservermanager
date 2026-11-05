import * as React from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "./Button"

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div className="relative w-full">
        <select
          className={cn(
            "flex h-11 w-full rounded-2xl border border-border bg-surface/60 px-4 py-2 text-sm text-foreground backdrop-blur-xl ring-offset-background focus-visible:outline-none focus-visible:border-primary/60 focus-visible:ring-2 focus-visible:ring-primary/25 disabled:cursor-not-allowed disabled:opacity-40 appearance-none transition-all",
            "hover:bg-accent/40",
            className
          )}
          ref={ref}
          {...props}
        >
          {children}
        </select>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
          <ChevronDown className="w-4 h-4" strokeWidth={2} />
        </div>
      </div>
    )
  }
)
Select.displayName = "Select"

export { Select }
