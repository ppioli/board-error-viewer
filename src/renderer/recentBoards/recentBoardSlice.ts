import { RecentBoard } from '../../model/RecentBoard';
import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit';
import { ApiError, ClientError } from '../../model/ApiError';
import { RootState } from '../store';

const entityAdapter = createEntityAdapter<RecentBoard>({
  selectId: (model) => model.path,
});
interface RecentBoardsState {
  status: 'IDLE' | 'LOADING' | 'ERROR';
  error: ClientError | ApiError | null;
}
const initialState = entityAdapter.getInitialState({
  status: 'IDLE',
  error: null,
} as RecentBoardsState);

export const loadRecentBoardsThunk = createAsyncThunk(
  'recentBoards/loadRecentBoards',
  async () => {
    return await window.electron.configApi.getRecentBoards();
  }
);

const recentBoardsSlice = createSlice({
  name: 'recentBoards',
  initialState,
  reducers: {
    removeRecentBoard: (state, action: PayloadAction<string>) => {
      entityAdapter.removeOne(state, action.payload);
    },
  },
  extraReducers: (builder) =>
    builder
      .addCase(loadRecentBoardsThunk.pending, (state) => {
        state.status = 'LOADING';
      })
      .addCase(loadRecentBoardsThunk.fulfilled, (state, action) => {
        const { result, error } = action.payload;
        if (error) {
          state.status = 'ERROR';
          state.error = error;
          entityAdapter.removeAll(state);
        } else {
          state.status = 'IDLE';
          state.error = null;
          entityAdapter.setAll(state, result!);
        }
      }),
});

export const { removeRecentBoard } = recentBoardsSlice.actions;
export const { selectAll: selectRecentBoards } = entityAdapter.getSelectors(
  (state: RootState) => state.recentBoards
);
export default recentBoardsSlice.reducer;
