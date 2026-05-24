import { NavLink, Link } from 'react-router-dom';

export default function Navbar() {
  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `font-sans px-5 py-2 rounded-full transition-all duration-300 font-medium text-sm ${
      isActive
        ? 'bg-primary text-on-primary shadow-md'
        : 'text-on-surface hover:bg-surface'
    }`;

  return (
    <div className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4">
      <nav className="backdrop-blur-xl bg-surface/90 border border-outline/50 shadow-lg shadow-primary/5 rounded-full px-4 sm:px-6 py-2.5 flex items-center justify-between w-full max-w-4xl">
        <Link to="/" className="flex-shrink-0 mr-4 sm:mr-8">
          <span className="font-display font-bold text-xl sm:text-2xl text-primary tracking-tight">SAFRONS</span>
        </Link>
        <div className="hidden md:flex space-x-1 items-center bg-surface-container-lowest/50 p-1.5 rounded-full border border-outline/30">
          <NavLink to="/" className={navLinkClass}>Beranda</NavLink>
          <NavLink to="/about" className={navLinkClass}>Tentang</NavLink>
          <NavLink to="/glossary" className={navLinkClass}>Glosarium</NavLink>
        </div>
        <div className="hidden md:flex ml-4 sm:ml-8">
          <Link to="/login" className="bg-primary-container text-on-primary-container px-6 py-2.5 rounded-full font-sans font-semibold text-sm hover:bg-primary hover:text-on-primary transition-colors shadow-sm shadow-primary-container/30">
            Mulai Pemetaan
          </Link>
        </div>
      </nav>
    </div>
  );
}
