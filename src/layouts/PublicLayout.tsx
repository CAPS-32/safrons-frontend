import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function PublicLayout() {
  return (
    <div className="min-h-screen bg-background font-sans text-on-background flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24"> 
        <Outlet />
      </main>
    </div>
  );
}