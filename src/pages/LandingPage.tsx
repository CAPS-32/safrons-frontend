import { Link } from 'react-router-dom';
import heroImg from '../assets/images/beranda.webp';

export default function LandingPage() {
  return (
    <div className="flex flex-col justify-center h-[calc(100vh-4.5rem)] overflow-y-auto md:overflow-hidden bg-gradient-to-br from-surface-dim via-surface-bright to-primary-container relative">

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

      <main className="flex-grow flex flex-col items-start justify-center px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full relative z-10 py-10 md:py-0">

        {/* Left Side Content */}
        <div className="flex flex-col justify-center items-start text-left w-full lg:w-[65%]">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface/60 backdrop-blur-md text-primary font-sans font-bold text-sm mb-6 [@media(max-height:780px)]:mb-4 [@media(max-height:680px)]:mb-3 border border-primary/20 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Platform Agritech Jawa Barat
          </div>

          <h1 className="font-display text-4xl sm:text-5xl md:text-7xl lg:text-8xl [@media(max-height:780px)]:text-5xl [@media(max-height:780px)]:md:text-6xl [@media(max-height:780px)]:lg:text-7xl [@media(max-height:680px)]:text-4xl [@media(max-height:680px)]:md:text-5xl [@media(max-height:680px)]:lg:text-6xl font-extrabold text-primary leading-[1.05] max-w-5xl tracking-tight">
            Smart Agriculture <br />
            and Fertilizer <br />
            Recommendation <br />
            System
          </h1>

          <p className="text-on-surface-variant text-lg md:text-xl lg:text-2xl [@media(max-height:780px)]:text-base [@media(max-height:780px)]:md:text-lg [@media(max-height:780px)]:lg:text-xl [@media(max-height:680px)]:text-base [@media(max-height:680px)]:md:text-base [@media(max-height:680px)]:lg:text-lg max-w-3xl mt-8 [@media(max-height:780px)]:mt-6 [@media(max-height:680px)]:mt-4 font-sans leading-relaxed">
            Platform analitik spasial presisi tinggi untuk pemetaan kesuburan lahan, mendukung optimalisasi hasil agronomi dan pengelolaan lahan yang berkelanjutan.
          </p>

          <div className="mt-10 [@media(max-height:780px)]:mt-8 [@media(max-height:680px)]:mt-5 flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link to="/login" className="bg-primary text-white px-10 py-4 [@media(max-height:680px)]:px-8 [@media(max-height:680px)]:py-3 rounded-full font-sans font-bold hover:bg-primary/90 transition-all duration-300 shadow-xl shadow-primary/20 hover:scale-105 flex items-center justify-center text-lg [@media(max-height:680px)]:text-base">
              Jelajahi Peta Lahan
            </Link>
            <Link to="/about" className="bg-surface/80 backdrop-blur-sm text-primary border border-outline-variant px-10 py-4 [@media(max-height:680px)]:px-8 [@media(max-height:680px)]:py-3 rounded-full font-sans font-bold hover:bg-surface-dim transition-all duration-300 hover:scale-105 flex items-center justify-center text-lg shadow-sm [@media(max-height:680px)]:text-base">
              Pelajari Sistem
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
