import { LogEntry } from 'model/LogEntry';
import classNames from 'classnames';
import { LogFile } from '../model/LogFile';

export interface LogEntryListItemProps {
  file: LogFile
  selected: boolean;
  onClick: () => void;
}
export function LogEntryListItem({
  file,
  onClick,
  selected,
}: LogEntryListItemProps) {
  const { fileName, date } = file;
  return (
    <div
      className={classNames('list-group-item list-group-item-action', {
        active: selected,
      })}
      onClick={onClick}
    >
      <div>{fileName}</div>
      <div>{date.toDateString()}</div>

    </div>
  );
}
