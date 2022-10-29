import { TestApi } from 'ipc/testApi';
import { FileApi } from '../ipc/fileApi';

declare global {
  interface Window {
    electron: {
      testApi: TestApi;
      fileApi: FileApi;
    };
  }
}
export {};
