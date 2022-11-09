import { useCallback } from 'react';
import { BoardViewer } from './BoardViewer';
import { Board } from '../model/Board';
import { useApiCall } from './useApiCall';
import { okResult } from '../model/ApiResult';
import { LogFileStatus } from './LogFileStatus';

export interface LogFileViewerProps {
  board: Board;
  logPath?: string;
}
export function LogFileViewer({ board, logPath }: LogFileViewerProps) {
  const call = useCallback(() => {
    console.log('path', logPath);
    if (!logPath) {
      return Promise.resolve(okResult(null));
    }
    return window.electron.fileApi.openReport(logPath);
  }, [logPath]);
  const {
    result: log,
    error,
    loading,
  } = useApiCall({
    call,
  });
  console.log('log', log);
  return (
    <div className={'col-8 h-100'}>
      <LogFileStatus error={error} log={log} loading={loading} />
      <BoardViewer layer={board.layerTop} title={'Top layer'} />
    </div>
  );
}
