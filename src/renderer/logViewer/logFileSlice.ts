import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ApiError, ClientError } from '../../model/ApiError';
import { LogEntry } from '../../model/LogEntry';

interface LogFileState {
  currentLog: LogEntry | null;
  activeLine: string | null;
  error: ApiError | ClientError | null;
}

const initialState: LogFileState = {
  currentLog: null,
  error: null,
  activeLine: null,
};

export const openLogFileThunk = createAsyncThunk(
  'logFileList/selectLog',
  async (path: string) => {
    return await window.electron.fileApi.openReport(path);
  }
);

const logFileSlice = createSlice({
  name: 'logFile',
  initialState,
  reducers: {
    updateActiveLine(state, { payload }: PayloadAction<string>) {
      state.activeLine = payload;
    },
  },
  extraReducers: (builder) =>
    builder.addCase(openLogFileThunk.fulfilled, (state, { payload }) => {
      state.activeLine = null;
      if (payload.error) {
        state.error = payload.error;
      } else {
        state.currentLog = payload.result ?? null;
      }
    }),
});

export const { updateActiveLine } = logFileSlice.actions;
export default logFileSlice.reducer;
