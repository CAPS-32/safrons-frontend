import { Link } from 'react-router-dom';
import heroImg from '../assets/images/beranda.webp';

export default function LandingPage() {
  return (
    <div className="flex flex-col justify-center h-full overflow-y-auto md:overflow-hidden bg-gradient-to-br from-surface-dim via-surface-bright to-primary-container relative">

      {/* Background Masked Hero Image */}
      <div className="absolute right-0 top-0 bottom-0 w-full lg:w-[80%] flex justify-end items-center opacity-70 pointer-events-none z-0">
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
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface/60 backdrop-blur-md text-primary font-sans font-bold text-xs sm:text-sm mb-4 sm:mb-6 [@media(max-height:720px)]:mb-3 border border-primary/20 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Platform Agritech Jawa Barat
          </div>

          <h1 className="font-display text-3xl sm:text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-extrabold text-primary leading-[1.05] max-w-5xl tracking-tight [@media(max-height:850px)]:md:text-5xl [@media(max-height:850px)]:lg:text-6xl [@media(max-height:850px)]:xl:text-7xl [@media(max-height:720px)]:text-2xl [@media(max-height:720px)]:sm:text-3xl [@media(max-height:720px)]:md:text-4xl [@media(max-height:720px)]:lg:text-5xl [@media(max-height:720px)]:xl:text-6xl [@media(max-height:600px)]:text-xl [@media(max-height:600px)]:sm:text-2xl [@media(max-height:600px)]:md:text-3xl [@media(max-height:600px)]:lg:text-4xl">
            Smart Agriculture <br />
            and Fertilizer <br />
            Recommendation <br />
            System
          </h1>

          <p className="text-on-surface-variant text-base sm:text-lg md:text-xl lg:text-2xl max-w-3xl mt-4 sm:mt-6 md:mt-8 font-sans leading-relaxed [@media(max-height:850px)]:md:text-base [@media(max-height:850px)]:lg:text-lg [@media(max-height:720px)]:text-sm [@media(max-height:720px)]:sm:text-sm [@media(max-height:720px)]:md:text-base [@media(max-height:720px)]:lg:text-base [@media(max-height:720px)]:mt-3 [@media(max-height:600px)]:text-xs [@media(max-height:600px)]:sm:text-xs [@media(max-height:600px)]:mt-2">
            Platform analitik spasial presisi tinggi untuk pemetaan kesuburan lahan, mendukung optimalisasi hasil agronomi dan pengelolaan lahan yang berkelanjutan.
          </p>

          <div className="mt-6 sm:mt-8 md:mt-10 flex flex-row gap-3 sm:gap-4 w-full sm:w-auto [@media(max-height:720px)]:mt-4 [@media(max-height:600px)]:mt-3">
            <Link to="/login" className="bg-primary text-white px-5 py-3 sm:px-8 sm:py-3.5 md:px-10 md:py-4 rounded-full font-sans font-bold hover:bg-primary/90 transition-all duration-300 shadow-xl shadow-primary/20 hover:scale-105 flex items-center justify-center text-sm sm:text-base md:text-lg">
              Jelajahi Peta
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
