import { LogEntry } from 'model/LogEntry';
import classNames from 'classnames';

export interface LogEntryListItemProps {
  log: LogEntry;
  selected: boolean;
  onClick: () => void;
}
export function LogEntryListItem({
  log,
  onClick,
  selected,
}: LogEntryListItemProps) {
  const { path } = log;
  return (
    <div
      className={classNames('list-group-item list-group-item-action', {
        active: selected,
      })}
      onClick={onClick}
    >
      {path}
    </div>
  );
}
