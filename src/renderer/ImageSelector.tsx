import { ChangeEvent, useRef } from 'react';
import { useController, useFormContext } from 'react-hook-form';
import { Image as IImage } from '../model/Board';

export interface ImageSelectorProps {
  name: string;
}

export function ImageSelector({ name }: ImageSelectorProps) {
  const {
    field: { onChange, value },
  } = useController({
    name,
  });
  const hasImage = value && value.length > 0;
  const filePickerRef = useRef<HTMLInputElement | null>(null);
  const updateImage = (event: ChangeEvent<any>) => {
    //todo weird behaviour when selecting the same image
    const { files } = event.target;
    if (files.length === 0) {
      return;
    }
    const file = files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      const img = new Image();
      img.onload = () => {
        const result: IImage = {
          width: img.width,
          height: img.height,
          data: reader.result!.toString(),
        };
        console.log(result);
        onChange(result);
      };
      img.src = reader.result!.toString();
    };
    reader.readAsDataURL(file);
  };
  return (
    <div>
      <h5>Image</h5>
      <div>
        <button
          type={'button'}
          className={'btn btn-secondary'}
          onClick={() => filePickerRef.current!.click()}
        >
          {hasImage ? 'Change image' : 'Select image'}
        </button>
        <button
          type={'button'}
          className={'btn btn-secondary'}
          onClick={() => onChange('')}
        >
          Delete
        </button>
      </div>
      <input
        className={'d-none'}
        ref={filePickerRef}
        type="file"
        id="avatar"
        name="avatar"
        accept="image/png, image/jpeg"
        onChange={updateImage}
      />
    </div>
  );
}
