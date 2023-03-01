import { LayerRenderer } from './LayerRenderer';
import { Board, Component } from '../../../model/Board';
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
  const { board, status, error } = useAppSelector((state) => state.board);
  const { layerTop, layerBottom } = board ?? {};
  return (
    <div {...container}>
      <div
        className={classNames('h-100 w-100 d-flex', {
          'flex-column': layout === 'VERTICAL',
          'flex-row': layout === 'HORIZONTAL',
        })}
      >
        <div style={{ flex: 1 }} className={'p-3 border border-dark'}>
          {layerTop ? (
            <LayerRenderer
              title={'Layer Top'}
              markerBuilder={markerBuilder}
              layer={layerTop}
              filter={filter}
              showLabel={showLabel}
            />
          ) : (
            <BoardPlaceholder />
          )}
        </div>
        {layerBottom && (
          <div style={{ flex: 1 }} className={'p-3 border border-dark'}>
            <LayerRenderer
              title={'Layer bottom'}
              markerBuilder={markerBuilder}
              layer={layerBottom}
              filter={filter}
              showLabel={showLabel}
            />
          </div>
        )}
      </div>
    </div>
  );
}
