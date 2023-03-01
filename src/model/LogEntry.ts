export interface LogEntry {
  status: string;
  date: string;
  model: string;
  lines: LogEntryLine[];
}

export interface LogEntryLine {
  id: string;
  code: string;
  valueA: string;
  valueB: string;
  valueC: string;

  testPointA: string;

  testPointB: string;
}
