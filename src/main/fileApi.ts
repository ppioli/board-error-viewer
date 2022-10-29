import {watch, FSWatcher} from 'chokidar';
import { BrowserWindow, ipcMain } from 'electron';
import { FileApiChannels } from '../ipc/fileApi';


// File change watcher
let _watcher: FSWatcher | null = null;
let _window: BrowserWindow | null = null;
const startWatcher = ( event:any, path: string ) => {
  // Initialize watcher.
  console.log("Watcher starting")
  if( _watcher !== null ) {
    throw new Error('Watcher already running')
  }
  _watcher = watch(path, {
    ignored: /(^|[\/\\])\../, // ignore dotfiles
    persistent: true
  });

  //Add event listeners.
  _watcher
    .on('add', (path:string) =>
      _window?.webContents.send(FileApiChannels.ReportPickUp, { content: path}))
}

const stopWatcher = ( event: any ) => {

  if( _watcher ){
    _watcher.close().then( () => {
      _watcher = null;
    })
  }
}

export const fileWatcherMain = {
  register: ( window: BrowserWindow ) => {
    _window = window;
    ipcMain.on(FileApiChannels.WatchStart, startWatcher)
    ipcMain.on(FileApiChannels.WatchStop, stopWatcher)
  }
}

