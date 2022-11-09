import { useNavigate } from 'react-router-dom';
import { ChangeEvent, useRef } from 'react';

export const OpenBoardButton = () => {
  const navigate = useNavigate();
  const ref = useRef<HTMLInputElement | null>(null);
  const onFilePicked = (evt: ChangeEvent<HTMLInputElement>) => {
    const files = evt.target.files;
    if (!files || files.length == 0) {
      return;
    }
    navigate('/analysis/' + encodeURIComponent(files[0].path));
    evt.target.value = '';
  };
  return (
    <>
      <button
        className={'btn btn-primary'}
        onClick={() => ref.current!.click()}
      >
        Open
      </button>
      <input
        type={'file'}
        className={'d-none'}
        accept={'.bew'}
        onChange={onFilePicked}
        ref={ref}
      />
    </>
  );
};
