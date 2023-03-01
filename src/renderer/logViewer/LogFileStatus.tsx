import { useAppDispatch, useAppSelector } from '../store';
import { LogEntry, LogEntryLine } from '../../model/LogEntry';
import classNames from 'classnames';
import { updateActiveLine } from './logFileSlice';

export interface LogFileStatusProps {}

export function LogFileStatus() {
  const logFile = useAppSelector((state) => state.logFile.currentLog);
  const openFromFile = () => {
    window.electron.fileApi.reportOpenFromFile();
  };
  return (
    <div className={'card h-100'}>
      <div className={'card-header'}>Log</div>
      {logFile ? (
        <LogStatusContent file={logFile} />
      ) : (
        <div
          className={
            'card-body d-flex flex-column justify-content-center text-center overflow-y-scroll'
          }
        >
          <h4>No log selected</h4>
          <h5>Select a file from the list above, or open one from a file.</h5>
        </div>
      )}
      <div className={'card-footer d-flex flex-row-reverse'}>
        <button
          className={'btn btn-link'}
          type={'button'}
          onClick={openFromFile}
        >
          Open
        </button>
      </div>
    </div>
  );
}

function LogStatusContent({ file }: { file: LogEntry }) {
  return (
    <>
      <div className={'card-body'}>
        <div>
          <small>STATUS</small> {file.status}
        </div>
        <div>
          <small>DATE</small> {file.date}
        </div>
      </div>
      <div className={'list-group overflow-y-scroll'}>
        {file.lines.map((line) => (
          <LogContentLine line={line} />
        ))}
      </div>
    </>
  );
}

function LogContentLine({ line }: { line: LogEntryLine }) {
  const activeLine = useAppSelector((state) => state.logFile.activeLine);
  const dispatch = useAppDispatch();

  return (
    <div
      onClick={() => dispatch(updateActiveLine(line.id))}
      className={classNames('list-group-item d-flex', {
        active: activeLine === line.id,
      })}
    >
      <div className={'h4 mb-0'}>{line.id}</div>
      <div>{line.code}</div>
      <div>
        {line.testPointA}
        {line.testPointB}
      </div>
      <div>
        {line.valueB} {line.valueA} {line.valueB}
        {line.valueC}
      </div>
    </div>
  );
}
