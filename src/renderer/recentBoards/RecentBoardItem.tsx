import { useNavigate } from 'react-router-dom';
import { RecentBoard } from '../../model/RecentBoard';
import { MouseEventHandler, useState } from 'react';
import classNames from 'classnames';
interface RecentBoardItemProps {
  board: RecentBoard,
  removeBoard: (path: string) => void;
}
export function RecentBoardItem( {board, removeBoard} : RecentBoardItemProps) {
  const navigate = useNavigate();
  const [active, setActive] = useState(false)
  const openBoard = (path: string) => {
    navigate('/analysis/' + encodeURIComponent(path));
  };

  const handleMouseOver: MouseEventHandler<HTMLDivElement> = (event) => {
    if( event.type === 'mouseleave'){
      setActive(false)
    } else if ( event.type === 'mouseenter'){
      setActive(true)
    }
  }

  const onRemove: MouseEventHandler<HTMLButtonElement> = ( event ) => {
    event.stopPropagation();
    removeBoard(board.path);
  }
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
        <div className={'h4'}>{boardAvailable ?board.name : "<Board Not Found>"}</div>
        <div className={'text-muted'}>{boardAvailable ? board.path : `Board saved file is missing (Maybe it was moved or deleted?)`}</div>
      </div>
      <button type={'button'} onClick={onRemove} className={classNames('btn btn-danger', {
        'invisible': !active
      })}>
        <i className={'bi-trash'}></i>
      </button>
    </div>
  );
}
