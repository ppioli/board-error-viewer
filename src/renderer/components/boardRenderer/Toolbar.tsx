import { SearchBar } from '../Seachbar';
import { Layout } from './BoardRenderer';
import classNames from 'classnames';

export interface ToolbarProps {
  showLabels: boolean,
  layout: Layout,
  onLayoutChange: (layout: Layout) => void;
  onFilterChange: (keyword: string) => void;
  onLabelChange: (show: boolean) => void;
}

export function Toolbar({ layout, showLabels, onLayoutChange, onFilterChange, onLabelChange }: ToolbarProps) {
  return (
    <div style={{ position: 'relative', zIndex: 1000 }}>
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
        }}
        className={'d-flex justify-content-center'}
      >
        <div className={'bg-dark p-2 rounded d-flex'}>
          <SearchBar onChange={onFilterChange} />
          <button
            type={'button'}
            className={'btn btn-primary'}
            onClick={() => onLayoutChange('HORIZONTAL')}
          >
            <i className={'bi bi-layout-split'} />
          </button>
          <button
            type={'button'}
            className={'btn btn-primary'}
            onClick={() => onLayoutChange('VERTICAL')}
          >
            <i className={'bi bi-hr'} />
          </button>
          <button
            type={'button'}
            className={classNames('btn btn-primary', { 'active' : showLabels})}
            onClick={() => onLabelChange(!showLabels)}
          >
            <i className={'bi bi-tag'} />
          </button>
        </div>
      </div>
    </div>
  );
}
