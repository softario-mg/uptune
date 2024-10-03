import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface PlayerState {
  currentTrack: any | null
  isPlaying: boolean
  volume: number
  audioUrl: string | null
}

const initialState: PlayerState = {
  currentTrack: null,
  isPlaying: false,
  volume: 50,
  audioUrl: null,
}

export const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    setCurrentTrack: (state, action: PayloadAction<any>) => {
      state.currentTrack = action.payload
      state.audioUrl = action.payload?.preview_url || null
      console.log("Nouvelle piste définie:", state.currentTrack)
      console.log("URL audio:", state.audioUrl)
    },
    setIsPlaying: (state, action: PayloadAction<boolean>) => {
      state.isPlaying = action.payload
    },
    setVolume: (state, action: PayloadAction<number>) => {
      state.volume = action.payload
    },
  },
})

export const { setCurrentTrack, setIsPlaying, setVolume } = playerSlice.actions

export default playerSlice.reducer