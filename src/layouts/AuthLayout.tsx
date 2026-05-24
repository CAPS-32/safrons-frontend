import { Outlet, Link } from 'react-router-dom';
import authImg from '../assets/images/autentikasi.webp';

export default function AuthLayout() {
  return (
    <div className="flex min-h-screen bg-surface">
      {/* Left side */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-surface-variant overflow-hidden">
        <img
          src={authImg}
          alt="Smart Agriculture"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/90 to-[#0A230D]/70 mix-blend-multiply" />
        
        <div className="relative z-10 flex flex-col justify-center items-center w-full h-full p-12 text-center">
          <Link to="/" className="inline-block mb-8">
            <h1 className="font-display text-5xl font-extrabold text-tertiary tracking-tight">
              SAFRONS
            </h1>
            <p className="font-sans text-xl text-white mt-2 font-semibold tracking-wide">
              Precision Agritech
            </p>
          </Link>
          <p className="font-sans text-lg text-white/90 max-w-md leading-relaxed">
            Platform cerdas untuk memetakan unsur hara dan memberikan rekomendasi pemupukan secara real-time.
          </p>
        </div>
      </div>

      {/* Right side */}
      <div className="flex flex-col justify-center w-full lg:w-1/2 px-4 sm:px-6 lg:px-20 xl:px-24">
        <div className="lg:hidden text-center mb-8 pt-8">
          <Link to="/">
            <h1 className="font-display text-4xl font-extrabold text-primary tracking-tight">
              SAFRONS
            </h1>
          </Link>
        </div>
        
        <Outlet />
      </div>
    </div>
  );
}
