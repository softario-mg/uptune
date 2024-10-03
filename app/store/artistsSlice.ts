import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios'

export const fetchPopularArtists = createAsyncThunk(
  'artists/fetchPopularArtists',
  async () => {
    const options = {
      method: 'GET',
      url: 'https://spotify23.p.rapidapi.com/artists/',
      params: {
        ids: '2w9zwq3AktTeYYMuhMjju8,5pKCCKE2ajJHZ9KAiaK11H,246dkjvS1zLTtiykXe5h60,66CXWjxzNUsdJxJ2JdwvnR,1Xyo4u8uXC1ZmMpatF05PJ,6eUKZXaKkcviH0Ku9w2n3V,0du5cEVh5yTK9QJze8zA0C,3TVXtAsR1Inumwj472S9r4,6M2wZ9GZgrQXHCFfjv46we,1uNFoZAHBGtllmzznpCI3s,06HL4z0CvFAxyc27GXpf02,1McMsnEElThX1knmY4oliG,64KEffDW9EtZ1y2vBYgq8T,3Nrfpe0tUJi4K4DXYWgMUX,4q3ewBCX7sLwd24euuV69X,1Cs0zKBU1kc0i8ypK3B9ai,7dGJo4pcD2V6oG8kP0tJRR,6qqNVTkY8uBg9cP3Jd7DAH,0C8ZW7ezQVs4URX5aX7Kqx,4YRxDV8wJFPHPTeXepOstw'
      },
      headers: {
        'X-RapidAPI-Key': 'dd5b377408msha30326dd24ebe17p131b1ejsne9caa331c384',
        'X-RapidAPI-Host': 'spotify23.p.rapidapi.com'
      }
    };

    const response = await axios.request(options);
    return response.data.artists;
  }
)

export const fetchArtistTopTracks = createAsyncThunk(
  'artists/fetchTopTracks',
  async (artistId: string) => {
    const options = {
      method: 'GET',
      url: 'https://spotify23.p.rapidapi.com/artist_top_tracks/',
      params: {
        id: artistId,
        country: 'FR'
      },
      headers: {
        'X-RapidAPI-Key': 'dd5b377408msha30326dd24ebe17p131b1ejsne9caa331c384',
        'X-RapidAPI-Host': 'spotify23.p.rapidapi.com'
      }
    };

    const response = await axios.request(options);
    return response.data.tracks;
  }
)

interface ArtistsState {
  artists: any[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: ArtistsState = {
  artists: [],
  status: 'idle',
  error: null
}

const artistsSlice = createSlice({
  name: 'artists',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPopularArtists.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPopularArtists.fulfilled, (state, action: PayloadAction<any[]>) => {
        state.status = 'succeeded';
        state.artists = action.payload;
      })
      .addCase(fetchPopularArtists.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      })
  }
})

export default artistsSlice.reducer