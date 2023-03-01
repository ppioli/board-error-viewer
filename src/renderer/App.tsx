import { MemoryRouter as Router, Route, Routes } from 'react-router-dom';
import './App.scss';
import './i18n/config';
import { BoardEditPage } from 'renderer/boardEdit/BoardEditPage';
import { LogViewerPage } from 'renderer/logViewer/LogViewerPage';
import { ConfigEditPage } from 'renderer/config/ConfigEditPage';
import { Home } from 'renderer/Home';
import { ToastContextProvider } from './toast/ToastContextProvider';
import { Provider } from 'react-redux';
import store from './store';

export default function App() {
  return (
    <Provider store={store}>
      <ToastContextProvider>
        <div className={'container-fluid'}>
          <Router>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/edit" element={<BoardEditPage />} />
              <Route path={'/analysis'} element={<LogViewerPage />} />
              <Route path={'/config'} element={<ConfigEditPage />} />
            </Routes>
          </Router>
        </div>
      </ToastContextProvider>
    </Provider>
  );
}
