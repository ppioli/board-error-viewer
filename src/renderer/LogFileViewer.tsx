import { useCallback, useMemo } from 'react';
import { BoardViewer } from './BoardViewer';
import { Board } from '../model/Board';
import { useApiCall } from './useApiCall';
import { okResult } from '../model/ApiResult';
import { LogFileStatus } from './LogFileStatus';
import { LogEntry, LogEntryLine } from '../model/LogEntry';

export interface LogFileViewerProps {
  board: Board;
  logPath?: string;
}

export type LayerValue = 'TOP' | 'BOTTOM' | 'NONE';

function asComponentLayerDictionary(board: Board) {
  const dic: Map<string, LayerValue> = new Map<string, LayerValue>();

  board.layerTop.components.forEach((c) => {
    if (dic.has(c.id)) {
      throw new Error(`The id ${c.id} is not unique`);
    }
    dic.set(c.id, 'TOP');
  });
  board.layerBottom?.components.forEach((c) => {
    dic.set(c.id, 'BOTTOM');
  });

  return dic;
}

function splitLogEntryLines(
  dictionary: Map<string, LayerValue>,
  entry: LogEntry
) {
  const buckets: Map<LayerValue, Map<string, LogEntryLine>> = new Map<
    LayerValue,
    Map<string, LogEntryLine>
  >();

  entry.errors.forEach((el) => {
    const target: LayerValue = dictionary.get(el.id) ?? 'NONE';
    if (!buckets.has(target)) {
      buckets.set(target, new Map());
    }
    buckets.get(target)!.set(el.id, el);
  });
  return buckets;
}

export function LogFileViewer({ board, logPath }: LogFileViewerProps) {
  const call = useCallback(() => {
    if (!logPath) {
      return Promise.resolve(okResult(null));
    }
    return window.electron.fileApi.openReport(logPath);
  }, [logPath]);
  const {
    result: log,
    error,
    loading,
  } = useApiCall({
    call,
  });
  const componentsPerLayer = useMemo(() => {
    return asComponentLayerDictionary(board);
  }, [board]);

  const errorsPerLayer = useMemo(() => {
    if (log === null || log.entry === undefined) {
      return;
    }
    return splitLogEntryLines(componentsPerLayer, log.entry);
  }, [componentsPerLayer, log]);

  console.log(errorsPerLayer);
  if (loading) {
    return null;
  }
  return (
    <div className={'col-8 h-100'}>
      <LogFileStatus error={error} log={log} />
      {errorsPerLayer && (
        <>
          <BoardViewer
            layer={board.layerTop}
            title={'Top layer'}
            log={errorsPerLayer?.get('TOP') ?? new Map<string, LogEntryLine>()}
          />
          {board.layerBottom && (
            <BoardViewer
              layer={board.layerBottom}
              title={'Bottom layer'}
              log={
                errorsPerLayer?.get('BOTTOM') ?? new Map<string, LogEntryLine>()
              }
            />
          )}
        </>
      )}
    </div>
  );
}
