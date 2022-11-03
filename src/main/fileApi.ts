import { FSWatcher, watch } from 'chokidar';
import { BrowserWindow, dialog, ipcMain } from 'electron';
import { FileApiChannels } from '../ipc/fileApi';
import { Board } from 'model/Board';
import fs from 'fs/promises';
import { parseLog } from './logParser';
import { LogFileParseResult } from '../model/LogFileParseResult';
import { LogFile } from '../model/LogFile';
import {default as libpath} from 'path';
// File change watcher
let _watcher: FSWatcher | null = null;
let _window: BrowserWindow | null = null;
const startWatcher = (event: any, dir: string) => {
  // Initialize watcher.
  console.log('Watcher starting');
  if (_watcher !== null) {
    throw new Error('Watcher already running');
  }
  _watcher = watch(dir, {
    ignored: /(^|[\/\\])\../, // ignore dotfiles
    persistent: true,
    ignoreInitial: true,

  });
  //Add event listeners.
  _watcher.on('add', async (path, stats) => {
    if( !stats?.isFile()){
      return;
    }
    const file: LogFile = {
      date: stats?.birthtime,
      path,
      fileName: libpath.basename(path)
    }
    _window?.webContents.send(FileApiChannels.ReportPickUp,file );
  });
};
const reportOpen = async ( event: any, path: string ) => {

  let lines = await fs.readFile(path, {encoding: 'utf-8'});
  const result: LogFileParseResult = {
    path: path
  }
  try {
    result.entry = parseLog(lines);
  } catch ( error ){
    result.error = typeof (error) === 'string' ? error : 'An unexpected error occurred while processing the file';
  }

  return result;
}
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
    ipcMain.handle(FileApiChannels.ReportOpen, reportOpen)
  },
};
