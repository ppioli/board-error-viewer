import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import logFileListReducer from './logErrorList/logFileListSlice';
import fileWatcherReducer from './fileWatcher/fileWatcherSlice';
import logFileReducer from './logViewer/logFileSlice';
import boardReducer from './boardEdit/boardSlice';
import recentBoardReducer from './recentBoards/recentBoardSlice';

const store = configureStore({
  reducer: {
    recentBoards: recentBoardReducer,
    logFiles: logFileListReducer,
    logFile: logFileReducer,
    fileWatcher: fileWatcherReducer,
    board: boardReducer,
  },
});

export default store;

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
