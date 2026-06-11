import { Link } from 'react-router-dom';
import { MapIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import logoUrl from '../assets/icons/safrons.png';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-dim via-surface-bright to-primary-container flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Decorative ambient glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute -top-10 -right-10 w-72 h-72 bg-tertiary/10 rounded-full blur-[80px] pointer-events-none z-0"></div>

      <div className="max-w-md w-full text-center space-y-8 relative z-10 animate-fade-in-up">
        {/* Logo Branding */}
        <div className="flex items-center justify-center gap-2.5 mb-2">
          <img src={logoUrl} alt="SAFRONS Logo" className="h-10 w-auto" />
          <span className="font-display text-2xl font-extrabold text-primary tracking-tight">
            SAFRONS
          </span>
        </div>

        {/* Animated Map Icon / 404 Illustration */}
        <div className="relative flex justify-center items-center py-4">
          <div className="absolute w-32 h-32 bg-primary/10 rounded-full animate-ping opacity-60"></div>
          <div className="relative w-24 h-24 bg-surface-container rounded-3xl flex items-center justify-center shadow-xl border border-outline-variant/50 animate-bounce duration-1000">
            <MapIcon className="w-12 h-12 text-primary" />
          </div>
          {/* Small badge floating */}
          <span className="absolute top-2 right-1/3 bg-error text-white font-display font-black text-xs px-2.5 py-1 rounded-full shadow-md animate-pulse">
            404
          </span>
        </div>

        {/* Error Message */}
        <div className="space-y-3">
          <h1 className="font-display text-3xl font-extrabold text-on-surface tracking-tight">
            Halaman Tidak Ditemukan
          </h1>
          <p className="text-on-surface-variant text-sm font-sans leading-relaxed max-w-sm mx-auto">
            Maaf, area koordinat atau halaman yang Anda tuju berada di luar cakupan pemetaan sistem kami.
          </p>
        </div>

        {/* Action Button */}
        <div className="pt-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2.5 bg-primary text-white px-8 py-3.5 rounded-full font-sans font-bold hover:bg-primary/95 transition-all duration-300 shadow-lg hover:scale-105 active:scale-95 cursor-pointer text-sm"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}
