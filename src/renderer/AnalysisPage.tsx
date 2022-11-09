import { Link, useParams } from 'react-router-dom';
import { useCallback, useState } from 'react';
import { useApiCall } from './useApiCall';
import { ErrorPage } from './ErrorPage';
import { LogFile } from '../model/LogFile';
import { ErrorLogsList } from './ErrorLogsList';
import { LogFileViewer } from './LogFileViewer';

export function AnalysisPage() {
  const { path } = useParams();
  const [selectedLog, setSelectedLog] = useState<LogFile | null>(null);
  const call = useCallback(() => {
    return window.electron.fileApi.boardOpen(path!);
  }, [path]);
  const {
    result: board,
    error,
    loading,
  } = useApiCall({
    call,
  });
  const handleSelect = useCallback((log: LogFile) => {
    setSelectedLog(log);
  }, []);
  if (loading) {
    return null;
  }
  if (!board) {
    return <ErrorPage error={error!} />;
  }
  return (
    <div className={'vh-100 d-flex flex-column'}>
      <div className={'d-flex align-items-baseline justify-content-between'}>
        <div className={'h4 mb-0'}>Board {board.name}</div>
        <Link
          to={'/edit/' + encodeURIComponent(path!)}
          className={'btn btn-link p-0'}
        >
          Edit
        </Link>
      </div>
      <div className={'d-flex flex-fill'}>
        <ErrorLogsList onSelect={handleSelect} />
        <LogFileViewer board={board} logPath={selectedLog?.path} />
      </div>
    </div>
  );
}
