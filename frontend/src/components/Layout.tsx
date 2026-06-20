import React from 'react'
import { Sidebar } from './Sidebar'

export function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex flex-col-reverse md:flex-row h-screen overflow-hidden bg-background text-foreground">
      <Sidebar />
      <main className="flex-1 overflow-y-auto transition-all duration-300 pb-16 md:pb-0">
        {children}
      </main>
    </div>
  )
}
