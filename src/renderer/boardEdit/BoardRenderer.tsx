import { LayerRenderer } from '../LayerRenderer';
import { Board } from '../../model/Board';
import { BoardPlaceholder } from './BoardPlaceholder';
import classNames from 'classnames';
import { useState } from 'react';

export interface BoardRendererProps {
  board: Board;
}

export type Layout = 'TOP' | 'BOTTOM' | 'VERTICAL' | 'HORIZONTAL';

export function BoardRenderer({ board }: BoardRendererProps) {
  // TODO Handle id repetition
  const [layout, setLayout] = useState<Layout>('HORIZONTAL');
  const { name, layerTop, layerBottom } = board ?? {};
  return (
    <div className={'vh-100 card'}>
      <div className={'card-header'}>Board {name}</div>
      <div className={'card-body'}>
        <div style={{ position: 'relative', zIndex: 10000 }}>
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
            }}
            className={'d-flex justify-content-center'}
          >
            <button
              type={'button'}
              className={'btn btn-primary'}
              onClick={() => setLayout('HORIZONTAL')}
            >
              H
            </button>
            <button
              type={'button'}
              className={'btn btn-primary'}
              onClick={() => setLayout('VERTICAL')}
            >
              V
            </button>
          </div>
        </div>
        <div
          className={classNames('h-100 d-flex', {
            'flex-column': layout === 'VERTICAL',
            'flex-row': layout === 'HORIZONTAL',
          })}
        >
          <div style={{ flex: 1 }}>
            {layerTop ? (
              <LayerRenderer title={'Layer Top'} layer={layerTop} />
            ) : (
              <BoardPlaceholder />
            )}
          </div>
          <div style={{ flex: 1 }}>
            {layerBottom ? (
              <LayerRenderer title={'Layer bottom'} layer={layerBottom} />
            ) : (
              <BoardPlaceholder />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
