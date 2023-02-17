import { useController, useFormContext } from 'react-hook-form';
import { defaultLayer } from 'model/Board';
import { LayerEdit } from 'renderer/boardEdit/LayerEdit';
import { ChangeEvent, useEffect, useState } from 'react';
export interface LayerToggleProps {
  name: string;
}
export function LayerToggle({ name }: LayerToggleProps) {
  const {
    field: { value, onChange },
  } = useController({
    name,
  });

  const handleToggleChange = (event: ChangeEvent<HTMLInputElement>) => {
    console.log(event.target.checked);
    onChange(event.target.checked ? defaultLayer : null);
  };

  return (
    <div className={'col-12'}>
      <div className="form-check form-switch">
        <input
          className="form-check-input"
          type="checkbox"
          role="switch"
          id={'bottom-layer-switch'}
          checked={value !== null}
          onChange={handleToggleChange}
        />
        <label className="form-check-label" htmlFor={'bottom-layer-switch'}>
          Enable bottom layer
        </label>
      </div>
      {value !== null && <LayerEdit name={name} />}
    </div>
  );
}
