import { useMemo, useState } from 'react';
import { Board, Component } from '../../../model/Board';
import { Toolbar } from './Toolbar';
import { BoardRenderer, Layout } from './BoardRenderer';

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
        container={{ className: 'w-100 h-100' }}
      />
    </div>
  );
}
