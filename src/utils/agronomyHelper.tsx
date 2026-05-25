

export function formatSlope(slope: string | undefined): string {
  if (!slope || slope.toLowerCase() === 'no data') {
    return 'Tidak tersedia';
  }
  return `${slope}%`;
}

export function formatTexture(rawTexture: string | undefined): string {
  if (!rawTexture || rawTexture.toLowerCase() === 'no data') {
    return 'Tidak tersedia';
  }
  
  // Split the string by ';' and take the first index (topsoil layer)
  let topsoil = rawTexture.split(';')[0].trim();
  
  // Replace technical terms
  topsoil = topsoil.replace(/mod\. fine/gi, 'Liat Cukup Halus');
  topsoil = topsoil.replace(/fine/gi, 'Liat Halus');
  topsoil = topsoil.replace(/mod\. coarse/gi, 'Pasir Cukup Kasar');
  topsoil = topsoil.replace(/medium/gi, 'Sedang');
  
  topsoil = topsoil.replace(/\//g, ' / ');
  
  return topsoil;
}

export const getPhBadge = (ph: number | undefined | null) => {
  const v = getSafeValue(ph);
  if (v === null) return <span className="bg-outline-variant text-on-surface-variant px-2 py-0.5 rounded-md text-[10px] font-bold">Tidak Ada Data</span>;
  if (v < 4.5) return <span className="bg-[#991B1B] text-white px-2 py-0.5 rounded-md text-[10px] font-bold">Sangat Masam</span>;
  if (v <= 5.5) return <span className="bg-error text-on-error px-2 py-0.5 rounded-md text-[10px] font-bold">Masam</span>;
  if (v <= 6.5) return <span className="bg-[#F97316] text-white px-2 py-0.5 rounded-md text-[10px] font-bold">Sedikit Masam</span>;
  if (v <= 7.5) return <span className="bg-primary text-on-primary px-2 py-0.5 rounded-md text-[10px] font-bold">Netral</span>;
  if (v <= 8.5) return <span className="bg-[#3B82F6] text-white px-2 py-0.5 rounded-md text-[10px] font-bold">Sedikit Alkalis</span>;
  return <span className="bg-[#1E3A8A] text-white px-2 py-0.5 rounded-md text-[10px] font-bold">Alkalis</span>;
};

export const getNBadge = (n: number | undefined | null) => {
  const v = getSafeValue(n);
  if (v === null) return <span className="bg-outline-variant text-on-surface-variant px-2 py-0.5 rounded-md text-[10px] font-bold">Tidak Ada Data</span>;
  if (v < 10) return <span className="bg-[#991B1B] text-white px-2 py-0.5 rounded-md text-[10px] font-bold">Sangat Rendah</span>;
  if (v <= 20) return <span className="bg-error text-on-error px-2 py-0.5 rounded-md text-[10px] font-bold">Rendah</span>;
  if (v <= 50) return <span className="bg-tertiary text-on-tertiary px-2 py-0.5 rounded-md text-[10px] font-bold">Sedang</span>;
  if (v <= 75) return <span className="bg-[#8EC849] text-on-surface px-2 py-0.5 rounded-md text-[10px] font-bold">Tinggi</span>;
  return <span className="bg-primary text-on-primary px-2 py-0.5 rounded-md text-[10px] font-bold">Sangat Tinggi</span>;
};

export const getPBadge = (p: number | undefined | null) => {
  const v = getSafeValue(p);
  if (v === null) return <span className="bg-outline-variant text-on-surface-variant px-2 py-0.5 rounded-md text-[10px] font-bold">Tidak Ada Data</span>;
  if (v < 15) return <span className="bg-[#991B1B] text-white px-2 py-0.5 rounded-md text-[10px] font-bold">Sangat Rendah</span>;
  if (v <= 20) return <span className="bg-error text-on-error px-2 py-0.5 rounded-md text-[10px] font-bold">Rendah</span>;
  if (v <= 40) return <span className="bg-tertiary text-on-tertiary px-2 py-0.5 rounded-md text-[10px] font-bold">Sedang</span>;
  if (v <= 60) return <span className="bg-[#8EC849] text-on-surface px-2 py-0.5 rounded-md text-[10px] font-bold">Tinggi</span>;
  return <span className="bg-primary text-on-primary px-2 py-0.5 rounded-md text-[10px] font-bold">Sangat Tinggi</span>;
};

export const getKBadge = (k: number | undefined | null) => {
  const v = getSafeValue(k);
  if (v === null) return <span className="bg-outline-variant text-on-surface-variant px-2 py-0.5 rounded-md text-[10px] font-bold">Tidak Ada Data</span>;
  if (v < 100) return <span className="bg-[#991B1B] text-white px-2 py-0.5 rounded-md text-[10px] font-bold">Sangat Rendah</span>;
  if (v <= 200) return <span className="bg-error text-on-error px-2 py-0.5 rounded-md text-[10px] font-bold">Rendah</span>;
  if (v <= 400) return <span className="bg-tertiary text-on-tertiary px-2 py-0.5 rounded-md text-[10px] font-bold">Sedang</span>;
  if (v <= 600) return <span className="bg-[#8EC849] text-on-surface px-2 py-0.5 rounded-md text-[10px] font-bold">Tinggi</span>;
  return <span className="bg-primary text-on-primary px-2 py-0.5 rounded-md text-[10px] font-bold">Sangat Tinggi</span>;
};

export const getSafeValue = (val: number | string | null | undefined): number | null => {
  if (val === null || val === undefined || val === -9999 || val === '-9999') return null;
  return Number(val);
};

export const getColorForpH = (val: number | null): string => {
  const v = getSafeValue(val);
  if (v === null) return '#9CA3AF'; 
  if (v < 4.5) return '#991B1B';
  if (v <= 5.5) return '#ba1a1a';
  if (v <= 6.5) return '#F97316';
  if (v <= 7.5) return '#2C5E2E';
  if (v <= 8.5) return '#3B82F6';
  return '#1E3A8A';
};

export const getColorForN = (val: number | null): string => {
  const v = getSafeValue(val);
  if (v === null) return '#9CA3AF';
  if (v < 10) return '#991B1B';
  if (v <= 20) return '#ba1a1a';
  if (v <= 50) return '#FFD700';
  if (v <= 75) return '#8EC849';
  return '#2C5E2E';
};

export const getColorForP = (val: number | null): string => {
  const v = getSafeValue(val);
  if (v === null) return '#9CA3AF';
  if (v < 15) return '#991B1B';
  if (v <= 20) return '#ba1a1a';
  if (v <= 40) return '#FFD700';
  if (v <= 60) return '#8EC849';
  return '#2C5E2E';
};

export const getColorForK = (val: number | null): string => {
  const v = getSafeValue(val);
  if (v === null) return '#9CA3AF';
  
  if (v < 100) return '#991B1B';
  if (v <= 200) return '#ba1a1a';
  if (v <= 400) return '#FFD700';
  if (v <= 600) return '#8EC849';
  return '#2C5E2E';
};
