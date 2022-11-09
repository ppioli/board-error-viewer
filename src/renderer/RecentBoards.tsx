import { Link, useNavigate } from 'react-router-dom';
import { useApiCall } from './useApiCall';
import { ErrorPage } from './ErrorPage';
import { OpenBoardButton } from './OpenBoardButton';

export function RecentBoards() {
  const navigate = useNavigate();
  const openBoard = (path: string) => {
    navigate('/analysis/' + encodeURIComponent(path));
  };
  const {
    result: recentBoards,
    loading,
    error,
  } = useApiCall({
    call: window.electron.configApi.getRecentBoards,
  });
  if (loading) {
    return null;
  }
  if (!recentBoards) {
    return <ErrorPage error={error!} />;
  }
  console.log(recentBoards);
  return (
    <div
      style={{
        minWidth: 800,
        minHeight: 600,
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
        {recentBoards.map((rb) => (
          <div
            className={'list-group-item list-group-item-action'}
            key={rb.path}
            onClick={() => openBoard(rb.path)}
          >
            <div className={'h4'}>{rb.name}</div>
            <div className={'text-muted'}>{rb.path}</div>
          </div>
        ))}
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
