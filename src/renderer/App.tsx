import { ChangeEvent, useEffect, useRef } from 'react';

import {
  Link,
  MemoryRouter as Router,
  Route,
  Routes,
  useNavigate,
} from 'react-router-dom';
import 'bootswatch/dist/slate/bootstrap.min.css'; // Added this :boom:
import { BoardEditPage } from 'renderer/BoardEditPage';
import { AnalysisPage } from 'renderer/AnalysisPage';

const Home = () => {
  const ref = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();
  const onFilePicked = (evt: ChangeEvent<HTMLInputElement>) => {
    const files = evt.target.files;
    if (!files || files.length == 0) {
      return;
    }
    navigate('/analysis/' + encodeURIComponent(files[0].path));
    evt.target.value = '';
  };
  return (
    <div>
      <button
        className={'btn btn-primary'}
        onClick={() => ref.current!.click()}
      >
        Open
      </button>
      <Link to={'/edit/create'}>Create</Link>
      <input
        type={'file'}
        className={'d-none'}
        onChange={onFilePicked}
        ref={ref}
      />
    </div>
  );
};

export default function App() {
  return (
    <div className={'container'}>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/edit/:path" element={<BoardEditPage />} />
          <Route path={'/analysis/:path'} element={<AnalysisPage />} />
        </Routes>
      </Router>
    </div>
  );
}
