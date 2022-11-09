import { useFormContext } from 'react-hook-form';
import { defaultLayer } from 'model/Board';
import { LayerEdit } from 'renderer/LayerEdit';
export interface LayerToggleProps {
  name: string;
}
export function LayerToggle({ name }: LayerToggleProps) {
  const { watch, setValue } = useFormContext();
  const currentValue = watch(name);
  const handleToggleBottomLayer = () => {
    setValue('layerBottom', currentValue === null ? defaultLayer : null);
  };
  return (
    <div className={'col-12'}>
      <div className="form-check form-switch">
        <input
          className="form-check-input"
          type="checkbox"
          role="switch"
          id={'bottom-layer-switch'}
          checked={currentValue !== null}
          onClick={handleToggleBottomLayer}
        />
        <label className="form-check-label" htmlFor={'bottom-layer-switch'}>
          Enable bottom layer
        </label>
      </div>
      {currentValue !== null && <LayerEdit name={name} />}
    </div>
  );
}
