import { useController } from 'react-hook-form';
export function RotationControl({ name }: { name: string }) {
  const {
    field: { value, onChange },
  } = useController({
    name,
  });

  const handleChange = (delta: number) => {
    let result = value + delta;
    if( result < 0 ) {
      result += 360;
    }
    onChange(result % 360);
  }
  return (
    <>
      <button
        className={'btn btn-primary btn-block'}
        type={'button'}
        onClick={() => handleChange(-90)}
      >
        <i className="bi bi-arrow-clockwise"></i>
      </button>
      <button
        className={'btn btn-primary'}
        type={'button'}
        onClick={() => handleChange(90)}
      >
        <i className="bi bi-arrow-counterclockwise"></i>
      </button>
    </>
  );
}
