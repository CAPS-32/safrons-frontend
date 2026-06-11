import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../contexts/ToastContext';
import { haraService } from '../../services/hara.service';
import { 
  CloudArrowUpIcon, 
  CheckCircleIcon, 
  ExclamationTriangleIcon,
  SparklesIcon,
  ArrowTrendingDownIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import type { MacroAnalyticsRead } from '../../types/api.types';

export default function ExpertDashboardPage() {
  const { user, isLoading } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [geojsonFile, setGeojsonFile] = useState<File | null>(null);
  const [geometry, setGeometry] = useState<any | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Analytics State
  const [analytics, setAnalytics] = useState<MacroAnalyticsRead | null>(null);
  const [isAnalyticsLoading, setIsAnalyticsLoading] = useState(true);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    ph_rata2: '',
    n_rata2: '',
    p_rata2: '',
    k_rata2: '',
    slope__: '',
    texture_of: ''
  });

  const isExpert = user?.role === 'expert' || user?.role === 'admin';

  const fetchAnalytics = async () => {
    try {
      setIsAnalyticsLoading(true);
      const data = await haraService.getMacroAnalytics();
      setAnalytics(data);
    } catch (err) {
      console.error('Failed to fetch macro analytics:', err);
      showToast('Gagal memuat data analisis makro.', 'error');
    } finally {
      setIsAnalyticsLoading(false);
    }
  };

  // Guard routing & fetch initial analytics
  useEffect(() => {
    if (!isLoading && !isExpert) {
      showToast('Akses ditolak. Halaman ini hanya untuk Pakar.', 'error');
      void navigate('/dashboard');
    } else if (isExpert) {
      void fetchAnalytics();
    }
  }, [isExpert, isLoading, navigate, showToast]);

  if (isLoading || !isExpert) {
    return (
      <div className="flex h-screen items-center justify-center bg-surface">
        <div className="text-xl font-bold text-primary animate-pulse font-display">
          Memverifikasi Akses Pakar...
        </div>
      </div>
    );
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const processGeojsonFile = (file: File) => {
    setGeojsonFile(file);
    setValidationError(null);
    setGeometry(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const geojson = JSON.parse(text);

        let geom: any = null;
        if (geojson.type === 'FeatureCollection') {
          if (geojson.features && geojson.features.length > 0) {
            geom = geojson.features[0].geometry;
          } else {
            throw new Error('FeatureCollection tidak memiliki features.');
          }
        } else if (geojson.type === 'Feature') {
          geom = geojson.geometry;
        } else if (['Polygon', 'MultiPolygon'].includes(geojson.type)) {
          geom = geojson;
        }

        if (!geom || !['Polygon', 'MultiPolygon'].includes(geom.type)) {
          throw new Error('Geometri harus bertipe Polygon atau MultiPolygon.');
        }

        if (!geom.coordinates || !geom.coordinates.length) {
          throw new Error('Koordinat geometri kosong atau tidak valid.');
        }

        setGeometry(geom);
        showToast('File GeoJSON berhasil divalidasi.', 'success');
      } catch (err: any) {
        console.error('Failed to parse GeoJSON:', err);
        setValidationError(err.message || 'Gagal membaca file GeoJSON. Pastikan format file benar.');
        showToast('Gagal memvalidasi GeoJSON.', 'error');
      }
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processGeojsonFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processGeojsonFile(e.target.files[0]);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleReset = () => {
    setGeojsonFile(null);
    setGeometry(null);
    setValidationError(null);
    setFormData({
      name: '',
      ph_rata2: '',
      n_rata2: '',
      p_rata2: '',
      k_rata2: '',
      slope__: '',
      texture_of: ''
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    showToast('Draft lahan berhasil dihapus.', 'success');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!geometry) {
      showToast('Silakan unggah file GeoJSON terlebih dahulu.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const ph = formData.ph_rata2.trim() === '' ? null : parseFloat(formData.ph_rata2);
      const n = formData.n_rata2.trim() === '' ? null : parseFloat(formData.n_rata2);
      const p = formData.p_rata2.trim() === '' ? null : parseFloat(formData.p_rata2);
      const k = formData.k_rata2.trim() === '' ? null : parseFloat(formData.k_rata2);

      if (ph !== null && (ph < 0 || ph > 14)) {
        showToast('pH tanah harus bernilai antara 0 dan 14.', 'error');
        setIsSubmitting(false);
        return;
      }
      if (n !== null && n < 0) {
        showToast('Nitrogen (N) harus bernilai >= 0.', 'error');
        setIsSubmitting(false);
        return;
      }
      if (p !== null && p < 0) {
        showToast('Fosfor (P) harus bernilai >= 0.', 'error');
        setIsSubmitting(false);
        return;
      }
      if (k !== null && k < 0) {
        showToast('Kalium (K) harus bernilai >= 0.', 'error');
        setIsSubmitting(false);
        return;
      }

      const processedProperties = {
        name: formData.name.trim() || null,
        ph_rata2: ph === null ? -9999 : ph,
        n_rata2: n === null ? -9999 : n,
        p_rata2: p === null ? -9999 : p,
        k_rata2: k === null ? -9999 : k * 10,
        slope__: formData.slope__.trim() || null,
        texture_of: formData.texture_of.trim() || null
      };

      const payload = {
        geometry,
        properties: processedProperties
      };

      await haraService.createArea(payload);
      showToast('Area lahan baru berhasil ditambahkan.', 'success');
      
      // Reset State
      setGeojsonFile(null);
      setGeometry(null);
      setFormData({
        name: '',
        ph_rata2: '',
        n_rata2: '',
        p_rata2: '',
        k_rata2: '',
        slope__: '',
        texture_of: ''
      });
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      // Re-fetch analytics to update KPI cards immediately
      void fetchAnalytics();
    } catch (error) {
      console.error('Failed to create hara area:', error);
      showToast('Gagal menambahkan area lahan baru.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Math variables for distributions
  const phDist = analytics?.ph_distribution;
  const totalPh = phDist 
    ? (phDist.sangat_masam + phDist.masam + phDist.sedikit_masam + phDist.netral + phDist.sedikit_alkalis + phDist.alkalis)
    : 0;

  const getPercent = (val: number) => {
    if (totalPh === 0) return 0;
    return Math.round((val / totalPh) * 100);
  };

  return (
    <div className="h-full bg-surface-dim p-4 md:p-10 overflow-y-auto pb-24 pointer-events-auto relative z-20">
      <div className="max-w-6xl mx-auto">
        {/* Section 1 Title: Analisis Makro Kesuburan Lahan Regional */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold font-display text-on-surface tracking-tight flex items-center gap-3">
            <SparklesIcon className="w-8 h-8 text-primary" />
            Analisis Makro Kesuburan Lahan Regional
          </h2>
          <p className="text-on-surface-variant mt-2 text-sm md:text-base">
            Analisis kondisi makro kesuburan lahan secara regional berdasarkan data hara tanah saat ini.
          </p>
        </div>

        {/* SECTION 1: MACRO DATA ANALYTICS */}
        <div className="space-y-8 mb-10">
          {isAnalyticsLoading ? (
            /* Pulsing Skeleton Loaders */
            <div className="space-y-8 animate-pulse">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="bg-surface-container-lowest border border-outline-variant/50 rounded-2xl p-5 h-28"></div>
                ))}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-surface-container-lowest border border-outline-variant/50 rounded-3xl p-6 h-80"></div>
                <div className="bg-surface-container-lowest border border-outline-variant/50 rounded-3xl p-6 h-80"></div>
              </div>
            </div>
          ) : (
            <>
              {/* Row 1: KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <div className="bg-surface-container-lowest border border-outline-variant/50 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow">
                  <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block mb-1">pH Tanah Rata-Rata</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold font-display text-on-surface">
                      {analytics?.averages.ph ? analytics.averages.ph.toFixed(2) : '-'}
                    </span>
                    <span className="text-xs font-semibold text-primary">Regional</span>
                  </div>
                  <div className="mt-2.5 h-1.5 w-full bg-outline-variant rounded-full overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: `${(analytics?.averages.ph || 0) * 7.1}%` }}></div>
                  </div>
                </div>

                <div className="bg-surface-container-lowest border border-outline-variant/50 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow">
                  <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block mb-1">Rerata Nitrogen (N)</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold font-display text-on-surface">
                      {analytics?.averages.n ? analytics.averages.n.toFixed(2) : '-'}
                    </span>
                    <span className="text-xs font-semibold text-on-surface-variant/70">ppm</span>
                  </div>
                  <div className="mt-2.5 h-1.5 w-full bg-outline-variant rounded-full overflow-hidden">
                    <div className="h-full bg-tertiary" style={{ width: `${Math.min((analytics?.averages.n || 0) * 1.3, 100)}%` }}></div>
                  </div>
                </div>

                <div className="bg-surface-container-lowest border border-outline-variant/50 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow">
                  <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block mb-1">Rerata Fosfor (P)</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold font-display text-on-surface">
                      {analytics?.averages.p ? analytics.averages.p.toFixed(2) : '-'}
                    </span>
                    <span className="text-xs font-semibold text-on-surface-variant/70">ppm</span>
                  </div>
                  <div className="mt-2.5 h-1.5 w-full bg-outline-variant rounded-full overflow-hidden">
                    <div className="h-full bg-[#8EC849]" style={{ width: `${Math.min((analytics?.averages.p || 0) * 1.6, 100)}%` }}></div>
                  </div>
                </div>

                <div className="bg-surface-container-lowest border border-outline-variant/50 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow">
                  <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block mb-1">Rerata Kalium (K)</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold font-display text-on-surface">
                      {analytics?.averages.k ? analytics.averages.k.toFixed(2) : '-'}
                    </span>
                    <span className="text-xs font-semibold text-on-surface-variant/70">mg/100g</span>
                  </div>
                  <div className="mt-2.5 h-1.5 w-full bg-outline-variant rounded-full overflow-hidden">
                    <div className="h-full bg-secondary" style={{ width: `${Math.min((analytics?.averages.k || 0) * 2.5, 100)}%` }}></div>
                  </div>
                </div>
              </div>

              {/* Row 2: Two-Column Layout */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left: pH Distribution */}
                <div className="bg-surface-container-lowest border border-outline-variant/50 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-bold font-display text-on-surface mb-1 flex items-center gap-2">
                      <ChartBarIcon className="w-5 h-5 text-primary" />
                      Distribusi Tingkat Keasaman (pH)
                    </h3>
                    <p className="text-xs text-on-surface-variant mb-4">Grafik penyebaran kondisi tingkat keasaman tanah regional.</p>
                  </div>
                  
                  {totalPh > 0 && phDist ? (
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-xs font-bold mb-1">
                          <span className="text-on-surface-variant">Sangat Masam (&lt; 4.5)</span>
                          <span className="text-on-surface">{phDist.sangat_masam} ({getPercent(phDist.sangat_masam)}%)</span>
                        </div>
                        <div className="w-full bg-surface-dim h-2 rounded-full overflow-hidden">
                          <div className="h-full bg-[#991B1B]" style={{ width: `${getPercent(phDist.sangat_masam)}%` }}></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-xs font-bold mb-1">
                          <span className="text-on-surface-variant">Masam (4.5 - 5.5)</span>
                          <span className="text-on-surface">{phDist.masam} ({getPercent(phDist.masam)}%)</span>
                        </div>
                        <div className="w-full bg-surface-dim h-2 rounded-full overflow-hidden">
                          <div className="h-full bg-error" style={{ width: `${getPercent(phDist.masam)}%` }}></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-xs font-bold mb-1">
                          <span className="text-on-surface-variant">Sedikit Masam (5.5 - 6.5)</span>
                          <span className="text-on-surface">{phDist.sedikit_masam} ({getPercent(phDist.sedikit_masam)}%)</span>
                        </div>
                        <div className="w-full bg-surface-dim h-2 rounded-full overflow-hidden">
                          <div className="h-full bg-[#F97316]" style={{ width: `${getPercent(phDist.sedikit_masam)}%` }}></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-xs font-bold mb-1">
                          <span className="text-on-surface-variant">Netral (6.5 - 7.5)</span>
                          <span className="text-on-surface">{phDist.netral} ({getPercent(phDist.netral)}%)</span>
                        </div>
                        <div className="w-full bg-surface-dim h-2 rounded-full overflow-hidden">
                          <div className="h-full bg-primary" style={{ width: `${getPercent(phDist.netral)}%` }}></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-xs font-bold mb-1">
                          <span className="text-on-surface-variant">Sedikit Alkalis (7.5 - 8.5)</span>
                          <span className="text-on-surface">{phDist.sedikit_alkalis} ({getPercent(phDist.sedikit_alkalis)}%)</span>
                        </div>
                        <div className="w-full bg-surface-dim h-2 rounded-full overflow-hidden">
                          <div className="h-full bg-[#3B82F6]" style={{ width: `${getPercent(phDist.sedikit_alkalis)}%` }}></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-xs font-bold mb-1">
                          <span className="text-on-surface-variant">Alkalis (&gt; 8.5)</span>
                          <span className="text-on-surface">{phDist.alkalis} ({getPercent(phDist.alkalis)}%)</span>
                        </div>
                        <div className="w-full bg-surface-dim h-2 rounded-full overflow-hidden">
                          <div className="h-full bg-[#1E3A8A]" style={{ width: `${getPercent(phDist.alkalis)}%` }}></div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="py-12 text-center text-xs text-on-surface-variant/70 font-semibold border border-dashed border-outline-variant/60 rounded-2xl">
                      Tidak ada data distribusi tingkat keasaman tanah.
                    </div>
                  )}
                </div>

                {/* Right: Critical Areas */}
                <div className="bg-surface-container-lowest border border-outline-variant/50 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-bold font-display text-on-surface mb-1 flex items-center gap-2">
                      <ArrowTrendingDownIcon className="w-5 h-5 text-error" />
                      Wilayah Kritis Defisiensi Hara
                    </h3>
                    <p className="text-xs text-on-surface-variant mb-4">Daftar 5 wilayah dengan kadar Nitrogen (N) atau Fosfor (P) terendah.</p>
                  </div>

                  {analytics?.critical_areas && analytics.critical_areas.length > 0 ? (
                    <div className="divide-y divide-outline-variant/40 flex-1 flex flex-col justify-center">
                      {analytics.critical_areas.map((area, idx) => (
                        <div key={area.id} className="py-3 flex items-center justify-between text-sm">
                          <div className="flex items-center gap-3">
                            <span className="w-5 h-5 rounded-full bg-error/10 text-error flex items-center justify-center text-xs font-bold">
                              {idx + 1}
                            </span>
                            <span className="font-semibold text-on-surface truncate max-w-[180px]">
                              {area.name}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-on-surface-variant font-medium">Defisiensi {area.parameter}</span>
                            <span className="bg-error-container text-error text-xs font-bold px-2 py-0.5 rounded">
                              {area.value.toFixed(1)} ppm
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-12 text-center text-xs text-on-surface-variant/70 font-semibold border border-dashed border-outline-variant/60 rounded-2xl">
                      Tidak ada wilayah kritis terdeteksi saat ini.
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        <hr className="my-10 border-outline-variant/70" />

        {/* SECTION 2: REGISTRASI LAHAN SPASIAL BARU */}
        <div>
          <div className="mb-6">
            <h2 className="text-2xl font-bold font-display text-on-surface flex items-center gap-2">
              <CloudArrowUpIcon className="w-7 h-7 text-primary" />
              Registrasi Lahan Spasial Baru
            </h2>
            <p className="text-sm text-on-surface-variant mt-1">
              Tambahkan area spasial tanah baru ke peta dengan mengunggah GeoJSON dan memasukkan data tanah awal.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Card 1: GeoJSON Upload */}
            <div className="bg-surface-container-lowest rounded-3xl p-6 md:p-8 border border-outline-variant shadow-md">
              <h3 className="text-lg font-bold font-display text-on-surface mb-4">
                1. Unggah Geometri Lahan
              </h3>

              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={triggerFileSelect}
                className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ${
                  isDragging 
                    ? 'border-primary bg-primary/5' 
                    : 'border-outline-variant hover:border-primary/50 bg-surface-bright/50'
                }`}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".geojson,application/json"
                  className="hidden"
                />
                
                <CloudArrowUpIcon className="w-16 h-16 text-on-surface-variant/60 mb-4" />
                <p className="font-display font-semibold text-on-surface text-center">
                  Tarik & Lepas file GeoJSON Anda di sini, atau <span className="text-primary hover:underline">pilih file</span>
                </p>
                <p className="text-xs text-on-surface-variant/70 mt-2 text-center">
                  Mendukung file .geojson dengan struktur geometri Polygon atau MultiPolygon.
                </p>
              </div>

              {geometry && (
                <div className="mt-4 flex items-center gap-2.5 bg-success/5 border border-success/15 p-4 rounded-xl text-success text-sm font-sans font-semibold">
                  <CheckCircleIcon className="w-5 h-5 shrink-0" />
                  <span>Geometri berhasil dibaca: {geometry.type} ({geojsonFile?.name})</span>
                </div>
              )}

              {validationError && (
                <div className="mt-4 flex items-center gap-2.5 bg-error/5 border border-error/15 p-4 rounded-xl text-error text-sm font-sans font-semibold">
                  <ExclamationTriangleIcon className="w-5 h-5 shrink-0" />
                  <span>{validationError}</span>
                </div>
              )}
            </div>

            {/* Card 2: Initial Soil Properties */}
            <div className="bg-surface-container-lowest rounded-3xl p-6 md:p-8 border border-outline-variant shadow-md">
              <h3 className="text-lg font-bold font-display text-on-surface mb-6">
                2. Metrik Hara & Karakteristik Fisik
              </h3>

              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant mb-1 font-display">
                    Seri Klasifikasi Lahan
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full bg-surface border border-outline-variant/80 px-4 py-3.5 rounded-xl text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-sans"
                    placeholder="Masukkan nama seri tanah (misal: Rancaekek)..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-on-surface-variant mb-1 font-display flex items-baseline justify-between">
                      <span>pH Tanah</span>
                      <span className="text-[10px] text-on-surface-variant/60 font-sans font-normal">(Batas: 0 - 14)</span>
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="14"
                      value={formData.ph_rata2}
                      onChange={(e) => setFormData(prev => ({ ...prev, ph_rata2: e.target.value }))}
                      className="w-full bg-surface border border-outline-variant/80 px-4 py-3.5 rounded-xl text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-sans"
                      placeholder="Masukkan nilai pH (contoh: 6.2)"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-on-surface-variant mb-1 font-display flex items-baseline justify-between">
                      <span>Nitrogen (N)</span>
                      <span className="text-[10px] text-on-surface-variant/60 font-sans font-normal">(Batas: ≥ 0 ppm)</span>
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.n_rata2}
                      onChange={(e) => setFormData(prev => ({ ...prev, n_rata2: e.target.value }))}
                      className="w-full bg-surface border border-outline-variant/80 px-4 py-3.5 rounded-xl text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-sans"
                      placeholder="Masukkan nilai N (contoh: 22.4)"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-on-surface-variant mb-1 font-display flex items-baseline justify-between">
                      <span>Fosfor (P)</span>
                      <span className="text-[10px] text-on-surface-variant/60 font-sans font-normal">(Batas: ≥ 0 ppm)</span>
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.p_rata2}
                      onChange={(e) => setFormData(prev => ({ ...prev, p_rata2: e.target.value }))}
                      className="w-full bg-surface border border-outline-variant/80 px-4 py-3.5 rounded-xl text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-sans"
                      placeholder="Masukkan nilai P (contoh: 15.6)"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-on-surface-variant mb-1 font-display flex items-baseline justify-between">
                      <span>Kalium (K)</span>
                      <span className="text-[10px] text-on-surface-variant/60 font-sans font-normal">(Batas: ≥ 0 mg/100g)</span>
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.k_rata2}
                      onChange={(e) => setFormData(prev => ({ ...prev, k_rata2: e.target.value }))}
                      className="w-full bg-surface border border-outline-variant/80 px-4 py-3.5 rounded-xl text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-sans"
                      placeholder="Masukkan nilai K (contoh: 18.2)"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-on-surface-variant mb-1 font-display">
                      Kemiringan Lereng (%)
                    </label>
                    <input
                      type="text"
                      value={formData.slope__}
                      onChange={(e) => setFormData(prev => ({ ...prev, slope__: e.target.value }))}
                      className="w-full bg-surface border border-outline-variant/80 px-4 py-3.5 rounded-xl text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-sans"
                      placeholder="Contoh: 0-8"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-on-surface-variant mb-1 font-display">
                      Tekstur Tanah
                    </label>
                    <input
                      type="text"
                      value={formData.texture_of}
                      onChange={(e) => setFormData(prev => ({ ...prev, texture_of: e.target.value }))}
                      className="w-full bg-surface border border-outline-variant/80 px-4 py-3.5 rounded-xl text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-sans"
                      placeholder="Contoh: Medium / Mod. Fine"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Action Area */}
            <div className="flex items-center gap-4">
              <button
                type="submit"
                disabled={isSubmitting || !geometry}
                className="flex-1 bg-primary text-white py-4 rounded-full font-bold font-display hover:bg-primary/95 shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Memproses Area...' : 'Buat Area Lahan Baru'}
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="px-8 bg-surface hover:bg-error/10 hover:text-error hover:border-error border border-outline text-on-surface-variant py-4 rounded-full font-bold font-display active:scale-95 transition-all cursor-pointer"
              >
                Hapus Draft
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
