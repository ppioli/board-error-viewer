import { useCallback } from 'react';
import { Board, Component } from '../../model/Board';
import { useApiCall } from '../useApiCall';
import { okResult } from '../../model/ApiResult';
import { LogFileStatus } from './LogFileStatus';
import { BoardRenderer } from '../components/boardRenderer/BoardRenderer';

export interface LogFileViewerProps {
  board: Board;
  logPath?: string;
  className?: string;
}

export type LayerValue = 'TOP' | 'BOTTOM' | 'NONE';

export function LogFileViewer({
  board,
  logPath,
}: LogFileViewerProps) {
  const call = useCallback(() => {
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

  const filterFunc = useCallback(
    (component: Component) => {
      if (!log?.entry) {
        return false;
      }
      return log.entry.errors.filter((c) => c.id === component.id).length > 0;
    },
    [log]
  );
  if (loading) {
    return null;
  }

  return (
      <div className={'d-flex flex-column w-100 h-100'}>
        <LogFileStatus error={error} log={log} />
        <BoardRenderer
          board={board}
          filter={filterFunc}
          showLabel={true}
          container={{ className: 'd-flex flex-grow h-100 w-100' }}
        />
      </div>
  );
}
