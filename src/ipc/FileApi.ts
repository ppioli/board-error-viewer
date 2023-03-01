import { ipcRenderer } from 'electron';
import { Board } from 'model/Board';
import { LogFile } from '../model/LogFile';
import { ApiResult } from '../model/ApiResult';
import { Config } from '../model/Config';
import { LogEntry } from '../model/LogEntry';

export enum FileApiChannels {
  WatchStart = 'watch-start',
  WatchStop = 'watch-stop',
  ReportPickUp = 'report-pickup',
  BoardOpen = 'board-open',
  BoardSave = 'board-save',
  ReportOpen = 'report-open',
  ReportOpenFromFile = 'report-open-from-file',
  DirectoryPicker = 'directory-picker',
}

export interface FileApi {
  watchStart(): Promise<ApiResult<Config>>;

  watchEnd(): Promise<ApiResult<boolean>>;

  onReportPickup(callback: (event: any, result: LogFile) => void): void;

  openReport(path: string): Promise<ApiResult<LogEntry>>;

  boardSave(board: Board): Promise<ApiResult<string>>;

  boardOpen(path: string): Promise<ApiResult<Board>>;

  reportOpenFromFile(): void;

  showDirectoryPicker(): Promise<string | null>;
}

export const fileApiHandler: FileApi = {
  watchStart: () => ipcRenderer.invoke(FileApiChannels.WatchStart),
  watchEnd: () => ipcRenderer.invoke(FileApiChannels.WatchStop),
  onReportPickup: (callback: (event: any, result: LogFile) => void) => {
    ipcRenderer.on(FileApiChannels.ReportPickUp, callback);
  },
  boardSave(board: Board) {
    return ipcRenderer.invoke(FileApiChannels.BoardSave, board);
  },
  boardOpen(path) {
    return ipcRenderer.invoke(FileApiChannels.BoardOpen, path);
  },
  openReport(path: string): Promise<ApiResult<LogEntry>> {
    return ipcRenderer.invoke(FileApiChannels.ReportOpen, path);
  },
  reportOpenFromFile: () =>
    ipcRenderer.send(FileApiChannels.ReportOpenFromFile),
  showDirectoryPicker(): Promise<string | null> {
    return ipcRenderer.invoke(FileApiChannels.DirectoryPicker);
  },
};
