import { useCallback, useMemo } from 'react';
import { Board, Component } from '../../model/Board';
import { BoardRenderer } from '../components/boardRenderer/BoardRenderer';
import { ComponentMarkerProps } from '../components/boardRenderer/ComponentMarker';
import { LogEntryLine } from '../../model/LogEntry';
import { useAppSelector } from '../store';

export interface LogFileViewerProps {}

export type LayerValue = 'TOP' | 'BOTTOM' | 'NONE';
const updateEntry = (
  dic: Record<string, LogEntryLine[]>,
  key: string,
  logEntry: LogEntryLine
) => {
  if (dic[key] === undefined) {
    dic[key] = [];
  }
  dic[key].push(logEntry);
};
export function LogFileViewer() {
  const log = useAppSelector((state) => state.logFile.currentLog);

  const logByComponentId = useMemo(() => {
    const dic: Record<string, LogEntryLine[]> = {};
    if (!log) {
      return dic;
    }
    log.lines.forEach((s) => {
      updateEntry(dic, s.id, s);
      if (s.testPointA) {
        updateEntry(dic, 'TP' + s.testPointA, s);
      }
      if (s.testPointB) {
        updateEntry(dic, 'TP' + s.testPointB, s);
      }
    });

    return dic;
  }, [log]);

  const filterFunc = useCallback(
    (component: Component) => {
      return logByComponentId[component.id] !== undefined;
    },
    [logByComponentId]
  );

  const markerBuilder = useCallback(
    (marker: ComponentMarkerProps) => {
      const error = logByComponentId[marker.component.id];
      if (!error) {
        return marker;
      }
      return {
        ...marker,
        message: error,
      };
    },
    [log]
  );

  return (
    <div className={'d-flex flex-column w-100 h-100'}>
      <BoardRenderer
        filter={filterFunc}
        showLabel={true}
        markerBuilder={markerBuilder}
        container={{ className: 'd-flex flex-grow h-100 w-100' }}
      />
    </div>
  );
}
