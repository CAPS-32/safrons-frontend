import { Link } from 'react-router-dom';
import heroImg from '../assets/images/beranda.webp';

export default function LandingPage() {
  return (
    <div className="flex flex-col justify-center min-h-[calc(100vh-6rem)] pt-12 lg:pt-20 pb-12">
      <main className="flex-grow flex flex-col lg:flex-row items-center justify-between px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full gap-12 lg:gap-8">
        
        {/* Left Side */}
        <div className="flex flex-col justify-center items-center lg:items-start text-center lg:text-left w-full lg:w-1/2 lg:pr-8">
          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-extrabold text-on-surface tracking-tight leading-tight">
            Presisi Pemupukan untuk <span className="text-primary-container">Masa Depan</span> Pertanian
          </h1>
          <p className="font-sans text-lg sm:text-xl text-on-surface-variant mt-8 leading-relaxed max-w-2xl lg:max-w-none">
            Platform cerdas untuk memetakan unsur hara dan memberikan rekomendasi pemupukan 5T secara real-time di Jawa Barat.
          </p>
          <div className="mt-12 flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link to="/login" className="bg-primary-container text-on-primary-container px-8 py-4 rounded-xl font-sans font-bold hover:bg-primary transition-all duration-300 shadow-lg shadow-primary-container/20 hover:-translate-y-1 flex items-center justify-center">
              Jelajahi Peta Lahan
            </Link>
            <Link to="/about" className="bg-surface-container-lowest text-on-surface border-2 border-outline px-8 py-4 rounded-xl font-sans font-bold hover:bg-surface hover:border-primary-container transition-all duration-300 flex items-center justify-center">
              Pelajari Sistem
            </Link>
          </div>
        </div>

        {/* Right Side */}
        <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
          <div className="relative w-full max-w-lg lg:max-w-xl aspect-[4/3] rounded-3xl overflow-hidden shadow-lg shadow-primary/20 border border-outline/20">
            <img 
              src={heroImg} 
              alt="SAFRONS Agritech Platform" 
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        </div>

      </main>
    </div>
  );
}
