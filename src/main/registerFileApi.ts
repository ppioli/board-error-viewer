import { FSWatcher, watch } from 'chokidar';
import { BrowserWindow, dialog, ipcMain } from 'electron';
import { FileApiChannels } from '../ipc/FileApi';
import { Board } from 'model/Board';
import fs from 'fs/promises';
import { parseLog } from './logParser';
import { LogFile } from '../model/LogFile';
import { default as libpath } from 'path';
import { readConfigFile, updateRecentBoards } from './registerConfigApi';
import {
  apiErrorResult,
  clientErrorResult,
  okResult,
} from '../model/ApiResult';
import logger from './logger';

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
    logger.info('Watch started: ', config);
    const { watchDir, extension } = config;
    if (!watchDir) {
      return clientErrorResult('');
    }
    _watcher = watch(watchDir, {
      ignored: /(^|[\/\\])\../, // ignore dotfiles
      persistent: true,
      ignoreInitial: !(config.persistent ?? false),
    });
    //Add event listeners.
    _watcher.on('add', async (path, stats) => {
      if (!stats?.isFile() || (extension && !path.endsWith(extension))) {
        return;
      }
      const file: LogFile = {
        date: stats?.birthtime.toISOString(),
        path,
        fileName: libpath.basename(path),
      };
      _window?.webContents.send(FileApiChannels.ReportPickUp, file);
    });
    return okResult(config);
  } catch (error: any) {
    logger.info(error);
    return apiErrorResult(error);
  }
};

const reportOpen = async (path: string) => {
  try {
    const { encoding } = await readConfigFile();
    let lines = (await fs.readFile(path, {
      encoding: encoding,
    })) as any as string;
    lines = lines.replaceAll('\r\n', '\n');
    return okResult(parseLog(lines));
  } catch (error: any) {
    return apiErrorResult(error);
  }
};

const stopWatcher = async () => {
  if (_watcher === null) {
    return;
  }
  await _watcher.close().then(() => {
    _watcher = null;
  });
  return okResult(true);
};

export const registerFileApi = (window: BrowserWindow) => {
  _window = window;
  ipcMain.handle(FileApiChannels.WatchStart, startWatcher);
  ipcMain.handle(FileApiChannels.WatchStop, stopWatcher);
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
      return apiErrorResult(error);
    }
  });
  ipcMain.handle(FileApiChannels.BoardOpen, async (event, path) => {
    try {
      const board = await fs
        .readFile(path, { encoding: 'utf8' })
        .then((s) => JSON.parse(s) as Board);
      await updateRecentBoards({ path, name: board.name }, false);
      // fill in some values that might be missing
      board.markerColor = board.markerColor ?? '#ff0000';
      board.markerSize = board.markerSize ?? 10;
      return okResult(board);
    } catch (error: any) {
      console.log(error.stac);
      if (error.code === 'ENOENT') {
        await updateRecentBoards({ path, name: null }, false);
        return clientErrorResult(
          'The selected board no longer exists (file moved or deleted?)'
        );
      }
      return apiErrorResult(error);
    }
  });
  ipcMain.handle(FileApiChannels.ReportOpen, (event: any, path: string) =>
    reportOpen(path)
  );
  ipcMain.on(FileApiChannels.ReportOpenFromFile, async () => {
    logger.info('Called open log file');
    const selection = await dialog.showOpenDialog(_window!, {
      title: 'Select a log file',
    });
    if (selection.canceled || selection.filePaths.length == 0) {
      return null;
    }
    const path = selection.filePaths[0];
    const stats = await fs.stat(path);
    const file: LogFile = {
      date: stats?.birthtime.toISOString(),
      path,
      fileName: libpath.basename(path),
    };
    logger.info(file);
    _window?.webContents.send(FileApiChannels.ReportPickUp, file);
  });
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
