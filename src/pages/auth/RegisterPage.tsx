import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { authService } from '../../services/auth.service';
import logoUrl from '../../assets/icons/safrons.png';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await authService.register({
        email,
        password,
        full_name: fullName,
      });
      void navigate('/login');
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const data = err.response?.data as Record<string, unknown> | undefined;
        const detail = data?.detail;
        setError(
          typeof detail === 'string' 
            ? detail 
            : 'Gagal mendaftar. Silakan periksa kembali data Anda.'
        );
      } else {
        setError('Gagal mendaftar. Silakan periksa kembali data Anda.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-surface/50 backdrop-blur-md border border-outline-variant p-8 md:p-10 rounded-[2.5rem] shadow-2xl relative z-10">
      <div className="mb-8 flex flex-col items-center text-center">
        <Link to="/" className="mb-4 lg:hidden block hover:scale-105 transition-transform duration-300 active:scale-95">
          <img src={logoUrl} alt="SAFRONS Logo" className="h-12 w-auto mx-auto" />
        </Link>
        <h2 className="font-display text-3xl font-extrabold text-primary tracking-tight">
          Buat Akun Baru
        </h2>
        <p className="font-sans text-on-surface-variant mt-2 text-base">
          Bergabunglah dengan SAFRONS untuk memulai.
        </p>
      </div>

      <form onSubmit={(e) => { void handleSubmit(e); }} className="space-y-5">
        {error && (
          <div className="bg-error-container text-on-error-container p-4 rounded-xl text-sm font-medium">
            {error}
          </div>
        )}

        <div className="space-y-2">
          <label className="block font-sans text-sm font-bold text-on-surface">
            Nama Lengkap
          </label>
          <input
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full px-4 py-3 bg-surface-container-lowest border border-outline rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all duration-300 font-sans text-on-surface"
            placeholder="Masukkan nama lengkap"
          />
        </div>

        <div className="space-y-2">
          <label className="block font-sans text-sm font-bold text-on-surface">
            Email
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 bg-surface-container-lowest border border-outline rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all duration-300 font-sans text-on-surface"
            placeholder="nama@email.com"
          />
        </div>

        <div className="space-y-2">
          <label className="block font-sans text-sm font-bold text-on-surface">
            Kata Sandi
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 bg-surface-container-lowest border border-outline rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all duration-300 font-sans text-on-surface"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary text-on-primary py-4 rounded-xl font-sans font-bold hover:bg-surface-tint transition-all duration-300 shadow-md shadow-primary/20 hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none mt-4"
        >
          {loading ? 'Memproses...' : 'Daftar Sekarang'}
        </button>

        <p className="text-center font-sans text-on-surface-variant mt-8">
          Sudah punya akun?{' '}
          <Link
            to="/login"
            className="text-primary font-bold hover:text-surface-tint transition-colors"
          >
            Masuk di sini
          </Link>
        </p>
      </form>
    </div>
  );
}
