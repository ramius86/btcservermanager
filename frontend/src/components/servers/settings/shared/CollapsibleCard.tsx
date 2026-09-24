import { useState, type ReactNode } from 'react'
import { ChevronDown, LucideIcon } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../ui/Card'
import { cn } from '../../../ui/Button'

interface CollapsibleCardProps {
  title: string
  description?: string
  icon?: LucideIcon
  defaultOpen?: boolean
  children: ReactNode
  className?: string
  contentClassName?: string
  badge?: ReactNode
}

export function CollapsibleCard({
  title,
  description,
  icon: Icon,
  defaultOpen = true,
  children,
  className,
  contentClassName,
  badge,
}: Readonly<CollapsibleCardProps>) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <Card className={cn("border-border/50 bg-surface-elevated/20 overflow-hidden backdrop-blur-sm", className)}>
      <div className="h-1 bg-primary" />
      <CardHeader 
        onClick={() => setIsOpen(prev => !prev)}
        className="pb-4 sm:pb-6 cursor-pointer md:cursor-default select-none transition-colors hover:bg-muted/10 md:hover:bg-transparent"
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 sm:gap-4 min-w-0">
            {Icon && (
              <div className="w-9 h-9 sm:w-10 sm:h-10 bg-primary/10 flex items-center justify-center rounded-lg border border-primary/20 text-primary shrink-0">
                <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
            )}
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <CardTitle className="text-base sm:text-lg font-bold truncate">{title}</CardTitle>
                {badge}
              </div>
              {description && (
                <CardDescription className="text-xs sm:text-sm text-muted-foreground line-clamp-1 sm:line-clamp-none">
                  {description}
                </CardDescription>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0 md:hidden">
            <span className="text-[10px] uppercase font-bold text-muted-foreground/70">
              {isOpen ? 'Nascondi' : 'Espandi'}
            </span>
            <div className={cn(
              "w-7 h-7 rounded-md bg-muted/40 flex items-center justify-center text-muted-foreground transition-transform duration-200",
              isOpen ? "rotate-180" : ""
            )}>
              <ChevronDown className="w-4 h-4" />
            </div>
          </div>
        </div>
      </CardHeader>
      <div className={cn(
        "transition-all duration-300",
        isOpen ? "block" : "hidden md:block"
      )}>
        <CardContent className={cn("space-y-6 sm:space-y-8 p-4 sm:p-6 lg:p-8", contentClassName)}>
          {children}
        </CardContent>
      </div>
    </Card>
  )
}
