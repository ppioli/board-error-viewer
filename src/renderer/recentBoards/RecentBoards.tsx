import { Link } from 'react-router-dom';
import { useApiCall } from '../useApiCall';
import { ErrorPage } from '../ErrorPage';
import { OpenBoardButton } from '../OpenBoardButton';
import { RecentBoardItem } from './RecentBoardItem';

export function RecentBoards() {
  const {
    result: recentBoards,
    loading,
    error
  } = useApiCall({
    call: window.electron.configApi.getRecentBoards
  });
  if (loading) {
    return null;
  }
  if (!recentBoards) {
    return <ErrorPage error={error!} />;
  }

  return (
    <div
      style={{
        minWidth: 800,
        minHeight: 600
      }}
    >
      <div className={'list-group border rounded overflow-auto h-100'}>
        {recentBoards.length === 0 && (
          <div
            className={'w-100 h-100 d-flex flex-column justify-content-center'}
          >
            <div className={'text-center align-middle text-muted'}>
              <h4>No recent boards</h4>
              <div>There are no recent boards. You can open or create one.</div>
            </div>
          </div>
        )}
        {recentBoards.map((rb, ix) => <RecentBoardItem key={ix} board={rb} />)}
      </div>
      <div className={'d-flex flex-row-reverse'}>
        <Link className={'btn btn-primary'} to={'/edit/create'}>
          Create
        </Link>
        <OpenBoardButton />
        <Link to={'/config'} className={'btn btn-secondary'}>
          Settings
        </Link>
      </div>
    </div>
  );
}

