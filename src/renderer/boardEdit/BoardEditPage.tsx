import { BoardEditPreview } from '../components/boardRenderer/BoardEditPreview';
import { BoardForm } from './BoardEdit';

export function BoardEditPage() {

  return (
    <div className={'d-flex'}>
      <div style={{ width: 400 }}>
        <BoardForm />
      </div>
      <div className={'flex-fill'}>
        <BoardEditPreview />
      </div>
    </div>
  );
}
