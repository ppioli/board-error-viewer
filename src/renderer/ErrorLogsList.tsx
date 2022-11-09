import { useCallback, useEffect, useState } from 'react';
import { LogFile } from '../model/LogFile';
import { useApiCall } from './useApiCall';
import { ErrorPage } from './ErrorPage';
import { LogEntryListItem } from './LogEntryListItem';
import { Config } from '../model/Config';

export interface ErrorLogsList {
  onSelect: (file: LogFile) => void;
}

export function ErrorLogsList({ onSelect }: ErrorLogsList) {
  const [logs, setLogs] = useState<LogFile[]>([]);
  const [selected, setSelected] = useState(0);
  const {
    result: config,
    error,
    loading,
  } = useApiCall({
    call: window.electron.fileApi.watchStart,
  });

  useEffect(() => {
    window.electron.fileApi.onReportPickup((event: any, log: LogFile) => {
      setLogs((current) => {
        return [...current, log];
      });
    });
    return () => window.electron.fileApi.watchEnd();
  }, []);

  const handleSelect = useCallback((ix: number) => {
    setSelected(ix);
  }, []);

  useEffect(() => {
    onSelect(logs[selected]);
  }, [logs, selected]);

  if (loading) {
    return null;
  }
  if (!config) {
    return <ErrorPage error={error!} />;
  }
  return (
    <div className={'card'}>
      <div className={'card-header'}>Logs</div>
      <div className={'card-body'}>
        {logs.length === 0 && (
          <div
            className={
              'h-100 d-flex justify-content-center flex-column px-2 py-4 text-muted text-center'
            }
          >
            <div>
              This list will show any file created on the configured directory (
              {config.watchDir})
            </div>
          </div>
        )}
        {logs.length > 0 && (
          <div
            className={'list-group flex-grow-1 mr-3'}
            style={{
              maxWidth: 400,
            }}
          >
            {logs.map((file, ix) => (
              <LogEntryListItem
                file={file}
                key={file.fileName}
                onClick={() => handleSelect(ix)}
                selected={selected === ix}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
