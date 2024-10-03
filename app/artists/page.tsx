"use client"

import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchPopularArtists, fetchArtistTopTracks } from '../store/artistsSlice'
import { AppDispatch, RootState } from '../store/store'
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { setCurrentTrack } from '../store/playerSlice'

const ARTISTS_PER_PAGE = 8

export default function ArtistsPage() {
  const dispatch = useDispatch<AppDispatch>()
  const { artists, status, error } = useSelector((state: RootState) => state.artists)
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchPopularArtists())
    }
  }, [status, dispatch])

  useEffect(() => {
    if (status === 'succeeded') {
      console.log("Artistes chargés :", artists)
    }
  }, [status, artists])

  const indexOfLastArtist = currentPage * ARTISTS_PER_PAGE
  const indexOfFirstArtist = indexOfLastArtist - ARTISTS_PER_PAGE
  const currentArtists = artists.slice(indexOfFirstArtist, indexOfLastArtist)
  const totalPages = Math.ceil(artists.length / ARTISTS_PER_PAGE)

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

  const handleTrackSelect = async (artist: any) => {
    console.log("Artiste sélectionné:", artist)
    try {
      const topTracks = await dispatch(fetchArtistTopTracks(artist.id)).unwrap()
      console.log("Meilleures pistes:", topTracks)
      const trackWithPreview = topTracks.find((track: any) => track.preview_url)
      
      if (trackWithPreview) {
        console.log("Piste avec prévisualisation trouvée:", trackWithPreview)
        dispatch(setCurrentTrack(trackWithPreview))
      } else {
        console.log("Aucune piste avec prévisualisation trouvée pour cet artiste")
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des pistes de l'artiste:", error)
    }
  }

  return (
    <main className="flex-1 p-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Artistes populaires</h1>
      {status === 'loading' && <p className="text-center">Chargement en cours...</p>}
      {status === 'failed' && <p className="text-red-500 text-center">Erreur : {error}</p>}
      {status === 'succeeded' && (
        <>
          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {currentArtists.map((artist: any) => (
              <li key={artist.id} className="bg-card rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                <div className="aspect-square overflow-hidden">
                  <img src={artist.images[0]?.url} alt={artist.name} className="w-full h-full object-cover transition-transform duration-300 hover:scale-110" />
                </div>
                <div className="p-4">
                  <h2 className="text-xl font-semibold truncate">{artist.name}</h2>
                  <div className="flex justify-between items-center mt-2">
                    <p className="text-sm text-muted-foreground">Popularité : {artist.popularity}</p>
                    <p className="text-sm text-muted-foreground">Followers : {artist.followers.total.toLocaleString()}</p>
                  </div>
                  <Button onClick={() => handleTrackSelect(artist)}>Lire</Button>
                </div>
              </li>
            ))}
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