import { useEffect } from 'react';
import { LogEntryListItem } from './LogEntryListItem';
import { useAppDispatch, useAppSelector } from '../store';
import {
  startFileWatcherThunk,
  stopFileWatcherThunk,
} from '../fileWatcher/fileWatcherSlice';
import { logFileAdded, selectLogFiles } from './logFileListSlice';

export function ErrorLogsList() {
  const dispatch = useAppDispatch();
  const logs = useAppSelector(selectLogFiles);

  useEffect(() => {
    dispatch(startFileWatcherThunk());
    return () => dispatch(stopFileWatcherThunk());
  }, []);

  useEffect(() => {
    window.electron.fileApi.onReportPickup((event, report) => {
      console.log('Picked ', report);
      dispatch(logFileAdded(report));
    });
  }, []);

  return (
    <div className={'card h-100'}>
      <div className={'card-header'}>Files</div>
      {logs.length === 0 && (
        <div className={'card-body'}>
          <div
            className={
              'h-100 d-flex justify-content-center flex-column px-2 py-4 text-muted text-center'
            }
          >
            <div>
              This list will show any file created on the configured directory
            </div>
          </div>
        </div>
      )}
      {logs.length > 0 && (
        <div className={'list-group overflow-y-scroll'}>
          {logs.map((file, ix) => (
            <LogEntryListItem file={file} key={file.fileName} />
          ))}
        </div>
      )}
    </div>
  );
}
