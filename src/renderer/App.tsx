import { useEffect } from 'react';

import { MemoryRouter as Router, Route, Routes } from 'react-router-dom';
// import './App.css';
import "bootstrap/scss/bootstrap.scss"
import { Board } from '../ipc/fileApi';
import { BoardEdit } from './BoardEdit';
import IpcMainEvent = Electron.IpcMainEvent;

const Hello = () => {
  useEffect(() => {
    console.log('Test');
    window.electron.fileApi.onBoardOpen(
      (_event: IpcMainEvent, board: Board) => {
        console.log('value');
        console.log(board);
      }
    );

    window.electron.fileApi.onReportPickup((event: any, board: any) => {
      console.log(board);
    });
  }, []);
  return (
    <div>
      <BoardEdit />
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Hello />} />
      </Routes>
    </Router>
  );
}
