import { contextBridge, ipcRenderer } from 'electron';
import { testApiHandler } from '../ipc/testApi';
import { fileApiHandler } from '../ipc/fileApi';

contextBridge.exposeInMainWorld('electron', {
  testApi: testApiHandler,
  fileApi: fileApiHandler,
});
