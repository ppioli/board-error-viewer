import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Board, defaultBoard } from 'model/Board';
import { BoardEdit } from 'renderer/BoardEdit';

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
    <div>
      <BoardEdit board={board} />
    </div>
  );
}
