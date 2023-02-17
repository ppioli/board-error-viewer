import { Board } from '../../model/Board';
import { ExcelReaderError } from './excelReaderError';

export interface ExcelReaderResult {
  board: Board | null;
  errors: ExcelReaderError[];
}
