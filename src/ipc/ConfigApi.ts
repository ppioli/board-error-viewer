import { Config } from 'model/Config';
import { RecentBoard } from 'model/RecentBoard';
import { ipcRenderer } from 'electron';
import { ApiResult } from '../model/ApiResult';

export enum ConfigApiChannels {
  ConfigGet = 'ConfigGet',
  ConfigUpdate = 'ConfigUpdate',
  RecentBoards = 'RecentBoards',
  RecentBoardRemove = 'recent-board-remove',
}

export interface ConfigApi {
  getConfig(): Promise<ApiResult<Config>>;
  getRecentBoards(): Promise<ApiResult<RecentBoard[]>>;
  updateConfig(config: Config): Promise<Error | null>;
  removeRecentBoard(path: string): Promise<ApiResult<string>>
}

export const configApiHandler: ConfigApi = {
  getConfig(): Promise<ApiResult<Config>> {
    return ipcRenderer.invoke(ConfigApiChannels.ConfigGet);
  },
  getRecentBoards(): Promise<ApiResult<RecentBoard[]>> {
    return ipcRenderer.invoke(ConfigApiChannels.RecentBoards);
  },
  updateConfig(config: Config): Promise<Error | null> {
    return ipcRenderer.invoke(ConfigApiChannels.ConfigUpdate, config);
  },
  removeRecentBoard(path: string): Promise<ApiResult<string>> {
    return ipcRenderer.invoke(ConfigApiChannels.RecentBoardRemove, path)
  },
};
