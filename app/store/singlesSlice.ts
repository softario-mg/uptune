import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios'

export const fetchPopularSingles = createAsyncThunk(
  'singles/fetchPopularSingles',
  async () => {
    const options = {
      method: 'GET',
      url: 'https://spotify23.p.rapidapi.com/search/',
      params: {
        q: 'single',
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

interface SinglesState {
  singles: any[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: SinglesState = {
  singles: [],
  status: 'idle',
  error: null
}

const singlesSlice = createSlice({
  name: 'singles',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPopularSingles.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPopularSingles.fulfilled, (state, action: PayloadAction<any[]>) => {
        state.status = 'succeeded';
        state.singles = action.payload;
      })
      .addCase(fetchPopularSingles.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      })
  }
})

export default singlesSlice.reducer