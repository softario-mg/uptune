"use client"

import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Users, Disc, Music } from 'lucide-react'
import { ThemeToggle } from './ThemeToggle'

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export default function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  return (
    <div className={`fixed top-0 left-0 h-full bg-background border-r transition-all duration-300 ease-in-out z-10 ${isOpen ? 'w-64' : 'w-20'}`}>
      <Button 
        variant="ghost" 
        size="icon" 
        className="absolute top-4 right-4"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <ChevronLeft /> : <ChevronRight />}
      </Button>
      <nav className="mt-16 p-4">
        <ul className="space-y-4">
          <li>
            <Link href="/artists" className="flex items-center space-x-2 text-foreground hover:text-primary transition-colors">
              <Users size={24} />
              {isOpen && <span>Artistes</span>}
            </Link>
          </li>
          <li>
            <Link href="/albums" className="flex items-center space-x-2 text-foreground hover:text-primary transition-colors">
              <Disc size={24} />
              {isOpen && <span>Albums</span>}
            </Link>
          </li>
          <li>
            <Link href="/singles" className="flex items-center space-x-2 text-foreground hover:text-primary transition-colors">
              <Music size={24} />
              {isOpen && <span>Singles</span>}
            </Link>
          </li>
        </ul>
      </nav>
      <div className="absolute bottom-4 left-4">
        <ThemeToggle />
      </div>
    </div>
  )
}