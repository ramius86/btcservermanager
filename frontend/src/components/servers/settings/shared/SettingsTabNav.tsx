import { useRef, useEffect } from 'react'
import { LucideIcon, ChevronDown, Check } from 'lucide-react'
import { TabsList, TabsTrigger } from '../../../ui/Tabs'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '../../../ui/DropdownMenu'
import { Button, cn } from '../../../ui/Button'

export interface SettingsTabItem {
  value: string
  label: string
  icon: LucideIcon
}

interface SettingsTabNavProps {
  tabs: SettingsTabItem[]
  activeTab: string
  onTabChange: (value: string) => void
}

export function SettingsTabNav({ tabs, activeTab, onTabChange }: Readonly<SettingsTabNavProps>) {
  const currentTab = tabs.find(t => t.value === activeTab) || tabs[0]
  const CurrentIcon = currentTab?.icon
  const activeTriggerRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (activeTriggerRef.current) {
      activeTriggerRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      })
    }
  }, [activeTab])

  return (
    <div className="w-full space-y-2">
      {/* Mobile Category Dropdown Selector (md:hidden) */}
      <div className="md:hidden flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="outline"
              className="w-full justify-between h-12 px-4 bg-surface-elevated/70 border-border text-foreground hover:bg-surface-elevated font-bold"
            >
              <div className="flex items-center gap-2.5 truncate">
                {CurrentIcon && (
                  <div className="w-7 h-7 rounded-md bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                    <CurrentIcon className="w-4 h-4" />
                  </div>
                )}
                <div className="flex flex-col text-left truncate">
                  <span className="text-[9px] uppercase tracking-widest text-muted-foreground font-black">
                    Configuration Section
                  </span>
                  <span className="text-sm font-bold tracking-tight text-foreground truncate">
                    {currentTab?.label}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 pl-2 text-muted-foreground shrink-0">
                <span className="text-[10px] font-mono tracking-widest bg-muted/60 px-1.5 py-0.5 rounded text-muted-foreground font-bold">
                  {tabs.findIndex(t => t.value === activeTab) + 1}/{tabs.length}
                </span>
                <ChevronDown className="w-4 h-4" />
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-[calc(100vw-2rem)] max-w-sm bg-surface-elevated border-border p-1 max-h-[60vh] overflow-y-auto">
            {tabs.map((tab) => {
              const TabIcon = tab.icon
              const isSelected = tab.value === activeTab
              return (
                <DropdownMenuItem
                  key={tab.value}
                  onClick={() => onTabChange(tab.value)}
                  className={cn(
                    "flex items-center justify-between py-2.5 px-3 rounded-md cursor-pointer transition-colors",
                    isSelected ? "bg-primary/15 text-primary font-bold" : "hover:bg-muted/50"
                  )}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={cn(
                      "w-7 h-7 rounded-md flex items-center justify-center shrink-0 border",
                      isSelected ? "bg-primary/20 border-primary/30 text-primary" : "bg-muted/40 border-border/50 text-muted-foreground"
                    )}>
                      <TabIcon className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider truncate">
                      {tab.label}
                    </span>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-primary shrink-0 ml-2" />}
                </DropdownMenuItem>
              )
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Horizontal Tabs: Desktop (visible always) + Mobile scrollable pill track with fade masks */}
      <div className="relative w-full">
        <div className="overflow-x-auto no-scrollbar py-0.5">
          <TabsList className="bg-surface-elevated/50 p-1 border border-border rounded-lg w-max justify-start gap-1 h-auto flex flex-nowrap">
            {tabs.map((tab) => {
              const TabIcon = tab.icon
              const isSelected = tab.value === activeTab
              return (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  ref={isSelected ? activeTriggerRef : undefined}
                  className="rounded-md px-3.5 sm:px-4 py-2 sm:py-2.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-[10px] font-bold uppercase tracking-[0.15em] sm:tracking-[0.2em] text-muted-foreground hover:text-foreground transition-all flex items-center gap-2 shrink-0 touch-manipulation"
                >
                  <TabIcon className="w-3.5 h-3.5 shrink-0" />
                  <span>{tab.label}</span>
                </TabsTrigger>
              )
            })}
          </TabsList>
        </div>
      </div>
    </div>
  )
}
