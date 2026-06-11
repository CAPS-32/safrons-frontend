import { Link } from 'react-router-dom';
import heroImg from '../assets/images/beranda.webp';
import { useAuth } from '../hooks/useAuth';

export default function LandingPage() {
  const { isAuthenticated, user } = useAuth();
  
  const cleanFullName = user?.full_name?.replace(/\s*\(Petani\)/gi, '') || '';

  return (
    <div className="flex flex-col justify-center h-full overflow-x-hidden overflow-y-auto md:overflow-hidden bg-gradient-to-br from-surface-dim via-surface-bright to-primary-container relative">

      {/* Background Masked Hero Image */}
      <div className="absolute right-0 top-0 bottom-0 w-full lg:w-[80%] flex justify-end items-center opacity-20 lg:opacity-70 pointer-events-none z-0">
        <img
          src={heroImg}
          alt="SAFRONS Agritech Platform"
          fetchPriority="high"
          className="w-full h-full object-cover object-left"
          style={{
            WebkitMaskImage: 'radial-gradient(ellipse at 80% 50%, black 10%, transparent 75%)',
            maskImage: 'radial-gradient(ellipse at 80% 50%, black 10%, transparent 75%)'
          }}
        />
      </div>

      <main className="flex-grow flex flex-col items-start justify-center px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full relative z-10 py-6 md:py-0">

        {/* Left Side Content */}
        <div className="flex flex-col justify-center items-start text-left w-full lg:w-[65%]">
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-extrabold text-primary leading-[1.1] max-w-5xl tracking-tight [@media(max-height:850px)]:md:text-5xl [@media(max-height:850px)]:lg:text-6xl [@media(max-height:850px)]:xl:text-7xl [@media(max-height:720px)]:text-3xl [@media(max-height:720px)]:sm:text-4xl [@media(max-height:720px)]:md:text-4xl [@media(max-height:720px)]:lg:text-5xl [@media(max-height:720px)]:xl:text-6xl [@media(max-height:600px)]:text-2xl [@media(max-height:600px)]:sm:text-3xl [@media(max-height:600px)]:md:text-3xl [@media(max-height:600px)]:lg:text-4xl">
            Smart Agriculture <br />
            and Fertilizer <br />
            Recommendation <br />
            System
          </h1>

          {isAuthenticated && (
            <p className="text-primary font-display font-bold text-lg sm:text-xl md:text-2xl mt-4 sm:mt-6 animate-fade-in">
              Selamat datang kembali, {cleanFullName}!
            </p>
          )}

          <p className="text-on-surface-variant text-base sm:text-lg md:text-xl lg:text-2xl max-w-3xl mt-4 sm:mt-6 md:mt-8 font-sans leading-relaxed [@media(max-height:850px)]:md:text-base [@media(max-height:850px)]:lg:text-lg [@media(max-height:720px)]:text-sm [@media(max-height:720px)]:sm:text-sm [@media(max-height:720px)]:md:text-base [@media(max-height:720px)]:lg:text-base [@media(max-height:720px)]:mt-3 [@media(max-height:600px)]:text-xs [@media(max-height:600px)]:sm:text-xs [@media(max-height:600px)]:mt-2">
            Platform analitik spasial presisi tinggi untuk pemetaan kesuburan lahan, mendukung optimalisasi hasil agronomi dan pengelolaan lahan yang berkelanjutan.
          </p>

          <div className="mt-6 sm:mt-8 md:mt-10 flex flex-row gap-3 sm:gap-4 w-full sm:w-auto [@media(max-height:720px)]:mt-4 [@media(max-height:600px)]:mt-3">
            <Link 
              to={isAuthenticated ? "/dashboard" : "/login"} 
              className="bg-primary text-white px-5 py-3 sm:px-8 sm:py-3.5 md:px-10 md:py-4 rounded-full font-sans font-bold hover:bg-primary/90 transition-all duration-300 shadow-xl shadow-primary/20 hover:scale-105 flex items-center justify-center text-sm sm:text-base md:text-lg"
            >
              {isAuthenticated ? "Buka Dashboard" : "Jelajahi Peta"}
            </Link>
            <Link to="/about" className="bg-surface/80 backdrop-blur-sm text-primary border border-outline-variant px-5 py-3 sm:px-8 sm:py-3.5 md:px-10 md:py-4 rounded-full font-sans font-bold hover:bg-surface-dim transition-all duration-300 hover:scale-105 flex items-center justify-center text-sm sm:text-base md:text-lg shadow-sm">
              Pelajari Sistem
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
