import { useFormContext } from 'react-hook-form';

export interface TableComponentRowProps {
  index: number;
  name: string;
  onDelete: () => void
}

export function ComponentTableRow({index, name, onDelete}: TableComponentRowProps) {
  const { register } = useFormContext();
  console.log('Something')
  return (
    <div className={'list-group-item p-0'}>
      <div className={'d-flex justify-content-evenly'}>
          <input
            {...register(`${name}.components.${index}.id`)}
            className={'form-control'}
          />
          <input
            {...register(`${name}.components.${index}.position.x`, {
              valueAsNumber: true
            })}
            className={'form-control'}
          />
          <input
            className={'form-control'}
            {...register(`${name}.components.${index}.position.y`, {
              valueAsNumber: true
            })}
          />
          <button
            className={'btn btn-danger'}
            onClick={onDelete}
          >
            D
          </button>
      </div>
    </div>
  );
}
