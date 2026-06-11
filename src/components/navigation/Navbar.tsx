import { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { Bars3Icon, ArrowRightOnRectangleIcon, XMarkIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../hooks/useAuth';
import logoUrl from '../../assets/icons/safrons.png';
import { PUBLIC_NAV_LINKS, AUTHENTICATED_NAV_LINKS } from '../../constants/navigation';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const cleanFullName = user?.full_name?.replace(/\s*\(Petani\)/gi, '') || '';

  const handleLogout = () => {
    logout();
    setShowLogoutModal(false);
    navigate('/login');
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `px-5 py-5 text-lg font-semibold transition-all duration-300 border-b-4 ${isActive
      ? 'border-tertiary text-primary font-display'
      : 'border-transparent text-on-surface-variant font-sans hover:text-on-surface hover:border-outline-variant/30'
    }`;

  const mobileNavLinkClass = ({ isActive }: { isActive: boolean }) =>
    `block px-5 py-4 text-lg transition-all ${isActive
      ? 'text-primary font-display font-bold bg-surface-dim rounded-xl'
      : 'text-on-surface-variant font-sans hover:text-primary hover:bg-surface-dim rounded-xl'
    }`;

  const isExpert = user?.role === 'expert' || user?.role === 'admin';
  const isAdmin = user?.role === 'admin';

  let authenticatedLinks = AUTHENTICATED_NAV_LINKS;

  if (isExpert) {
    authenticatedLinks = authenticatedLinks.map((link) =>
      link.path === '/records'
        ? { label: 'Panel Pakar', path: '/expert/panel' }
        : link
    );
  }

  if (isAdmin) {
    const aboutIndex = authenticatedLinks.findIndex((link) => link.path === '/about');
    if (aboutIndex !== -1) {
      authenticatedLinks = [
        ...authenticatedLinks.slice(0, aboutIndex),
        { label: 'Panel Admin', path: '/admin/panel' },
        ...authenticatedLinks.slice(aboutIndex),
      ];
    } else {
      authenticatedLinks = [...authenticatedLinks, { label: 'Panel Admin', path: '/admin/panel' }];
    }
  }

  return (
    <header className="sticky top-0 z-[2000] w-full bg-surface/85 backdrop-blur-md border-b border-outline-variant shadow-sm transition-colors">
      <div className="w-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Left: Logo */}
        <div className="flex items-center">
          <Link to="/" className="flex items-center gap-2.5 text-3xl font-display font-bold text-primary tracking-tight py-4">
            <img src={logoUrl} alt="SAFRONS Logo" className="h-10 w-auto" />
            SAFRONS
          </Link>
        </div>

        {/* Center: Desktop Links */}
        <nav className="hidden md:flex items-center gap-6">
          {!isAuthenticated ? (
            <>
              {PUBLIC_NAV_LINKS.map((link) => (
                <NavLink key={link.path} to={link.path} className={navLinkClass}>
                  {link.label}
                </NavLink>
              ))}
            </>
          ) : (
            <>
              {authenticatedLinks.map((link) => (
                <NavLink key={link.path} to={link.path} className={navLinkClass}>
                  {link.label}
                </NavLink>
              ))}
            </>
          )}
        </nav>

        {/* Right: Auth Buttons or Profile/Logout */}
        <div className="hidden md:flex items-center space-x-4">
          {!isAuthenticated ? (
            <>
              <Link to="/login" className="text-on-surface-variant font-sans hover:bg-primary/5 hover:text-primary text-lg font-semibold px-5 py-2.5 rounded-xl transition-all duration-300">
                Masuk
              </Link>
              <Link to="/register" className="bg-primary text-white font-display px-6 py-2.5 rounded-full text-lg font-semibold hover:bg-primary/95 transition-all shadow-md hover:scale-105 active:scale-95">
                Daftar
              </Link>
            </>
          ) : (
            <div className="relative">
              <button
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className="py-2 pl-3 pr-5 text-on-surface-variant hover:text-primary hover:bg-surface-dim rounded-full transition-all flex items-center gap-3 border border-outline-variant bg-surface-container-low"
                aria-label="Profil Menu"
              >
                <UserCircleIcon className="w-8 h-8 text-primary" />
                <span className="text-base font-display font-semibold text-on-surface max-w-[150px] truncate">
                  {cleanFullName}
                </span>
              </button>

              {profileMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-surface-container-lowest rounded-2xl shadow-xl border border-outline-variant py-2 animate-fade-in-up z-[2500]">
                  <div className="px-4 py-3 border-b border-outline-variant mb-2">
                    <p className="text-sm font-display font-bold text-on-surface truncate">{cleanFullName}</p>
                    <p className="text-xs font-sans text-on-surface-variant truncate">{user?.email}</p>
                  </div>
                  <button
                    onClick={() => {
                      setProfileMenuOpen(false);
                      setShowLogoutModal(true);
                    }}
                    className="w-[calc(100%-1rem)] mx-2 text-left px-4 py-2.5 flex items-center gap-3 text-error hover:bg-error/10 hover:text-error rounded-xl transition-all font-sans text-sm font-semibold"
                  >
                    <ArrowRightOnRectangleIcon className="w-5 h-5" />
                    Keluar
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile Right: Hamburger (unauthenticated) or Profile Menu Icon (authenticated) */}
        <div className="md:hidden flex items-center gap-2">
          {!isAuthenticated ? (
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-on-surface-variant hover:text-primary hover:bg-surface-dim rounded-full transition-all"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
            </button>
          ) : (
            <div className="relative">
              <button
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className="p-1.5 pl-2 pr-3 text-on-surface-variant hover:text-primary hover:bg-surface-dim rounded-full transition-all flex items-center gap-2 border border-outline-variant bg-surface-container-low"
                aria-label="Profil Menu"
              >
                <UserCircleIcon className="w-8 h-8 text-primary" />
                <span className="text-sm font-display font-semibold text-on-surface max-w-[100px] truncate">
                  {cleanFullName}
                </span>
              </button>

              {profileMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-surface-container-lowest rounded-2xl shadow-xl border border-outline-variant py-2 animate-fade-in-up z-[2500]">
                  <div className="px-4 py-2 border-b border-outline-variant mb-2">
                    <p className="text-sm font-display font-bold text-on-surface truncate">{cleanFullName}</p>
                    <p className="text-xs font-sans text-on-surface-variant truncate">{user?.email}</p>
                  </div>
                  <button
                    onClick={() => {
                      setProfileMenuOpen(false);
                      setShowLogoutModal(true);
                    }}
                    className="w-[calc(100%-1rem)] mx-2 text-left px-4 py-2 flex items-center gap-2 text-error hover:bg-error/10 hover:text-error rounded-xl transition-all font-sans text-sm font-semibold"
                  >
                    <ArrowRightOnRectangleIcon className="w-5 h-5" />
                    Keluar
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Dropdown Menu (Unauthenticated Only) */}
      {mobileMenuOpen && !isAuthenticated && (
        <div className="md:hidden bg-surface/95 backdrop-blur-xl border-b border-outline-variant shadow-xl absolute w-full left-0 top-16 animate-fade-in-up">
          <div className="px-4 pt-4 pb-4 space-y-2">
            {PUBLIC_NAV_LINKS.map((link) => (
              <NavLink 
                key={link.path} 
                to={link.path} 
                onClick={() => setMobileMenuOpen(false)} 
                className={mobileNavLinkClass}
              >
                {link.label}
              </NavLink>
            ))}
          </div>
          <div className="px-4 py-6 border-t border-outline-variant flex flex-col gap-3">
            <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="block w-full text-center px-4 py-3 font-sans text-primary border border-primary rounded-full font-semibold hover:bg-primary/5 transition-all">
              Masuk
            </Link>
            <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="block w-full text-center px-4 py-3 font-display bg-primary text-white rounded-full font-semibold hover:bg-primary/90 transition-all shadow-md">
              Daftar
            </Link>
          </div>
        </div>
      )}

      {/* Logout Modal */}
      {showLogoutModal && createPortal(
        <div className="fixed inset-0 bg-on-surface/50 backdrop-blur-sm z-[3000] flex items-center justify-center p-4 pointer-events-auto">
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
    </header>
  );
}
