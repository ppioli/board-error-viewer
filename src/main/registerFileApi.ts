import { FSWatcher, watch } from 'chokidar';
import { BrowserWindow, dialog, ipcMain } from 'electron';
import { FileApiChannels } from '../ipc/FileApi';
import { Board } from 'model/Board';
import fs from 'fs/promises';
import { parseLog } from './logParser';
import { LogFileParseResult } from '../model/LogFileParseResult';
import { LogFile } from '../model/LogFile';
import { default as libpath } from 'path';
import { readConfigFile, updateRecentBoards } from './registerConfigApi';
import { noResult, okResult } from '../model/ApiResult';

// File change watcher
let _watcher: FSWatcher | null = null;
// TODO remove this
let _window: BrowserWindow | null = null;

const startWatcher = async () => {
  // Initialize watcher.
  try {
    if (_watcher !== null) {
      await stopWatcher();
    }
    const config = await readConfigFile();
    const { watchDir, extension } = config;
    if (!watchDir) {
      return noResult(new Error('Watch dir not set'));
    }
    _watcher = watch(watchDir, {
      ignored: /(^|[\/\\])\../, // ignore dotfiles
      persistent: true,
      ignoreInitial: false,
    });
    //Add event listeners.
    _watcher.on('add', async (path, stats) => {
      if (!stats?.isFile() || (extension && !path.endsWith(extension))) {
        return;
      }
      const file: LogFile = {
        date: stats?.birthtime,
        path,
        fileName: libpath.basename(path),
      };
      _window?.webContents.send(FileApiChannels.ReportPickUp, file);
    });
    return okResult(config);
  } catch (error: any) {
    console.log(error);
    return noResult(error);
  }
};

const reportOpen = async (path: string) => {
  try {
    const { encoding } = await readConfigFile();
    let lines = (await fs.readFile(path, {
      encoding: encoding,
    })) as any as string;
    lines = lines.replaceAll('\r\n', '\n');
    const result: LogFileParseResult = {
      path: path,
    };
    result.entry = parseLog(lines);
    console.log(result);
    return okResult(result);
  } catch (error: any) {
    return noResult(error);
  }
};

const stopWatcher = async () => {
  if (_watcher === null) {
    return;
  }
  await _watcher.close().then(() => {
    _watcher = null;
  });
};

export const registerFileApi = (window: BrowserWindow) => {
  _window = window;
  ipcMain.handle(FileApiChannels.WatchStart, () => startWatcher());
  ipcMain.on(FileApiChannels.WatchStop, stopWatcher);
  ipcMain.handle(FileApiChannels.BoardSave, async (event, board: Board) => {
    try {
      let { canceled, filePath } = await dialog.showSaveDialog(window, {
        title: 'Save board',
        filters: [
          {
            name: 'BoardErrorViewer boards',
            extensions: ['bew'],
          },
        ],
      });
      if (canceled || !filePath) {
        return;
      }
      if (!filePath?.endsWith('.bew')) {
        filePath = filePath + '.bew';
      }
      await fs.writeFile(filePath, JSON.stringify(board));
      await updateRecentBoards({ path: filePath, name: board.name }, false);
      return okResult(filePath);
    } catch (error: any) {
      return noResult(error);
    }
  });
  ipcMain.handle(FileApiChannels.BoardOpen, async (event, path) => {
    try {
      const board = await fs
        .readFile(path, { encoding: 'utf8' })
        .then((s) => JSON.parse(s) as Board);
      await updateRecentBoards({ path, name: board.name }, false);
      return okResult(board);
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        await updateRecentBoards({ path, name: '' }, false);
      }
      return noResult(error);
    }
  });
  ipcMain.handle(FileApiChannels.ReportOpen, (event: any, path: string) =>
    reportOpen(path)
  );
  ipcMain.handle(FileApiChannels.DirectoryPicker, () => {
    return dialog
      .showOpenDialog(_window!, {
        title: 'Select a directory',
        properties: ['openDirectory', 'createDirectory'],
      })
      .then((selection) => {
        if (selection.canceled || selection.filePaths.length == 0) {
          return null;
        }
        return selection.filePaths[0];
      });
  });
};
