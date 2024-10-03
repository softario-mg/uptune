"use client"

import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../store/store'
import { setIsPlaying, setVolume } from '../store/playerSlice'
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Play, Pause, SkipBack, SkipForward, Volume2 } from 'lucide-react'
import { useEffect, useState, useRef } from 'react'

export default function MusicPlayer() {
  const [isClient, setIsClient] = useState(false)
  const dispatch = useDispatch()
  const { currentTrack, isPlaying, volume, audioUrl } = useSelector((state: RootState) => state.player)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    setIsClient(true)
    audioRef.current = new Audio()
  }, [])

  useEffect(() => {
    console.log("État du lecteur :", { currentTrack, isPlaying, volume, audioUrl })
    if (currentTrack) {
      console.log("Structure de currentTrack:", JSON.stringify(currentTrack, null, 2))
    }
    if (audioRef.current) {
      audioRef.current.volume = volume / 100
      if (currentTrack?.preview_url) {
        console.log("Tentative de lecture de l'URL :", currentTrack.preview_url)
        audioRef.current.src = currentTrack.preview_url
        if (isPlaying) {
          audioRef.current.play().then(() => {
            console.log("Lecture démarrée avec succès")
          }).catch(error => {
            console.error("Erreur de lecture:", error)
            dispatch(setIsPlaying(false))
          })
        } else {
          audioRef.current.pause()
          console.log("Lecteur en pause")
        }
      } else {
        console.log("Aucune URL de prévisualisation disponible pour cette piste")
        dispatch(setIsPlaying(false))
      }
    }
  }, [currentTrack, isPlaying, volume, dispatch])

  useEffect(() => {
    if (audioRef.current) {
      const handleError = (e: Event) => {
        console.error("Erreur de chargement audio:", e)
        dispatch(setIsPlaying(false))
      }
      audioRef.current.addEventListener('error', handleError)
      return () => {
        audioRef.current?.removeEventListener('error', handleError)
      }
    }
  }, [dispatch])

  const handlePlayPause = () => {
    if (audioRef.current && audioUrl) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.load() // Recharge l'audio avant de jouer
        audioRef.current.play().catch(error => console.error("Erreur de lecture:", error))
      }
      dispatch(setIsPlaying(!isPlaying))
    } else {
      console.log("Impossible de lire : pas d'audio ou d'URL")
    }
  }

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0]
    dispatch(setVolume(newVolume))
    if (audioRef.current) {
      audioRef.current.volume = newVolume / 100
    }
  }

  if (!isClient) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background p-4 border-t">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {currentTrack ? (
            <>
              <img src={currentTrack.albumOfTrack?.coverArt?.sources[0]?.url} alt={currentTrack.name} className="w-12 h-12 rounded" />
              <div>
                <p className="font-semibold">{currentTrack.name}</p>
                <p className="text-sm text-muted-foreground">{currentTrack.artists?.items[0]?.profile.name}</p>
                <p className="text-xs text-muted-foreground">
                  {currentTrack?.preview_url ? "URL audio disponible" : "Pas d'URL audio"}
                </p>
              </div>
            </>
          ) : (
            <p>Aucune piste sélectionnée</p>
          )}
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon">
            <SkipBack className="h-4 w-4" />
          </Button>
          <Button onClick={handlePlayPause} variant="outline" size="icon" disabled={!audioUrl}>
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
          <Button variant="ghost" size="icon">
            <SkipForward className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center space-x-2">
          <Volume2 className="h-4 w-4" />
          <Slider
            value={[volume]}
            onValueChange={handleVolumeChange}
            max={100}
            step={1}
            className="w-24"
          />
        </div>
      </div>
    </div>
  )
}