import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div className="flex flex-col justify-center items-center min-h-[calc(100vh-6rem)] pt-20">
      <main className="flex-grow flex flex-col justify-center items-center text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto py-12">
        {/* <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-surface text-on-surface text-sm font-semibold mb-8 border border-outline">
          <span className="w-2.5 h-2.5 rounded-full bg-primary-container animate-pulse"></span>
          Platform Agritech Terbaik di Jawa Barat
        </div> */}
        <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-extrabold text-on-surface tracking-tight max-w-4xl mx-auto leading-tight">
          Presisi Pemupukan untuk <span className="text-primary-container">Masa Depan</span> Pertanian
        </h1>
        <p className="font-sans text-lg sm:text-xl text-on-surface-variant mt-8 max-w-2xl mx-auto leading-relaxed">
          Platform cerdas untuk memetakan unsur hara dan memberikan rekomendasi pemupukan 5T secara real-time di Jawa Barat.
        </p>
        <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center w-full sm:w-auto">
          <button className="bg-primary-container text-on-primary-container px-8 py-4 rounded-xl font-sans font-bold hover:bg-primary transition-all duration-300 shadow-lg shadow-primary-container/20 hover:-translate-y-1">
            Jelajahi Peta Lahan
          </button>
          <Link to="/tentang" className="bg-surface-container-lowest text-on-surface border-2 border-outline px-8 py-4 rounded-xl font-sans font-bold hover:bg-surface hover:border-primary-container transition-all duration-300 flex items-center justify-center">
            Pelajari Sistem
          </Link>
        </div>
      </main>
    </div>
  );
}
