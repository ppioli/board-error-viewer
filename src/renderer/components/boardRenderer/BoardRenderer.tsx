import { LayerRenderer } from './LayerRenderer';
import { Board, Component } from '../../../model/Board';
import { BoardPlaceholder } from '../../boardEdit/BoardPlaceholder';
import classNames from 'classnames';
import { HTMLProps } from 'react';

export interface BoardRendererProps {
  board: Board;
  layout?: Layout;
  showLabel?: boolean;
  container?: HTMLProps<HTMLDivElement>;
  filter?: (component: Component) => boolean;
}

export type Layout = 'TOP' | 'BOTTOM' | 'VERTICAL' | 'HORIZONTAL';

export function BoardRenderer({
  board,
  filter,
  layout,
  showLabel = false,
  container = {},
}: BoardRendererProps) {
  // TODO Handle id repetition
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
