import { useFieldArray, useFormContext } from 'react-hook-form';
import { Component, defaultComponent } from '../../model/Board';
import { CsvImporter } from '../CsvImporter';
import { ComponentTableRow } from './ComponentTableRow';
import { Virtuoso } from 'react-virtuoso';

export interface ComponentTableProps {
  name: string;
}

export function ComponentTable({ name }: ComponentTableProps) {
  const { control, register, setValue } = useFormContext();
  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
    {
      control, // control props comes from useForm (optional: if you are using FormContext)
      name: `${name}.components`, // unique name for your Field Array
      keyName: 'fieldKey',
    }
  );
  const onCvsImported = (components: Component[]) => {
    append(components);
  };
  return (
    <div className={'col-12'}>
      <div
        className={'d-flex justify-content-between align-items-baseline mb-1'}
      >
        <div className={'h5 mb-0'}>Components</div>
        <CsvImporter onLoad={onCvsImported} />
      </div>
      <div className={'list-group'}>
        <div className={'list-group-item p-0'}>
          <div className={'d-flex justify-content-evenly'}>
            <div className={'text-center border-1 border-light flex-fill'}>
              Id
            </div>
            <div className={'text-center border-1 border-light flex-fill'}>
              X
            </div>
            <div className={'text-center border-1 border-light flex-fill'}>
              Y
            </div>
            <div
              className={'text-center border-1 border-light'}
              style={{ width: 32 }}
            >
              ...
            </div>
          </div>
        </div>
        {fields.length == 0 && (
          <div className={'list-group-item py-4 px-2 text-center'}>
            Empty list
          </div>
        )}
        {fields.length > 0 &&
          <Virtuoso style={{height: 200}}
                    totalCount={fields.length}
                    itemContent={(index) =>{
                      return <ComponentTableRow key={fields[index].fieldKey} index={index} name={name} onDelete={() => remove(index)}/>
                    }}
          />
          }
      </div>
      <button
        className={'btn btn-secondary'}
        type={'button'}
        onClick={() => append(defaultComponent)}
      >
        +
      </button>
    </div>
  );
}
