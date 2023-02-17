import { BrowserWindow, dialog, ipcMain } from 'electron';
import { apiErrorResult, okResult } from '../model/ApiResult';
import { ExcelApiChannels } from '../ipc/ExcelApi';
import { default as Excel } from 'exceljs';
import { defaultReader } from './excel/defaultExcelParser';

let _window: BrowserWindow | null = null;

export function registerExcelApi(window: BrowserWindow) {
  _window = window;
  ipcMain.handle(ExcelApiChannels.OpenBoardDefinition, async () => {
    try {
      const path = await dialog
        .showOpenDialog(_window!, {
          title: 'Select the board definition file',
          properties: ['openFile'],
          filters: [{name: 'Worksheet',extensions: [ 'xlsx' ]}]
        })
        .then((selection) => {
          if (selection.canceled || selection.filePaths.length == 0) {
            return null;
          }
          return selection.filePaths[0];
        });

      if (path === null) {
        return okResult(null);
      }
      const workbook = new Excel.Workbook();
      const file = await workbook.xlsx.readFile(path);

      return okResult(defaultReader.parse(file));
    } catch (err) {
      return apiErrorResult(err);
    }
  });
}

