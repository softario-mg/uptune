"use client"

import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchPopularSingles } from '../store/singlesSlice'
import { AppDispatch, RootState } from '../store/store'
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { setCurrentTrack } from '../store/playerSlice'

const SINGLES_PER_PAGE = 8

export default function SinglesPage() {
  const dispatch = useDispatch<AppDispatch>()
  const { singles, status, error } = useSelector((state: RootState) => state.singles)
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchPopularSingles())
    }
  }, [status, dispatch])

  const indexOfLastSingle = currentPage * SINGLES_PER_PAGE
  const indexOfFirstSingle = indexOfLastSingle - SINGLES_PER_PAGE
  const currentSingles = singles.slice(indexOfFirstSingle, indexOfLastSingle)
  const totalPages = Math.ceil(singles.length / SINGLES_PER_PAGE)

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

  const handleTrackSelect = (track: any) => {
    dispatch(setCurrentTrack(track))
  }

  return (
    <main className="flex-1 p-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Singles populaires</h1>
      {status === 'loading' && <p className="text-center">Chargement en cours...</p>}
      {status === 'failed' && <p className="text-red-500 text-center">Erreur : {error}</p>}
      {status === 'succeeded' && (
        <>
          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {currentSingles.map((single: any) => {
              const track = single.data
              if (!track) return null

              return (
                <li key={track.id} className="bg-card rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                  <div className="aspect-square overflow-hidden">
                    <img 
                      src={track.albumOfTrack.coverArt.sources[0].url || '/placeholder-image.jpg'} 
                      alt={track.name} 
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-110" 
                    />
                  </div>
                  <div className="p-4">
                    <h2 className="text-xl font-semibold truncate">{track.name}</h2>
                    <p className="text-sm text-muted-foreground mt-1 truncate">
                      {track.artists.items.map((artist: any) => artist.profile.name).join(', ')}
                    </p>
                    <div className="flex justify-between items-center mt-2">
                      <p className="text-sm text-muted-foreground">
                        Date de sortie : {new Date(track.albumOfTrack.date.isoString).getFullYear()}
                      </p>
                    </div>
                    <Button onClick={() => handleTrackSelect(track)} className="mt-2 w-full">
                      Lire
                    </Button>
                  </div>
                </li>
              )
            })}
          </ul>
          <div className="flex justify-center items-center mt-8 space-x-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-muted-foreground">
              Page {currentPage} sur {totalPages}
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </>
      )}
    </main>
  )
}