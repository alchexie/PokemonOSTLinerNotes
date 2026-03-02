import { Outlet } from 'react-router-dom';
import SideNav from './components/SideNav';

export default function MainLayout() {
  return (
    <main id="main">
      <SideNav />
      <Outlet />
    </main>
  );
}
