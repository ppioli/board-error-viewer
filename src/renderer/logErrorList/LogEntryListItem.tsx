import classNames from 'classnames';
import { LogFile } from '../../model/LogFile';
import { useAppDispatch, useAppSelector } from '../store';
import { updateSelectedFile } from './logFileListSlice';

export interface LogEntryListItemProps {
  file: LogFile;
}
export function LogEntryListItem({ file }: LogEntryListItemProps) {
  const { fileName, date } = file;
  const dispatch = useAppDispatch();
  const selectedId = useAppSelector((state) => state.logFiles.selectedFile);
  const selected = selectedId == file.path;
  return (
    <div
      className={classNames('list-group-item list-group-item-action', {
        active: selected,
      })}
      onClick={() => dispatch(updateSelectedFile(file.path))}
    >
      <div>{fileName}</div>
      <div>{date}</div>
    </div>
  );
}
