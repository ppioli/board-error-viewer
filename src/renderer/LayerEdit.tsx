import { useFieldArray, useFormContext } from 'react-hook-form';
import { Component, defaultComponent } from '../model/Board';
import { ImageSelector } from 'renderer/ImageSelector';
import { CsvImporter } from 'renderer/CsvImporter';
import { ComponentTable } from './ComponentTable';

export interface LayerEditProps {
  name: string;
}
export function LayerEdit({ name }: LayerEditProps) {

  const { control, register, setValue } = useFormContext();
  return (
    <>
      <ImageSelector name={`${name}.image`} />
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
      <ComponentTable name={name} />
    </>
  );
}
