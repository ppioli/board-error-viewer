import { ExcelReaderResult } from './excelReaderResult';
import { default as Excel } from 'exceljs'
export interface ExcelReader {
  parse(book: Excel.Workbook): ExcelReaderResult;
}
