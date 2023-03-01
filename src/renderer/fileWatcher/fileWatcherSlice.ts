import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { ApiError, ClientError } from '../../model/ApiError';

interface FileWatcherState {
  error: ApiError | ClientError | null;
  state: 'LISTENING' | 'IDLE' | 'ERROR';
}

export const startFileWatcherThunk = createAsyncThunk(
  'fileWatcher/startWatch',
  async () => {
    return await window.electron.fileApi.watchStart();
  }
);

export const stopFileWatcherThunk = createAsyncThunk(
  'fileWatcher/stopWatch',
  async () => {
    return await window.electron.fileApi.watchEnd();
  }
);

const initialState: FileWatcherState = {
  error: null,
  state: 'IDLE',
};

const fileWatcherSlice = createSlice({
  name: 'fileWatcher',
  initialState,
  reducers: {},
  extraReducers: (builder) =>
    builder
      .addCase(startFileWatcherThunk.fulfilled, (state, response) => {
        if (response.payload.error) {
          state.error = response.payload.error;
          state.state = 'ERROR';
        } else {
          state.state = 'LISTENING';
        }
      })
      .addCase(stopFileWatcherThunk.fulfilled, (state, response) => {
        if (response.payload.error) {
          state.error = response.payload.error;
          state.state = 'ERROR';
        } else {
          state.state = 'IDLE';
        }
      }),
});

export default fileWatcherSlice.reducer;
