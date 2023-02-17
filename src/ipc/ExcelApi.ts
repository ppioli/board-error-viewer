import { ipcRenderer } from 'electron';
import { ApiResult } from '../model/ApiResult';
import { Board } from '../model/Board';
import { ExcelReaderResult } from '../main/excel/excelReaderResult';

export enum ExcelApiChannels {
  OpenBoardDefinition = 'OpenFile',
}

export interface ExcelApi {
  openBoardDefinition(): Promise<ApiResult<ExcelReaderResult | null>>;
}

export const excelApiHandler: ExcelApi = {
  openBoardDefinition(): Promise<ApiResult<ExcelReaderResult | null>> {
    return ipcRenderer.invoke(ExcelApiChannels.OpenBoardDefinition);
  },
};
