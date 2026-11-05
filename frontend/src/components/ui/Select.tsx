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
            "flex h-11 w-full rounded-none border border-border bg-background px-3 py-2 font-mono text-sm text-foreground ring-offset-background focus-visible:outline-none focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-40 appearance-none transition-colors",
            "hover:border-primary/50",
            className
          )}
          ref={ref}
          {...props}
        >
          {children}
        </select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-primary">
          <ChevronDown className="w-4 h-4" strokeWidth={2} />
        </div>
      </div>
    )
  }
)
Select.displayName = "Select"

export { Select }
