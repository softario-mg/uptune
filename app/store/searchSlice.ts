import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios'

export const searchTracks = createAsyncThunk(
  'search/searchTracks',
  async (searchTerm: string) => {
    const options = {
      method: 'GET',
      url: 'https://spotify23.p.rapidapi.com/search/',
      params: {
        q: searchTerm,
        type: 'multi',
        offset: '0',
        limit: '20',
        numberOfTopResults: '5'
      },
      headers: {
        'X-RapidAPI-Key': 'dd5b377408msha30326dd24ebe17p131b1ejsne9caa331c384',
        'X-RapidAPI-Host': 'spotify23.p.rapidapi.com'
      }
    };

    const response = await axios.request(options);
    return response.data.tracks.items;
  }
)

interface SearchState {
  results: any[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: SearchState = {
  results: [],
  status: 'idle',
  error: null
}

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(searchTracks.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(searchTracks.fulfilled, (state, action: PayloadAction<any[]>) => {
        state.status = 'succeeded';
        state.results = action.payload;
      })
      .addCase(searchTracks.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      })
  }
})

export default searchSlice.reducer