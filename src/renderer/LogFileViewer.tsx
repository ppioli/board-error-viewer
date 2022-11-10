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
export type LayerValue = 'TOP' | 'BOTTOM' | 'NONE'
function asComponentLayerDictionary(board: Board){
  const dic : Record<string, LayerValue> = {};

  board.layerTop.components.forEach( c => {
    if(dic[c.id] !== undefined){
      throw new Error(`The id ${c.id} is not unique`)
    }
    dic[c.id] = 'TOP'
  })
  board.layerBottom?.components.forEach( c => {
    dic[c.id] = 'BOTTOM'
  })

  return dic;
}
const EmptyLogLines = {
    'TOP': [],
    'BOTTOM': [],
    'NONE': [],
  }
function splitLogEntryLines(dictionary: Record<string, LayerValue>, entry: LogEntry) {
  const buckets: Record<LayerValue, LogEntryLine[]> = EmptyLogLines;

  entry.errors.forEach( el =>{
    const target: LayerValue = dictionary[el.id] ?? 'NONE';
    buckets[target].push(el);
  })
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
  const componentsPerLayer = useMemo(()=>{
   return asComponentLayerDictionary(board)
  },[board])
  const errorsPerLayer = useMemo(()=>{
   if(log===null || log.entry === undefined){
     return EmptyLogLines;
   }
   return splitLogEntryLines(componentsPerLayer, log.entry)
  },[componentsPerLayer, log])

  return (
    <div className={'col-8 h-100'}>
      <LogFileStatus error={error} log={log} loading={loading} />
      <BoardViewer layer={board.layerTop} title={'Top layer'} log={errorsPerLayer['TOP']}/>
    </div>
  );
}
