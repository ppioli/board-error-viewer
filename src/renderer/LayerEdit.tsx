import { useController, useFieldArray, useFormContext } from 'react-hook-form';
import { Component, defaultComponent } from '../model/Board';
import { ImageSelector } from 'renderer/ImageSelector';
import { CsvImporter } from 'renderer/CsvImporter';
import { ComponentTable } from './ComponentTable';

export interface LayerEditProps {
  name: string;
}
export function RotationControl({ name }: { name: string }) {
  const {
    field: { value, onChange },
  } = useController({
    name,
  });

  return (
    <>
      <button
        className={'btn btn-primary'}
        type={'button'}
        onClick={() => onChange(value - 90)}
      >
        Rotate Left
      </button>
      <button
        className={'btn btn-primary'}
        type={'button'}
        onClick={() => onChange(value + 90)}
      >
        Rotate Right
      </button>
    </>
  );
}
export function LayerEdit({ name }: LayerEditProps) {
  const { control, register, setValue } = useFormContext();
  return (
    <>
      <ImageSelector name={`${name}.image`} />
      <RotationControl name={`${name}.rotation`} />
      <div className={'col-6'}>
        <label>Offset X</label>
        <input
          type={'number'}
          className={'form-control'}
          step={'any'}
          {...register(`${name}.offset.x`, { valueAsNumber: true })}
        />
      </div>
      <div className={'col-6'}>
        <label>Offset Y</label>
        <input
          type={'number'}
          className={'form-control'}
          step={'any'}
          {...register(`${name}.offset.y`, { valueAsNumber: true })}
        />
      </div>
      <div className={'col-6'}>
        <label>Scale X</label>
        <input
          type={'number'}
          className={'form-control'}
          step={'any'}
          {...register(`${name}.scale.x`, { valueAsNumber: true })}
        />
      </div>
      <div className={'col-6'}>
        <label>Scale Y</label>
        <input
          type={'number'}
          className={'form-control'}
          step={'any'}
          {...register(`${name}.scale.y`, { valueAsNumber: true })}
        />
      </div>
      <ComponentTable name={name} />
    </>
  );
}
