import { app, BrowserWindow, ipcMain } from 'electron';
import { ConfigApiChannels } from '../ipc/ConfigApi';
import path from 'path';
import fs from 'fs/promises';
import { Config, defaultConfig } from '../model/Config';
import { RecentBoard } from '../model/RecentBoard';
import { apiErrorResult, okResult } from '../model/ApiResult';

let _window: BrowserWindow | null = null;
const AppConfigDir = path.join(
  app.getPath('appData'),
  'dev-ppioli-boardErrorViewer'
);
const RecentBoardsFilePath = path.join(AppConfigDir, 'bew_recent_boards.json');
const ConfigFilePath = path.join(AppConfigDir, 'bew_config.json');
const ensureConfigDirExists = async () => {
  await fs.mkdir(AppConfigDir, {
    recursive: true,
  });
};
export const readRecentBoardFile = async (): Promise<RecentBoard[]> => {
  try {
    return await fs
      .readFile(RecentBoardsFilePath, { encoding: 'utf-8' })
      .then((data) => JSON.parse(data));
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      return [];
    }
    throw error;
  }
};
export const updateRecentBoards = async (
  board: RecentBoard,
  remove: boolean
) => {
  await ensureConfigDirExists();
  let recentBoards = await readRecentBoardFile();
  recentBoards = recentBoards.filter((b) => b.path !== board.path);
  if (!remove) {
    recentBoards.unshift(board);
  }
  console.log('called update boards', recentBoards);
  await fs.writeFile(RecentBoardsFilePath, JSON.stringify(recentBoards));
};

export async function readConfigFile(): Promise<Config> {
  try {
    return await fs
      .readFile(ConfigFilePath, { encoding: 'utf-8' })
      .then((fd) => JSON.parse(fd));
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      return defaultConfig;
    }
    throw error;
  }
}

export function registerConfigApi(window: BrowserWindow) {
  _window = window;
  ipcMain.handle(ConfigApiChannels.ConfigGet, async (event: any) => {
    try {
      const config = await readConfigFile();
      return okResult(config);
    } catch (error: any) {
      return apiErrorResult(error);
    }
  });
  ipcMain.handle(ConfigApiChannels.RecentBoards, async (event: any) => {
    try {
      const files = await readRecentBoardFile();
      return okResult(files);
    } catch (error: any) {
      return apiErrorResult(error);
    }
  });
  ipcMain.handle(
    ConfigApiChannels.ConfigUpdate,
    async (evt: any, config: Config) => {
      try {
        await ensureConfigDirExists();
        await fs.writeFile(ConfigFilePath, JSON.stringify(config));
        return null;
      } catch (err) {
        return apiErrorResult(err)
      }
    }
  );
}
