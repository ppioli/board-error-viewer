import { ExcelReader } from './excelReader';
import { ExcelReaderError } from './excelReaderError';
import { ExcelReaderResult } from './excelReaderResult';
import { Board, Component, defaultBoard, defaultLayer } from '../../model/Board';

const ID_COL = 2;
const X_COL = 7;
const Y_COL = 8;
const P_COL = 5;


export const defaultReader: ExcelReader = {
  parse(book): ExcelReaderResult {
    const errors: ExcelReaderError[] = [];
    const sheet = book.worksheets[0];
    if( !sheet ) {
      errors.push({message: 'Cannot open the first sheet of the provided excel file'})
    }
    const result: Board = defaultBoard();
    // Start reading all rows. Skip first row ( header )
    sheet.getRows(2, sheet.rowCount-1)?.forEach( ( row, ix ) => {

      // ID COL
      const pid = row.getCell(ID_COL).value;
      if(typeof pid != 'string') {
        errors.push({
          col: ID_COL,
          row: ix+2,
          message: `${pid} is not a valid identifier`
        })
      }

     //  X COL
      const px = row.getCell(X_COL).value;
      if(typeof px != 'number') {
        errors.push({
          col: X_COL,
          row: ix+2,
          message: `${px} is not a valid number`
        })
      }

      // Y COL
      const py = row.getCell(Y_COL).value;
      if(typeof px != 'number') {
        errors.push({
          col: Y_COL,
          row: ix+2,
          message: `#{py} is not a valid number`
        })
      }

      // POS COL
      const ppos = row.getCell(P_COL).value;
      if( typeof ppos !== 'string' || !['Top', 'Bottom'].includes(ppos)){
        errors.push({
          col: P_COL,
          row: ix+2,
          message: `${ppos} invalid position. Expected "TOP" or "BOTTOM"`,
        })
      }
      const component : Component = {
        position: {
          x:px as number,
          y:py as number,
        },
        id: pid as string
      }
      if( ppos == 'Bottom'){
        if( result.layerBottom == null ) {
          result.layerBottom = defaultLayer()
        }
        result.layerBottom.components.push(component)
      } else {
        if( result.layerTop == null ) {
          result.layerTop = defaultLayer()
        }
        result.layerTop.components.push(component)
      }
    });
    return { errors, board: result }
  },
};
