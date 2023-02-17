import { TestApi } from 'ipc/testApi';
import { FileApi } from '../ipc/FileApi';
import { ConfigApi } from 'ipc/ConfigApi';
import { ExcelApi } from '../ipc/ExcelApi';

declare global {
  interface Window {
    electron: {
      testApi: TestApi;
      fileApi: FileApi;
      configApi: ConfigApi;
      excelApi: ExcelApi;
    };
  }
}
export {};
