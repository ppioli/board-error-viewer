import { ipcRenderer } from 'electron';
import { Board } from 'model/Board';
import { LogFileParseResult } from '../model/LogFileParseResult';
import { LogFile } from '../model/LogFile';
import { ApiResult } from '../model/ApiResult';
import { Config } from '../model/Config';

export const ConfigDirNotSet = 'ConfigFileNotSet';

export enum FileApiChannels {
  WatchStart = 'watch-start',
  WatchStop = 'watch-stop',
  ReportPickUp = 'report-pickup',
  BoardOpen = 'board-open',
  BoardSave = 'board-save',
  ReportOpen = 'report-open',
  DirectoryPicker = 'directory-picker',
}

export interface FileApi {
  watchStart(): Promise<ApiResult<Config>>;
  watchEnd(): void;
  onReportPickup(callback: (event: any, result: LogFile) => void): void;
  openReport(path: string): Promise<ApiResult<LogFileParseResult>>;
  boardSave(board: Board): Promise<ApiResult<string>>;
  boardOpen(path: string): Promise<ApiResult<Board>>;
  showDirectoryPicker(): Promise<string | null>;
}

export const fileApiHandler: FileApi = {
  watchStart: () => ipcRenderer.invoke(FileApiChannels.WatchStart),
  watchEnd: () => ipcRenderer.send(FileApiChannels.WatchStop),
  onReportPickup: (callback: (event: any, result: LogFile) => void) => {
    ipcRenderer.on(FileApiChannels.ReportPickUp, callback);
  },
  boardSave(board: Board) {
    return ipcRenderer.invoke(FileApiChannels.BoardSave, board);
  },
  boardOpen(path) {
    return ipcRenderer.invoke(FileApiChannels.BoardOpen, path);
  },
  openReport(path: string): Promise<ApiResult<LogFileParseResult>> {
    return ipcRenderer.invoke(FileApiChannels.ReportOpen, path);
  },
  showDirectoryPicker(): Promise<string | null> {
    return ipcRenderer.invoke(FileApiChannels.DirectoryPicker);
  },
};
