import { Board } from 'model/Board';
import { EventHandler, useEffect, useState } from 'react';
import { ApiError, ClientError } from '../../model/ApiError';
import classNames from 'classnames';
import { ExcelReaderResult } from '../../main/excel/excelReaderResult';
import { ErrorPage } from '../ErrorPage';

export interface ExcelImporterProps {
  onLoad: (board: Board) => void;
}

export function ExcelImporter({ onLoad }: ExcelImporterProps) {
  // read from a file
  const [error, setError] = useState<ApiError | ClientError | null>();
  const [result, setResult] = useState<ExcelReaderResult | null>(null);
  const importCsvFile: EventHandler<any> = () => {
    window.electron.excelApi.openBoardDefinition().then((payload) => {
      console.log(payload);
      if (payload.error) {
        setError(payload.error);
      } else {
        setResult(payload.result);
        if (payload.result?.board) {
          onLoad(payload.result?.board);
        }
      }
    });
  };

  if (error) {
    return <ErrorPage error={error} />;
  }
  return (
    <>
      <ImportResultModal result={result} />
      <button
        className={'btn btn-link p-0'}
        type={'button'}
        onClick={importCsvFile}
      >
        Import definition from excel
      </button>
    </>
  );
}

interface ImportResultModalProps {
  result: ExcelReaderResult | null;
}

export function ImportResultModal({ result }: ImportResultModalProps) {
  const [data, setData] = useState<ExcelReaderResult | null>(null);
  useEffect(() => {
    setData(result);
  }, [result]);
  const visible = data !== null;
  if (data === null) {
    return null;
  }
  const hasError = data.errors.length > 0;
  const componentCount =
    (data.board?.layerTop.components.length ?? 0) +
    (data.board?.layerBottom?.components.length ?? 0);
  return (
    <div
      className={classNames('modal modal-lg', {
        'd-block': visible,
        fade: !visible,
      })}
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5">
              {hasError ? 'Error' : 'Success'}
            </h1>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              onClick={() => setData(null)}
            ></button>
          </div>
          <div className="modal-body">
            {hasError ? (
              <>
                {data.errors.length} errors were encountered while processing
                the file.
                <table className="table table-striped border border-dark">
                  <tbody>
                    {data.errors.map((e) => (
                      <tr>
                        <th>
                          {( e.col && e.row ) &&<> Row:{e.row}, Col:{e.col}</>}
                        </th>
                        <td className={'pre'}>{e.message}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            ) : (
              <>
                The file was read successfully. <em>{componentCount}</em>{' '}
                components were imported.
              </>
            )}
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
              onClick={() => setData(null)}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
