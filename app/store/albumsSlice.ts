import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios'

export const fetchPopularAlbums = createAsyncThunk(
  'albums/fetchPopularAlbums',
  async () => {
    const options = {
      method: 'GET',
      url: 'https://spotify23.p.rapidapi.com/albums/',
      params: {
        ids: '4aawyAB9vmqN3uQ7FjRGTy,0sjyZypccO1vyihqaAkdt3,6trNtQUgC8cgbWcqoMYkOR,1A2GTWGtFfWp7KSQTwWOyo,2noRn2Aes5aoNVsU6iWThc,4m2880jivSbbyEGAKfITCa,3RQQmkQEvNCY4prGKE6oc5,6pwuKxMUkNg673KETsXPUV,2ODvWsOgouMbaA5xf0RkJe,4LH4d3cOWNNsVw41Gqt2kv'
      },
      headers: {
        'X-RapidAPI-Key': 'dd5b377408msha30326dd24ebe17p131b1ejsne9caa331c384',
        'X-RapidAPI-Host': 'spotify23.p.rapidapi.com'
      }
    };

    const response = await axios.request(options);
    return response.data.albums;
  }
)

interface AlbumsState {
  albums: any[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: AlbumsState = {
  albums: [],
  status: 'idle',
  error: null
}

const albumsSlice = createSlice({
  name: 'albums',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPopularAlbums.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPopularAlbums.fulfilled, (state, action: PayloadAction<any[]>) => {
        state.status = 'succeeded';
        state.albums = action.payload;
      })
      .addCase(fetchPopularAlbums.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      })
  }
})

export default albumsSlice.reducer