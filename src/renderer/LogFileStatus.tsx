import { LogFile } from '../model/LogFile';
import { ReactNode } from 'react';
import { LogFileParseResult } from '../model/LogFileParseResult';

export interface LogFileStatusProps {
  error: Error | null;
  log: LogFileParseResult | null;
  loading: boolean;
}

export function LogFileStatus({ error, log, loading }: LogFileStatusProps) {
  let content: ReactNode;
  if (loading) {
    content = <div>...</div>;
  } else if (error) {
    content = <div>{error.message}</div>;
  } else {
    content = <div>{JSON.stringify(log)}</div>;
  }
  return <div>{content}</div>;
}
