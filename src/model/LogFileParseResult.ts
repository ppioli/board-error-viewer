import { LogEntry } from './LogEntry';

export interface LogFileParseResult {
  error?: string;
  entry?: LogEntry;
  path: string;
}
