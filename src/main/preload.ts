import { contextBridge, ipcRenderer } from 'electron';
import { testApiHandler } from '../ipc/testApi';
import { fileApiHandler } from '../ipc/FileApi';
import { configApiHandler } from 'ipc/ConfigApi';
import { excelApiHandler } from '../ipc/ExcelApi';

contextBridge.exposeInMainWorld('electron', {
  testApi: testApiHandler,
  fileApi: fileApiHandler,
  configApi: configApiHandler,
  excelApi: excelApiHandler,
});
