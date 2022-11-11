import { ReactNode } from 'react';
import { LogFileParseResult } from '../model/LogFileParseResult';

export interface LogFileStatusProps {
  error: Error | null;
  log: LogFileParseResult | null;
}

export function LogFileStatus({ error, log }: LogFileStatusProps) {
  let content: ReactNode;
  if (error) {
    content = (
      <div className="alert alert-danger" role="alert">
        <h4 className="alert-heading">
          An error occurred while processing log file
        </h4>
        <div className={'d-flex justify-content-between'}>
          <div>Status: {log?.path}</div>
          <div className="mb-0 text-muted fs-6 text-right">{log?.error}</div>
        </div>
      </div>
    );
  } else {
    content = (
      <div className="alert alert-primary" role="alert">
        <h4 className="alert-heading">Model: {log?.entry?.model}</h4>
        <div className={'d-flex justify-content-between'}>
          <div>Status: {log?.entry?.status}</div>
          <div className="mb-0 text-muted text-right">{log?.entry?.date}</div>
        </div>
      </div>
    );
  }
  return content;
}
