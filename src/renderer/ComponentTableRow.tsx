import { useFormContext } from 'react-hook-form';

export interface TableComponentRowProps {
  index: number;
  name: string;
  onDelete: () => void
}
export function ComponentTableRow({index, name, onDelete}: TableComponentRowProps) {
  const { register } = useFormContext();
  return (
    <div className={'list-group-item p-0'}>
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
              valueAsNumber: true
            })}
            className={'form-control'}
          />
        </div>
        <div className={'text-center border-1 border-light'}>
          <input
            className={'form-control'}
            {...register(`${name}.components.${index}.position.y`, {
              valueAsNumber: true
            })}
          />
        </div>
        <div className={'text-center border-1 border-light'}>
          <button
            className={'btn btn-danger'}
            onClick={onDelete}
          >
            D
          </button>
        </div>
      </div>
    </div>
  );
}
