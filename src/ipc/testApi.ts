import { BrowserWindow, ipcMain, ipcRenderer } from 'electron';
import { ApiHandler } from './apiHandler';

export interface TestApi {
  setTitle(title: string): void;
}

export const testApiHandler: TestApi & ApiHandler = {
  setTitle: (title: string) => {
    ipcRenderer.send('set-title', title);
  },

  register: () => {
    ipcMain.on('set-title', (event, title) => {
      const webContents = event.sender;
      const win = BrowserWindow.fromWebContents(webContents)!;
      win.setTitle(title);
    });
  },
};
