import { LayerRenderer } from './LayerRenderer';
import { Component } from '../../../model/Board';
import { BoardPlaceholder } from '../../boardEdit/BoardPlaceholder';
import classNames from 'classnames';
import { HTMLProps } from 'react';
import { ComponentMarkerProps } from './ComponentMarker';
import { useAppSelector } from '../../store';

export interface BoardRendererProps {
  layout?: Layout;
  showLabel?: boolean;
  container?: HTMLProps<HTMLDivElement>;
  filter?: (component: Component) => boolean;
  markerBuilder?: (marker: ComponentMarkerProps) => ComponentMarkerProps;
}

export type Layout = 'TOP' | 'BOTTOM' | 'VERTICAL' | 'HORIZONTAL';

export function BoardRenderer({
  filter,
  layout,
  showLabel = false,
  markerBuilder,
  container = {},
}: BoardRendererProps) {
  // TODO Handle id repetition
  return (
    <div {...container}>
      <div
        className={classNames('h-100 w-100 d-flex', {
          'flex-column': layout === 'VERTICAL',
          'flex-row': layout === 'HORIZONTAL',
        })}
      >
        <div style={{ flex: 1 }} className={'p-3 border border-dark'}>
            <LayerRenderer
              title={'Layer Top'}
              markerBuilder={markerBuilder}
              filter={filter}
              showLabel={showLabel}
            />
        </div>
          <div style={{ flex: 1 }} className={'p-3 border border-dark'}>
            <LayerRenderer
              title={'Layer bottom'}
              markerBuilder={markerBuilder}
              filter={filter}
              showLabel={showLabel}
            />
          </div>
      </div>
    </div>
  );
}
