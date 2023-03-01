import {
  ColorChangeHandler,
  SliderPicker,
  SliderPickerProps,
} from 'react-color';
import { useController } from 'react-hook-form';
import { FieldPath, FieldValues } from 'react-hook-form/dist/types';
import { useCallback, useState } from 'react';
import classNames from 'classnames';
import { SliderPickerStylesProps } from 'react-color/lib/components/slider/Slider';

export interface ColorPickerProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> {
  name: TName;
}

export function ColorPicker({ name }: ColorPickerProps) {
  const {
    field: { onChange, value },
  } = useController({
    name,
  });
  const [visible, setVisible] = useState(false);
  const handleChange = (color: string | null) => {
    setVisible(false);
    if (color !== null) {
      onChange(color);
    }
  };
  return (
    <div className={'d-grid'}>
      <button
        type={'button'}
        onClick={() => setVisible(true)}
        className={'btn btn-light'}
      >
        <div className={'d-flex align-items-center'}>
          <div className={'flex-fill text-center'}>{value}</div>
          <span
            style={{
              marginLeft: 10,
              backgroundColor: value,
              border: '1px solid white',
              width: 10,
              height: 10,
            }}
          />
        </div>
      </button>
      <div
        style={{ position: 'absolute' }}
        className={classNames({ 'd-none': !visible })}
      >
        <ColorPickerPopup
          onColorChange={handleChange}
          value={value}
          visible={visible}
        />
      </div>
    </div>
  );
}

interface ColorPickerPopupProps {
  onColorChange: (color: string | null) => void;
  value: string;
  visible: boolean;
}
function ColorPickerPopup({
  onColorChange,
  value,
  visible,
}: ColorPickerPopupProps) {
  const [color, setColor] = useState(value);
  const handleChangeComplete: ColorChangeHandler = useCallback((color) => {
    setColor(color.hex);
  }, []);

  return (
    <div
      className={classNames('card', {
        'd-none': !visible,
      })}
    >
      <div className={'card-body'}>
        <SliderPicker color={color} onChangeComplete={handleChangeComplete} />
      </div>
      <div className={'card-footer d-flex flex-row-reverse'}>
        <button
          type={'button'}
          onClick={() => onColorChange(color)}
          className={'btn btn-primary'}
        >
          Confirm
        </button>
        <button
          type={'button'}
          className={'btn btn-link'}
          onClick={() => onColorChange(null)}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
