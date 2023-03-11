import { useCallback, useMemo, useState } from 'react';
import { Board, Component } from '../../../model/Board';
import { Toolbar } from './Toolbar';
import { BoardRenderer, Layout } from './BoardRenderer';
import { ComponentMarkerProps } from './ComponentMarker';
import { useAppSelector } from '../../store';


export function BoardEditPreview() {
  const [layout, setLayout] = useState<Layout>('HORIZONTAL');
  const [filter, setFilter] = useState<string>('');
  const [showLabels, setShowLabels] = useState<boolean>(false);

  const filterFunc = useMemo(() => {
    if (filter == undefined || filter === '') {
      return undefined;
    }
    return (comp: Component) => comp.id.includes(filter);
  }, [filter]);


  const markerBuilder = useCallback((marker: ComponentMarkerProps) => {
    return {
      ...marker,
      message: [`Palceholder`],
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
        filter={filterFunc}
        layout={layout}
        showLabel={showLabels}
        markerBuilder={markerBuilder}
        container={{ className: 'w-100 h-100' }}
      />
    </div>
  );
}
