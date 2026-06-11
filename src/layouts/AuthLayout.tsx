import { Outlet, Link, useNavigate } from 'react-router-dom';
import authImg from '../assets/images/autentikasi.webp';
import { useAuth } from '../hooks/useAuth';
import { useEffect } from 'react';
import logoUrl from '../assets/icons/safrons.png';

export default function AuthLayout() {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      void navigate('/dashboard');
    }
  }, [isLoading, isAuthenticated, navigate]);

  if (isLoading) {
    return (
      <div className="flex flex-col h-screen w-screen items-center justify-center bg-surface transition-all duration-300">
        <div className="flex flex-col items-center justify-center space-y-5 animate-fade-in">
          <div className="relative flex items-center justify-center">
            <div className="absolute w-24 h-24 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
            <div className="w-16 h-16 bg-surface-container rounded-full flex items-center justify-center shadow-lg border border-outline-variant/30 animate-pulse">
              <img src={logoUrl} alt="SAFRONS Logo" className="w-10 h-10 object-contain" />
            </div>
          </div>
          <div className="flex flex-col items-center space-y-1">
            <span className="text-2xl font-black text-primary font-display tracking-wider">
              SAFRONS
            </span>
            <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest animate-pulse">
              Memuat Sistem...
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center min-h-screen md:h-screen overflow-y-auto md:overflow-hidden bg-gradient-to-br from-surface-dim via-surface-bright to-primary-container relative">
      
      {/* Background Image */}
      <div className="absolute right-0 top-0 bottom-0 w-full lg:w-[80%] flex justify-end items-center opacity-20 lg:opacity-70 pointer-events-none z-0">
        <img 
          src={authImg} 
          alt="Smart Agriculture" 
          fetchPriority="high"
          className="w-full h-full object-cover object-left"
          style={{ 
            WebkitMaskImage: 'radial-gradient(ellipse at 80% 50%, black 10%, transparent 75%)', 
            maskImage: 'radial-gradient(ellipse at 80% 50%, black 10%, transparent 75%)' 
          }}
        />
      </div>

      {/* Decorative ambient glows */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-tertiary/10 rounded-full blur-[100px] pointer-events-none"></div>

      <main className="flex-grow flex flex-col lg:flex-row items-center justify-between px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full relative z-10 py-10 md:py-0 gap-16">
        
        {/* Left Side: Branding Content - Hidden on mobile, shown on desktop */}
        <div className="hidden lg:flex flex-col justify-center items-start text-left w-full lg:w-[55%]">
          <Link to="/" className="inline-flex items-center gap-4 mb-8 hover:scale-105 transition-transform duration-300 active:scale-98 cursor-pointer">
            <img src={logoUrl} alt="SAFRONS Logo" className="h-16 w-auto" />
            <span className="font-display text-5xl font-extrabold text-primary tracking-tight">
              SAFRONS
            </span>
          </Link>
          
          <h2 className="font-display text-3xl md:text-5xl font-extrabold text-primary leading-[1.1] max-w-xl tracking-tight">
            Smart Agriculture <br />
            and Fertilizer <br />
            Recommendation <br />
            System
          </h2>
          
          <p className="text-on-surface-variant text-base md:text-lg max-w-lg mt-6 font-sans leading-relaxed">
            Platform analitik spasial presisi tinggi untuk pemetaan kesuburan lahan, mendukung optimalisasi hasil agronomi dan pengelolaan lahan yang berkelanjutan.
          </p>
        </div>

        {/* Right Side: Glassmorphic Auth Form Container */}
        <div className="w-full lg:w-[45%] flex justify-center lg:justify-end">
          <Outlet />
        </div>

      </main>
    </div>
  );
}
