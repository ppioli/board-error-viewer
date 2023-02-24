import { useFormContext } from 'react-hook-form';
import { ImageSelector } from 'renderer/ImageSelector';
import { ComponentTable } from './ComponentTable';
import { RotationControl } from './RotationControl';
import { FlipControl } from './FlipControl';

export interface LayerEditProps {
  name: string;
}

export function LayerEdit({ name }: LayerEditProps) {
  const { register } = useFormContext();
  return (
    <div style={{ height: '100%' }} className={'d-flex flex-column'}>
      <div className={'row mb-3'}>
        <div className="col-12">
          <ImageSelector name={`${name}.image`} />
        </div>
      </div>
      <h5>Position</h5>
      <div className={'row mb-3'}>
        <div className={'col-4 d-flex flex-column'}>
          <label>Origin</label>
          <div
            className={'flex-fill'}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              alignContent: 'stretch',
              justifyContent: 'stretch',
            }}
          >
            <RotationControl name={`${name}.rotation`} />
            <FlipControl name={`${name}.flip`} />
          </div>
        </div>
        <div className={'col-8'}>
          <div className={'row'}>
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
          </div>
        </div>
      </div>
      <div className={'row flex-fill'}>
        <div className={'col-12'}>
          <ComponentTable name={name} />
        </div>
      </div>
    </div>
  );
}
