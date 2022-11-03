import { BrowserWindow, ipcMain, ipcRenderer } from 'electron';
import { ApiHandler } from './apiHandler';
import { Board } from 'model/Board';

export enum FileApiChannels {
  WatchStart = 'watch-start',
  WatchStop = 'watch-stop',
  ReportPickUp = 'report-pickup',
  BoardOpen = 'board-open',
  BoardSave = 'board-save',
}

export interface FileApi {
  watchStart(path: string): void;
  watchEnd(): void;
  onReportPickup(callback: (event: any, board: Board) => void): void;
  boardSave(board: Board): void;
  boardOpen(path: string): Promise<Board | null>;
}

// window and register
let _window: BrowserWindow | null = null;
const register = (window: BrowserWindow) => {
  _window = window;
};

const onReportPickup = (callback: (event: any, board: Board) => void) => {
  ipcRenderer.on(FileApiChannels.ReportPickUp, callback);
};

export const fileApiHandler: ApiHandler & FileApi = {
  watchStart: (path: string) =>
    ipcRenderer.send(FileApiChannels.WatchStart, path),
  watchEnd: () => ipcRenderer.send(FileApiChannels.WatchStop),
  onReportPickup,
  register,
  boardSave(board: Board) {
    ipcRenderer.send(FileApiChannels.BoardSave, board);
  },
  boardOpen(path) {
    return ipcRenderer.invoke(FileApiChannels.BoardOpen, path);
  },
};
