export interface LogEntry {
  status: string;
  date: string;
  model: string;
  errors: LogEntryLine[];
}

export interface LogEntryLine {
  id: string;
  code: string;
  valueA: string;
  valueB: string;
  valueC: string;
}
