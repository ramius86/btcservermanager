import { useRef, useEffect } from 'react'
import { LucideIcon } from 'lucide-react'
import { TabsList, TabsTrigger } from '../../../ui/Tabs'

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

export function SettingsTabNav({ tabs, activeTab }: Readonly<SettingsTabNavProps>) {
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
    <div className="w-full min-w-0 max-w-full">
      <div className="overflow-x-auto no-scrollbar py-1 w-full min-w-0">
        <TabsList className="bg-surface-elevated/60 p-1 border border-border/70 rounded-xl w-max flex items-center gap-1.5 h-auto">
          {tabs.map((tab) => {
            const TabIcon = tab.icon
            const isSelected = tab.value === activeTab
            return (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                ref={isSelected ? activeTriggerRef : undefined}
                className="rounded-lg px-3.5 sm:px-4 py-2 sm:py-2.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-[10px] sm:text-xs font-bold uppercase tracking-[0.15em] sm:tracking-[0.2em] text-muted-foreground hover:text-foreground transition-all flex items-center gap-2 shrink-0 touch-manipulation"
              >
                <TabIcon className="w-3.5 h-3.5 shrink-0" />
                <span>{tab.label}</span>
              </TabsTrigger>
            )
          })}
        </TabsList>
      </div>
    </div>
  )
}
