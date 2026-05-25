import { Outlet } from 'react-router-dom';
import Navbar from '../components/navigation/Navbar';
import BottomNav from '../components/navigation/BottomNav';
import { useAuth } from '../hooks/useAuth';

export default function PublicLayout() {
  const { isAuthenticated } = useAuth();
  
  return (
    <div className={`min-h-screen bg-surface font-sans text-on-surface flex flex-col ${isAuthenticated ? 'pb-16 md:pb-0' : ''}`}>
      <Navbar />
      <main className="flex-grow relative"> 
        <Outlet />
      </main>
      {isAuthenticated && <BottomNav />}
    </div>
  );
}