import { useNavigate } from 'react-router-dom';
import { RecentBoard } from '../../model/RecentBoard';
import { MouseEventHandler, useState } from 'react';
import classNames from 'classnames';
import { useAppDispatch } from '../store';
import { removeRecentBoard } from './recentBoardSlice';
import { loadBoardThunk } from '../boardEdit/boardSlice';
interface RecentBoardItemProps {
  board: RecentBoard;
}
export function RecentBoardItem({ board }: RecentBoardItemProps) {
  const navigate = useNavigate();
  const [active, setActive] = useState(false);
  const dispatch = useAppDispatch();
  const openBoard = (path: string) => {
    dispatch(loadBoardThunk(path));
    navigate('/edit');
  };

  const handleMouseOver: MouseEventHandler<HTMLDivElement> = (event) => {
    if (event.type === 'mouseleave') {
      setActive(false);
    } else if (event.type === 'mouseenter') {
      setActive(true);
    }
  };

  const onRemove: MouseEventHandler<HTMLButtonElement> = (event) => {
    event.stopPropagation();
    dispatch(removeRecentBoard(board.path));
  };

  const boardAvailable = board.name !== null;
  return (
    <div
      onMouseEnter={handleMouseOver}
      onMouseLeave={handleMouseOver}
      className={'list-group-item list-group-item-action d-flex'}
      key={board.path}
      onClick={() => openBoard(board.path)}
    >
      <div className={'flex-fill'}>
        <div className={'h4'}>
          {boardAvailable ? board.name : '<Board Not Found>'}
        </div>
        <div className={'text-muted'}>
          {boardAvailable
            ? board.path
            : `Board saved file is missing (Maybe it was moved or deleted?)`}
        </div>
      </div>
      <button
        type={'button'}
        onClick={onRemove}
        className={classNames('btn btn-danger', {
          invisible: !active,
        })}
      >
        <i className={'bi-trash'}></i>
      </button>
    </div>
  );
}
