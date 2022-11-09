import { contextBridge, ipcRenderer } from 'electron';
import { testApiHandler } from '../ipc/testApi';
import { fileApiHandler } from '../ipc/FileApi';
import { configApiHandler } from 'ipc/ConfigApi';

contextBridge.exposeInMainWorld('electron', {
  testApi: testApiHandler,
  fileApi: fileApiHandler,
  configApi: configApiHandler,
});
