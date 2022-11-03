import { FSWatcher, watch } from 'chokidar';
import { BrowserWindow, dialog, ipcMain } from 'electron';
import { FileApiChannels } from '../ipc/fileApi';
import { Board } from 'model/Board';
import fs from 'fs/promises';
import { LogEntry } from 'model/LogEntry';

// File change watcher
let _watcher: FSWatcher | null = null;
let _window: BrowserWindow | null = null;
const startWatcher = (event: any, path: string) => {
  // Initialize watcher.
  console.log('Watcher starting');
  if (_watcher !== null) {
    throw new Error('Watcher already running');
  }
  _watcher = watch(path, {
    ignored: /(^|[\/\\])\../, // ignore dotfiles
    persistent: true,
  });
  //Add event listeners.
  _watcher.on('add', (pickedUp) => {
    const log: LogEntry = {
      path: pickedUp,
    };
    _window?.webContents.send(FileApiChannels.ReportPickUp, log);
  });
};

const stopWatcher = (event: any) => {
  if (_watcher) {
    _watcher.close().then(() => {
      _watcher = null;
    });
  }
};

export const fileWatcherMain = {
  register: (window: BrowserWindow) => {
    _window = window;
    ipcMain.on(FileApiChannels.WatchStart, startWatcher);
    ipcMain.on(FileApiChannels.WatchStop, stopWatcher);
    ipcMain.on(FileApiChannels.BoardSave, (event, board: Board) => {
      console.log(board);
      dialog
        .showSaveDialog(window, {
          title: 'Save board',
        })
        .then(({ canceled, filePath }) => {
          if (canceled || !filePath) {
            return;
          }
          return fs.writeFile(filePath, JSON.stringify(board));
        });
    });
    ipcMain.handle(FileApiChannels.BoardOpen, (event, path) =>
      fs.readFile(path, { encoding: 'utf8' }).then((s) => JSON.parse(s))
    );
  },
};
