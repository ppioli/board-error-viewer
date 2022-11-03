import { Board } from '../model/Board';
import boardPlaceHolder from '../../assets/pcb-board.png';
import { useMemo } from 'react';

export interface BoardViewerProps {
  board: Board;
}
const MARKER_SIZE = 15;
export function BoardViewer({ board }: BoardViewerProps) {
  console.log(board);
  const { image, offset, components, scale } = board.layerTop;
  const boardImage = useMemo(
    () => (image.length === 0 ? boardPlaceHolder : image),
    [image]
  );

  return (
    <div style={{ position: 'relative' }}>
      <img
        alt={'board'}
        src={boardImage}
        style={{ width: '100%', height: 'auto', position: 'absolute' }}
      />
      <div
        style={{
          position: 'absolute',
          border: '1px solid black',
          left: offset.x,
          top: offset.y,
        }}
      >
        <div style={{ position: 'relative' }}>
          {components.map((c, ix) => (
            <div
              key={c.id}
              style={{
                width: 19,
                height: 19,
                backgroundColor: 'red',
                position: 'absolute',
                left: c.position.x,
                top: c.position.y,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
