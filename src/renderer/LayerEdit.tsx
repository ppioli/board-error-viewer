import { useFieldArray, useFormContext } from 'react-hook-form';
import { Component, defaultComponent } from '../model/Board';
import { ImageSelector } from 'renderer/ImageSelector';
import { ChangeEvent, useEffect, useRef } from 'react';
import { CsvImporter } from 'renderer/CsvImporter';

export interface LayerEditProps {
  name: string;
}

export function LayerEdit({ name }: LayerEditProps) {
  const { control, register, setValue } = useFormContext();
  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
    {
      control, // control props comes from useForm (optional: if you are using FormContext)
      name: `${name}.components`, // unique name for your Field Array
      keyName: 'fieldId',
    }
  );
  const onCvsImported = (components: Component[]) => {
    append(components);
    console.log(components);
  };

  return (
    <div>
      <ImageSelector name={`${name}.image`} />
      <div className={'row'}>
        <div className={'col-6'}>
          <label>Offset X</label>
          <input
            type={'number'}
            className={'form-control'}
            {...register(`${name}.offset.x`, { valueAsNumber: true })}
          />
        </div>
        <div className={'col-6'}>
          <label>Offset Y</label>
          <input
            type={'number'}
            className={'form-control'}
            {...register(`${name}.offset.y`, { valueAsNumber: true })}
          />
        </div>
      </div>
      <div className={'row'}>
        <div className={'col-6'}>
          <label>Scale X</label>
          <input
            type={'number'}
            className={'form-control'}
            {...register(`${name}.scale.x`, { valueAsNumber: true })}
          />
        </div>
        <div className={'col-6'}>
          <label>Scale Y</label>
          <input
            type={'number'}
            className={'form-control'}
            {...register(`${name}.scale.y`, { valueAsNumber: true })}
          />
        </div>
      </div>
      <h5>Components</h5>
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
          fields.map((field, index) => (
            <div key={field.fieldId} className={'list-group-item p-0'}>
              <div className={'d-flex justify-content-evenly'}>
                <div className={'text-center border-1 border-light'}>
                  <input
                    {...register(`${name}.components.${index}.id`)}
                    className={'form-control'}
                  />
                </div>
                <div className={'text-center border-1 border-light'}>
                  <input
                    {...register(`${name}.components.${index}.position.x`, {
                      valueAsNumber: true,
                    })}
                    className={'form-control'}
                  />
                </div>
                <div className={'text-center border-1 border-light'}>
                  <input
                    className={'form-control'}
                    {...register(`${name}.components.${index}.position.y`, {
                      valueAsNumber: true,
                    })}
                  />
                </div>
                <div className={'text-center border-1 border-light'}>
                  <button
                    className={'btn btn-danger'}
                    onClick={() => remove(index)}
                  >
                    D
                  </button>
                </div>
              </div>
            </div>
          ))}
      </div>
      <button
        className={'btn btn-secondary'}
        type={'button'}
        onClick={() => append(defaultComponent)}
      >
        +
      </button>
      <CsvImporter onLoad={onCvsImported} />
    </div>
  );
}
