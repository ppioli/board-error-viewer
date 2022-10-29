import { BrowserWindow, ipcMain, ipcRenderer } from 'electron';
import { ApiHandler } from './apiHandler';


export interface Board {
  content: string;
}

export enum FileApiChannels {
  WatchStart = 'watch-start',
  WatchStop = 'watch-stop',
  ReportPickUp ='report-pickup',
  BoardOpen = 'board-open'
}

export interface FileApi {
  watchStart(path:string): void;
  watchEnd(): void;
  onReportPickup(callback: (event: any, board:Board) => void ) : void;
  boardOpen(board: Board): void;
  onBoardOpen(callback: (event: any, board: Board) => void): void;
}

// window and register
let _window: BrowserWindow | null = null;
const register = (window: BrowserWindow) => {
  _window = window;
};


const onReportPickup = (callback: (event: any, board: Board) => void) => {
  ipcRenderer.on(FileApiChannels.ReportPickUp, callback);
};

//Board open
const boardOpen = (board: Board) => {
  if (!_window) {
    throw new Error('Api not registered');
  }
  console.log('Called board open');
  _window.webContents.send(FileApiChannels.BoardOpen, board);
};

const onBoardOpen = (callback: (event: any, board: Board) => void) => {
  ipcRenderer.on('board-open', callback);
};

export const fileApiHandler: ApiHandler & FileApi = {
  watchStart: (path:string) => ipcRenderer.send(FileApiChannels.WatchStart, path),
  watchEnd: () => ipcRenderer.send(FileApiChannels.WatchStop),
  onReportPickup,
  boardOpen,
  register,
  onBoardOpen,
};
