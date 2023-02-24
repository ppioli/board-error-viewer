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
          <input
            {...register(`${name}.components.${index}.id`)}
            className={'form-control border'}
          />
          <input
            {...register(`${name}.components.${index}.position.x`, {
              valueAsNumber: true
            })}
            className={'form-control border text-end'}
          />
          <input
            className={'form-control border text-end'}
            {...register(`${name}.components.${index}.position.y`, {
              valueAsNumber: true
            })}
          />
          <button
            className={'btn btn-danger'}
            onClick={onDelete}
          >
            <i className={'bi bi-trash'} />
          </button>
      </div>
    </div>
  );
}
