"use client"

import { useState } from 'react'
import Sidebar from './Sidebar'
import MusicPlayer from './MusicPlayer'

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-background to-secondary">
      <Sidebar />
      <main className={`flex-1 transition-all duration-300 ease-in-out ${isSidebarOpen ? 'ml-64' : 'ml-20'}`}>
        <div className="p-8">
          {children}
        </div>
      </main>
      <MusicPlayer />
    </div>
  )
}