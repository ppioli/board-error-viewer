import logo from '../../assets/pcb-board.png';
import { RecentBoards } from './recentBoards/RecentBoards';

export const Home = () => {
  return (
    <div
      className={
        'd-flex flex-column justify-content-center align-items-center vh-100'
      }
    >
      <img
        alt={'board logo'}
        src={logo}
        style={{ width: 100, height: 'auto' }}
      />
      <h1>Beview</h1>
      <RecentBoards />
    </div>
  );
};
