import { Link, useParams } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';
import { Board } from 'model/Board';
import { BoardViewer } from 'renderer/BoardViewer';
import { LogEntry } from 'model/LogEntry';
import { LogEntryListItem } from 'renderer/LogEntryListItem';

export function AnalysisPage() {
  const { path } = useParams();
  const [board, setBoard] = useState<Board | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [selected, setSelected] = useState(0);
  const directory = '/home/ppioli/temp/testBoard';
  useEffect(() => {
    window.electron.fileApi.watchStart(directory);
    window.electron.fileApi.onReportPickup((event: any, log: any) => {
      setLogs((current) => [...current, log]);
    });
    return () => window.electron.fileApi.watchEnd();
  }, []);
  useEffect(() => {
    if (!path) {
      return;
    }
    window.electron.fileApi.boardOpen(path).then(setBoard);
  }, []);
  const handleSelect = useCallback((ix: number) => {
    setSelected(ix);
  }, []);
  if (!board) {
    return null;
  }
  return (
    <>
      <div className={'row'}>
        <div className={'col-12'}>
          <h2>Board {board.name}</h2>
          <Link
            to={'/edit/' + encodeURIComponent(path!)}
            className={'btn btn-primary'}
          >
            Edit
          </Link>
        </div>
      </div>
      <div className={'row'}>
        <div className={'col-4'}>
          <div className={'list-group'}>
            <div className={'list-group-item'}>Logs</div>
            {logs.length === 0 && (
              <div className={'list-group-item px-2 py-4'}>
                <h4>Empty</h4>
                <div>
                  This list will show any file created on the configured
                  directory({directory})
                </div>
              </div>
            )}
            {logs.map((log, ix) => (
              <LogEntryListItem
                log={log}
                key={log.path}
                onClick={() => handleSelect(ix)}
                selected={selected === ix}
              />
            ))}
          </div>
        </div>
        <div className={'col-8'}>
          <BoardViewer board={board} />
        </div>
      </div>
    </>
  );
}
