import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { Board } from '../../model/Board';
import { ApiError, ClientError } from '../../model/ApiError';

interface BoardState {
  board: Board | null;
  status: 'IDLE' | 'ERROR' | 'LOADING';
  error: ApiError | ClientError | null;
}

const initialState: BoardState = {
  board: null,
  status: 'IDLE',
  error: null,
};

export const loadBoardThunk = createAsyncThunk(
  'board/loadBoard',
  async (path: string) => {
    return await window.electron.fileApi.boardOpen(path);
  }
);

const boardSlice = createSlice({
  name: 'board',
  initialState,
  reducers: {},
  extraReducers: (builder) =>
    builder
      .addCase(loadBoardThunk.pending, (state) => {
        state.status = 'LOADING';
      })
      .addCase(loadBoardThunk.fulfilled, (state, action) => {
        const { error, result: board } = action.payload;
        if (action.payload.error) {
          state.error = error;
          state.status = 'ERROR';
        }
        state.board = board;
        state.status = 'IDLE';
      }),
});

export default boardSlice.reducer;
