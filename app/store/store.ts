import { configureStore } from '@reduxjs/toolkit'
import artistsReducer from './artistsSlice'
import playerReducer from './playerSlice'
import singlesReducer from './singlesSlice'
import searchReducer from './searchSlice'

export const store = configureStore({
  reducer: {
    artists: artistsReducer,
    player: playerReducer,
    singles: singlesReducer,
    search: searchReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch