import { Link, useParams } from 'react-router-dom';
import { useCallback, useState } from 'react';
import { useApiCall } from '../useApiCall';
import { ErrorPage } from '../ErrorPage';
import { LogFile } from '../../model/LogFile';
import { ErrorLogsList } from './ErrorLogsList';
import { LogFileViewer } from './LogFileViewer';

export function LogViewerPage() {
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
    console.log(error)
    return <ErrorPage error={error!} />;
  }
  return (
    <div className={'vh-100 d-flex flex-column'}>
      <div className={'d-flex flex-fill align-items-stretch'}>
        <div className={'w-25 card bg-dark text-white'}>
          <div className={'card-header d-flex justify-content-between align-items-center'}>
            <div>{board.name}</div>
            <Link to={`/edit/${encodeURIComponent(path!)}`} className={'btn btn-link'}>
              Editar
            </Link>
          </div>
          <ErrorLogsList onSelect={handleSelect} />
          <div className={'card-footer'}>
           This is a placeholder
          </div>
        </div>
        <div className={'w-75'}>
          <LogFileViewer board={board} logPath={selectedLog?.path}/>
        </div>
      </div>
    </div>
  );
}

