import React from 'react'
import { Sidebar } from './Sidebar'

export function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex flex-col-reverse md:flex-row h-[100dvh] overflow-hidden bg-background text-foreground">
      <Sidebar />
      <main className="flex-1 min-w-0 max-w-full overflow-y-auto overflow-x-hidden transition-all duration-300 pb-[calc(4rem+env(safe-area-inset-bottom,0px))] md:pb-0">
        {children}
      </main>
    </div>
  )
}
