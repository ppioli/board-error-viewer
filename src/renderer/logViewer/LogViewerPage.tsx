import { ErrorPage } from '../ErrorPage';
import { ErrorLogsList } from '../logErrorList/ErrorLogsList';
import { LogFileViewer } from './LogFileViewer';
import { LogFileStatus } from './LogFileStatus';
import { useAppSelector } from '../store';
import { stat } from 'fs';

export function LogViewerPage() {
  const { board, status, error } = useAppSelector((state) => state.board);
  if (status === 'LOADING') {
    return null;
  }
  if (status === 'ERROR') {
    return <ErrorPage error={error!} />;
  }
  return (
    <div className={'vh-100 d-flex flex-column'}>
      <div className={'d-flex h-100 align-items-stretch'}>
        <div className={'w-25 d-flex flex-column'}>
          <div className={'h-50'}>
            <ErrorLogsList />
          </div>
          <div className={'h-50'}>
            <LogFileStatus />
          </div>
        </div>
        <div className={'w-75'}>
          <LogFileViewer board={board} />
        </div>
      </div>
    </div>
  );
}
