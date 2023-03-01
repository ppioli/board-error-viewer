import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Board, defaultBoard } from 'model/Board';
import { BoardForm } from 'renderer/boardEdit/BoardEdit';
import { BoardEditPreview } from '../components/boardRenderer/BoardEditPreview';

export function BoardEditPage() {
  const { path } = useParams();
  const [board, setBoard] = useState<Board | null>(null);

  useEffect(() => {
    if (!path || path === 'create') {
      setBoard(defaultBoard);
      return;
    }
    window.electron.fileApi.boardOpen(path).then(({ result }) => {
      setBoard(result!);
    });
  }, [path]);

  if (board === null) {
    return null;
  }
  return (
    <div className={'d-flex'}>
      <div style={{ width: 400 }}>
        <BoardForm board={board} onChange={setBoard} />
      </div>
      <div className={'flex-fill'}>
        <BoardEditPreview board={board} />
      </div>
    </div>
  );
}
