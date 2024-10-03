"use client"

import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setCurrentTrack } from './store/playerSlice'
import { searchTracks } from './store/searchSlice'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { AppDispatch, RootState } from './store/store'

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('')
  const dispatch = useDispatch<AppDispatch>()
  const { results, status, error } = useSelector((state: RootState) => state.search)

  const handleSearch = () => {
    dispatch(searchTracks(searchTerm))
  }

  const handleTrackSelect = (track: any) => {
    dispatch(setCurrentTrack({
      ...track,
      preview_url: track.preview_url
    }))
  }

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-8">Clone Spotify</h1>
      <div className="flex space-x-4 mb-8">
        <Input
          type="text"
          placeholder="Rechercher une chanson..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button onClick={handleSearch} disabled={status === 'loading'}>
          {status === 'loading' ? 'Recherche en cours...' : 'Rechercher'}
        </Button>
      </div>
      {status === 'failed' && <p className="text-red-500">Erreur : {error}</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {results.map((track) => (
          <Dialog key={track.data.uri}>
            <DialogTrigger asChild>
              <div className="cursor-pointer">
                <img src={track.data.albumOfTrack.coverArt.sources[0].url} alt={track.data.name} className="w-full h-48 object-cover rounded-md" />
                <p className="mt-2 font-semibold">{track.data.name}</p>
                <p className="text-sm text-muted-foreground">{track.data.artists.items[0].profile.name}</p>
              </div>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{track.data.name}</DialogTitle>
              </DialogHeader>
              <div className="mt-4">
                <p>Artiste : {track.data.artists.items[0].profile.name}</p>
                <p>Album : {track.data.albumOfTrack.name}</p>
                <Button className="mt-4" onClick={() => handleTrackSelect(track.data)}>Jouer</Button>
              </div>
            </DialogContent>
          </Dialog>
        ))}
      </div>
    </main>
  )
}