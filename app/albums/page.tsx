"use client"

import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchPopularAlbums } from '../store/albumsSlice'
import { AppDispatch, RootState } from '../store/store'
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from 'lucide-react'

const ALBUMS_PER_PAGE = 8

export default function AlbumsPage() {
  const dispatch = useDispatch<AppDispatch>()
  const { albums, status, error } = useSelector((state: RootState) => state.albums)
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchPopularAlbums())
    }
  }, [status, dispatch])

  const indexOfLastAlbum = currentPage * ALBUMS_PER_PAGE
  const indexOfFirstAlbum = indexOfLastAlbum - ALBUMS_PER_PAGE
  const currentAlbums = albums.slice(indexOfFirstAlbum, indexOfLastAlbum)
  const totalPages = Math.ceil(albums.length / ALBUMS_PER_PAGE)

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

  return (
    <main className="flex-1 p-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Albums populaires</h1>
      {status === 'loading' && <p className="text-center">Chargement en cours...</p>}
      {status === 'failed' && <p className="text-red-500 text-center">Erreur : {error}</p>}
      {status === 'succeeded' && (
        <>
          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {currentAlbums.map((album: any) => (
              <li key={album.id} className="bg-card rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                <div className="aspect-square overflow-hidden">
                  <img src={album.images[0]?.url} alt={album.name} className="w-full h-full object-cover transition-transform duration-300 hover:scale-110" />
                </div>
                <div className="p-4">
                  <h2 className="text-xl font-semibold truncate">{album.name}</h2>
                  <p className="text-sm text-muted-foreground mt-1 truncate">{album.artists.map((artist: any) => artist.name).join(', ')}</p>
                  <div className="flex justify-between items-center mt-2">
                    <p className="text-sm text-muted-foreground">Pistes : {album.total_tracks}</p>
                    <p className="text-sm text-muted-foreground">Sortie : {new Date(album.release_date).getFullYear()}</p>
                  </div>
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