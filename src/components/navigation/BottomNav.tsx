import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { BOTTOM_NAV_LINKS } from '../../constants/navigation';
import { Squares2X2Icon, ShieldCheckIcon } from '@heroicons/react/24/outline';

export default function BottomNav() {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) return null;

  const isExpert = user?.role === 'expert' || user?.role === 'admin';
  const isAdmin = user?.role === 'admin';

  let navLinks = BOTTOM_NAV_LINKS;

  if (isExpert) {
    navLinks = navLinks.map((link) =>
      link.path === '/records'
        ? { label: 'Panel Pakar', path: '/expert/panel', icon: Squares2X2Icon }
        : link
    );
  }

  if (isAdmin) {
    const aboutIndex = navLinks.findIndex((link) => link.path === '/about');
    if (aboutIndex !== -1) {
      navLinks = [
        ...navLinks.slice(0, aboutIndex),
        { label: 'Panel Admin', path: '/admin/panel', icon: ShieldCheckIcon },
        ...navLinks.slice(aboutIndex),
      ];
    } else {
      navLinks = [...navLinks, { label: 'Panel Admin', path: '/admin/panel', icon: ShieldCheckIcon }];
    }
  }

  const tabClass = ({ isActive }: { isActive: boolean }) =>
    `flex flex-col items-center justify-center text-center flex-1 h-full mx-1 transition-all duration-300 border-t-4 ${
      isActive 
        ? 'text-primary bg-primary/5 border-tertiary font-display font-bold shadow-sm' 
        : 'text-on-surface-variant border-transparent font-sans hover:text-primary hover:bg-surface-dim'
    }`;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 h-20 bg-surface-container-lowest border-t border-outline-variant shadow-[0_-4px_20px_rgba(0,0,0,0.05)] flex justify-around items-center w-full z-[2000] pb-safe px-2 py-1.5">
      {navLinks.map((link) => (
        <NavLink key={link.path} to={link.path} className={tabClass}>
          <link.icon className="w-5 h-5 shrink-0" />
          <span className="text-[9px] tracking-tight leading-tight block text-center mt-1">
            {link.label.includes(' ') ? (
              <>
                {link.label.split(' ')[0]}
                <br />
                {link.label.split(' ')[1]}
              </>
            ) : (
              link.label
            )}
          </span>
        </NavLink>
      ))}
    </nav>
  );
}
