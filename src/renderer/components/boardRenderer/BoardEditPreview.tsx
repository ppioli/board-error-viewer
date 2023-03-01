import { useCallback, useMemo, useState } from 'react';
import { Board, Component } from '../../../model/Board';
import { Toolbar } from './Toolbar';
import { BoardRenderer, Layout } from './BoardRenderer';
import { ComponentMarkerProps } from './ComponentMarker';

export interface BoardEditPreviewProps {
  board?: Board;
}

export function BoardEditPreview({ board }: BoardEditPreviewProps) {
  const [layout, setLayout] = useState<Layout>('HORIZONTAL');
  const [filter, setFilter] = useState<string>('');
  const [showLabels, setShowLabels] = useState<boolean>(false);

  const filterFunc = useMemo(() => {
    if (filter == undefined || filter === '') {
      return undefined;
    }
    return (comp: Component) => comp.id.includes(filter);
  }, [filter]);

  if (!board) {
    // TODO Return a better placeholder
    return null;
  }

  const markerBuilder = useCallback((marker: ComponentMarkerProps) => {
    const { x, y } = marker.component.position;
    return {
      ...marker,
      message: [`X=${x} Y=${y}`],
    };
  }, []);

  return (
    <div className={'vh-100'}>
      <Toolbar
        onLayoutChange={setLayout}
        onFilterChange={setFilter}
        onLabelChange={setShowLabels}
        showLabels={showLabels}
        layout={layout}
      />
      <BoardRenderer
        board={board}
        filter={filterFunc}
        layout={layout}
        showLabel={showLabels}
        markerBuilder={markerBuilder}
        container={{ className: 'w-100 h-100' }}
      />
    </div>
  );
}
