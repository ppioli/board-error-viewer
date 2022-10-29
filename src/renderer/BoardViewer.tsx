import { Board } from '../model/Board';

export interface BoardViewerProps {
  board: Board;
}

export function BoardViewer({ board }: BoardViewerProps) {
  console.log(board)
  const layer = board.layerTop;
  return (
    <div>
      <img
        alt={'board'}
        src={board.layerTop.image}
        style={{ width: '100%', height: 'auto' }}
      />
      <div style={{ position: 'relative' }}>
        <div
          style={{
            position: 'absolute',
            left: layer.offset.x,
            top: layer.offset.y,
          }}
        >
          <div style={{ position: 'relative' }}>
            {layer.components.map((c, ix) => (
              <div
                key={ix}
                style={{
                  width: 19,
                  height: 19,
                  backgroundColor: 'red',
                  position: 'absolute',
                  left: c.position.x,
                  top: c.position.y,
                }}
              ></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
