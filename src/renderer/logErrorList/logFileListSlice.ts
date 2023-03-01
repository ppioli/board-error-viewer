import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from '@reduxjs/toolkit';
import { LogFile } from '../../model/LogFile';
import { RootState } from '../store';
import { openLogFileThunk } from '../logViewer/logFileSlice';

const logFileAdapter = createEntityAdapter<LogFile>({
  selectId: (model) => model.path,
});
interface LogFileListState {
  selectedFile: string | null;
}
const initialState = logFileAdapter.getInitialState({
  selectedFile: null,
} as LogFileListState);

export const updateSelectedFile = createAsyncThunk(
  'logFileList/selectLogFile',
  async (path: string, thunkAPI) => {
    // TODO Error handling
    await thunkAPI.dispatch(openLogFileThunk(path));
    return path;
  }
);

const logFileSlice = createSlice({
  name: 'logFiles',
  initialState,
  reducers: {
    logFileDeleted: logFileAdapter.removeOne,
    logFileAdded: logFileAdapter.addOne,
  },
  extraReducers: (builder) =>
    builder.addCase(updateSelectedFile.fulfilled, (state, action) => {
      state.selectedFile = action.payload;
    }),
});

export const { logFileAdded, logFileDeleted } = logFileSlice.actions;

export default logFileSlice.reducer;

export const { selectAll: selectLogFiles, selectById: selectLogFileById } =
  logFileAdapter.getSelectors((state: RootState) => state.logFiles);
