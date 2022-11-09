import { MemoryRouter as Router, Route, Routes } from 'react-router-dom';
import 'bootswatch/dist/slate/bootstrap.min.css'; // Added this :boom:
import { BoardEditPage } from 'renderer/BoardEditPage';
import { AnalysisPage } from 'renderer/AnalysisPage';
import { ConfigEditPage } from 'renderer/ConfigEditPage';
import { Home } from 'renderer/Home';
import { ToastContextProvider } from './toast/ToastContextProvider';

export default function App() {
  return (
    <ToastContextProvider>
      <div className={'container-fluid'}>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/edit/:path" element={<BoardEditPage />} />
            <Route path={'/analysis/:path'} element={<AnalysisPage />} />
            <Route path={'/config'} element={<ConfigEditPage />} />
          </Routes>
        </Router>
      </div>
    </ToastContextProvider>
  );
}
