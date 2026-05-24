import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { authService } from '../../services/auth.service';

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await authService.login({ email, password });
      localStorage.setItem('token', response.access_token);
      void navigate('/dashboard');
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const data = err.response?.data as Record<string, unknown> | undefined;
        const detail = data?.detail;
        setError(
          typeof detail === 'string' 
            ? detail 
            : 'Gagal masuk. Silakan periksa kembali kredensial Anda.'
        );
      } else {
        setError('Gagal masuk. Silakan periksa kembali kredensial Anda.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="mb-10">
        <h2 className="font-display text-3xl font-extrabold text-on-surface tracking-tight">
          Selamat Datang Kembali
        </h2>
        <p className="font-sans text-on-surface-variant mt-2 text-lg">
          Masuk untuk mengakses dashboard SAFRONS.
        </p>
      </div>

      <form onSubmit={(e) => { void handleSubmit(e); }} className="space-y-6">
        {error && (
          <div className="bg-error-container text-on-error-container p-4 rounded-xl text-sm font-medium">
            {error}
          </div>
        )}

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
          className="w-full bg-primary text-on-primary py-4 rounded-xl font-sans font-bold hover:bg-surface-tint transition-all duration-300 shadow-md shadow-primary/20 hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none mt-2"
        >
          {loading ? 'Memproses...' : 'Masuk'}
        </button>

        <p className="text-center font-sans text-on-surface-variant mt-8">
          Belum punya akun?{' '}
          <Link
            to="/register"
            className="text-primary font-bold hover:text-surface-tint transition-colors"
          >
            Daftar sekarang
          </Link>
        </p>
      </form>
    </div>
  );
}
