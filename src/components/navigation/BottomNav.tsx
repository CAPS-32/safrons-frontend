import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { BOTTOM_NAV_LINKS } from '../../constants/navigation';

export default function BottomNav() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) return null;

  const tabClass = ({ isActive }: { isActive: boolean }) =>
    `flex flex-col items-center justify-center flex-1 h-full mx-1 transition-all duration-300 border-t-4 ${
      isActive 
        ? 'text-primary bg-primary/5 border-tertiary font-display font-bold shadow-sm' 
        : 'text-on-surface-variant border-transparent font-sans hover:text-primary hover:bg-surface-dim'
    }`;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 h-20 bg-surface-container-lowest border-t border-outline-variant shadow-[0_-4px_20px_rgba(0,0,0,0.05)] flex justify-around items-center w-full z-[2000] pb-safe px-2 py-1.5">
      {BOTTOM_NAV_LINKS.map((link) => (
        <NavLink key={link.path} to={link.path} className={tabClass}>
          <link.icon className="w-5 h-5 shrink-0" />
          <span className="text-[10px] tracking-tight">{link.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
