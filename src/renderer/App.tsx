import { MemoryRouter as Router, Route, Routes } from 'react-router-dom';
import './App.scss';
import { BoardEditPage } from 'renderer/boardEdit/BoardEditPage';
import { LogViewerPage } from 'renderer/logViewer/LogViewerPage';
import { ConfigEditPage } from 'renderer/config/ConfigEditPage';
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
              <Route path={'/analysis/:path'} element={<LogViewerPage />} />
              <Route path={'/config'} element={<ConfigEditPage />} />
            </Routes>
          </Router>
        </div>
      </ToastContextProvider>
  );
}
