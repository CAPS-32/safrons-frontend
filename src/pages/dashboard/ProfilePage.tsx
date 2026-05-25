import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { UserCircleIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  if (!user) return null;

  const cleanFullName = user.full_name;

  const handleLogout = () => {
    logout();
    setShowLogoutModal(false);
    navigate('/login');
  };

  return (
    <div className="h-full bg-surface-dim p-4 md:p-10 flex justify-center pt-20 overflow-y-auto pointer-events-auto">
      <div className="bg-surface-container-lowest shadow-md rounded-3xl p-8 max-w-md w-full mx-auto mt-10 text-center animate-fade-in-up border border-outline-variant">
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-primary/10 rounded-full">
            <UserCircleIcon className="w-16 h-16 text-primary" />
          </div>
        </div>
        
        <h1 className="font-display text-2xl font-bold text-on-surface mb-1">
          {cleanFullName}
        </h1>
        
        <p className="font-sans text-on-surface-variant mb-6">
          {user.email}
        </p>
        
        <div className="bg-surface-dim py-3 px-6 rounded-full inline-block border border-outline-variant/50 mb-8">
          <span className="font-sans text-sm text-on-surface-variant uppercase tracking-wider font-semibold">
            Peran: <span className="text-primary ml-1 font-bold">{user.role}</span>
          </span>
        </div>

        <button 
          onClick={() => setShowLogoutModal(true)}
          className="w-full flex items-center justify-center gap-2 bg-error text-white font-display px-6 py-3 rounded-full text-sm font-semibold hover:bg-error/95 transition-all shadow-md active:scale-95"
        >
          <span>Keluar dari Aplikasi</span>
          <ArrowRightOnRectangleIcon className="w-5 h-5" />
        </button>
      </div>

      {/* Logout Modal - Rendered via React Portal */}
      {showLogoutModal && createPortal(
        <div className="fixed inset-0 bg-on-surface/50 backdrop-blur-sm z-[3000] flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-xl w-96 max-w-full animate-fade-in-up border border-outline-variant">
            <h3 className="font-display font-bold text-lg text-on-surface mb-2">Konfirmasi Keluar</h3>
            <p className="font-sans text-on-surface-variant mb-6">Apakah Anda yakin ingin keluar dari SAFRONS?</p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setShowLogoutModal(false)}
                className="font-sans px-4 py-2 rounded-full border border-outline text-on-surface-variant hover:bg-surface-dim transition-colors"
              >
                Batal
              </button>
              <button 
                onClick={handleLogout}
                className="font-sans bg-error text-on-error hover:bg-error-container rounded-full px-4 py-2 transition-colors font-medium"
              >
                Ya, Keluar
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
