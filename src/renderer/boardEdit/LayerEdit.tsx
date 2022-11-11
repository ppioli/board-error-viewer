import { useFormContext } from 'react-hook-form';
import { ImageSelector } from 'renderer/ImageSelector';
import { ComponentTable } from './ComponentTable';
import { RotationControl } from './RotationControl';
import { FlipControl } from './FlipControl';

export interface LayerEditProps {
  name: string;
}
export function LayerEdit({ name }: LayerEditProps) {
  const { control, register, setValue } = useFormContext();
  return (
    <>
      <ImageSelector name={`${name}.image`} />
      <div className={'d-flex'}>
        <RotationControl name={`${name}.rotation`} />
        <FlipControl name={`${name}.flip`} />
      </div>
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
