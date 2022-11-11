import { useController } from 'react-hook-form';

export function FlipControl({ name }: { name: string }) {
  const {
    field: { value: x, onChange: setX }
  } = useController({
    name: `${name}.x`
  });

  const {
    field: { value: y, onChange: setY }
  } = useController({
    name: `${name}.y`
  });
  return (
    <>
      <button
        className={'btn btn-primary'}
        type={'button'}
        onClick={() => setX(-x)}
      >
        Flip X
      </button>
      <button
        className={'btn btn-primary'}
        type={'button'}
        onClick={() => setY(-y)}
      >
        Flip Y
      </button>
    </>
  );
}
