import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/navigation/Navbar';
import BottomNav from '../components/navigation/BottomNav';
import { useAuth } from '../hooks/useAuth';

export default function PublicLayout() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const isLandingPage = location.pathname === '/';
  
  return (
    <div className={`bg-surface font-sans text-on-surface flex flex-col ${
      isLandingPage ? 'h-dvh overflow-hidden' : 'min-h-screen'
    } ${isAuthenticated ? 'pb-16 md:pb-0' : ''}`}>
      <Navbar />
      <main className="flex-grow relative min-h-0"> 
        <Outlet />
      </main>
      {isAuthenticated && <BottomNav />}
    </div>
  );
}