import { Component } from 'model/Board';
import { ChangeEvent, useRef } from 'react';

export interface CsvImporterProps {
  onLoad: (components: Component[]) => void;
}
export function CsvImporter({ onLoad }: CsvImporterProps) {
  const csvFileRef = useRef<HTMLInputElement | null>(null);
  const importCsvFile = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files?.length) {
      return;
    }
    const fileReader = new FileReader();
    console.log('done');
    fileReader.onload = () => {
      // process loaded file
      debugger;
      const result: Component[] = [];
      const lines = (fileReader.result as string).split('\n');
      if (lines.length < 2) {
        return;
      }
      // start at line 1, skipping the header
      for (let ix = 1; ix < lines.length; ix++) {
        if (!lines[ix]) continue;
        const [id, sx, sy] = lines[ix].split(',');
        const x = parseFloat(sx);
        const y = parseFloat(sy);
        if (isNaN(x) || isNaN(y)) {
          throw new Error('X/Y are not valid numbers. Line ' + ix);
        }
        result.push({
          id,
          position: { x, y },
        });
      }
      console.log('done');
      onLoad(result);
    };
    fileReader.readAsBinaryString(files[0]);
    event.target.value = '';
  };
  return (
    <>
      <button
        className={'btn btn-secondary'}
        type={'button'}
        onClick={() => csvFileRef.current?.click()}
      >
        Import from CVS file
      </button>
      <input
        className={'d-none'}
        type={'file'}
        ref={csvFileRef}
        onChange={importCsvFile}
      />
    </>
  );
}
