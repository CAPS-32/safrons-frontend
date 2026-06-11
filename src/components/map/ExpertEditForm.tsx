import React, { useState, useEffect } from 'react';
import { CheckIcon, ArrowUturnLeftIcon } from '@heroicons/react/24/outline';
import { haraService } from '../../services/hara.service';

const SLOPE_OPTIONS = [
  { value: '<2', label: '<2% (Datar)' },
  { value: '0-8', label: '0-8% (Datar/Landai)' },
  { value: '2-8', label: '2-8% (Landai)' },
  { value: '9-15', label: '9-15% (Sedang)' },
  { value: '16-25', label: '16-25% (Curam)' },
  { value: '26-40', label: '26-40% (Sangat Curam)' },
  { value: '41-60', label: '41-60% (Sangat Curam/Terjal)' },
  { value: '>60', label: '>60% (Sangat Terjal)' }
];

const TEXTURE_OPTIONS = [
  { value: 'medium', label: 'Sedang (medium)' },
  { value: 'fine', label: 'Liat Halus (fine)' },
  { value: 'mod. fine', label: 'Liat Cukup Halus (mod. fine)' },
  { value: 'mod. coarse', label: 'Pasir Cukup Kasar (mod. coarse)' }
];

interface ExpertEditFormProps {
  formData: {
    name: string;
    ph_rata2: string;
    n_rata2: string;
    p_rata2: string;
    k_rata2: string;
    slope__: string;
    texture_of: string;
  };
  setFormData: React.Dispatch<
    React.SetStateAction<{
      name: string;
      ph_rata2: string;
      n_rata2: string;
      p_rata2: string;
      k_rata2: string;
      slope__: string;
      texture_of: string;
    }>
  >;
  isSubmitting: boolean;
  handleSaveArea: (e: React.FormEvent) => Promise<void>;
  setIsEditing: (val: boolean) => void;
}

export const ExpertEditForm: React.FC<ExpertEditFormProps> = ({
  formData,
  setFormData,
  isSubmitting,
  handleSaveArea,
  setIsEditing,
}) => {
  const [existingNames, setExistingNames] = useState<string[]>([]);
  const [isCustomName, setIsCustomName] = useState(false);

  useEffect(() => {
    const fetchExistingNames = async () => {
      try {
        const geojson = await haraService.getAreas();
        const names = Array.from(
          new Set(
            geojson.features
              .map((f) => f.properties.name)
              .filter((name): name is string => typeof name === 'string' && name.trim() !== '')
          )
        ).sort();
        setExistingNames(names);
      } catch (err) {
        console.error('Failed to fetch existing area names:', err);
      }
    };
    void fetchExistingNames();
  }, []);

  return (
    <form onSubmit={handleSaveArea} className="space-y-5">
      <h3 className="font-semibold text-on-surface mb-3 flex items-center gap-2">
        <span className="w-1.5 h-6 bg-primary rounded-full"></span>
        Form Edit Data Hara
      </h3>

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-on-surface-variant mb-1 font-display">
            Seri Klasifikasi Lahan
          </label>
          {!isCustomName && existingNames.length > 0 ? (
            <div className="flex flex-col gap-2">
              <select
                value={formData.name}
                onChange={(e) => {
                  if (e.target.value === '__custom__') {
                    setIsCustomName(true);
                    setFormData(prev => ({ ...prev, name: '' }));
                  } else {
                    setFormData(prev => ({ ...prev, name: e.target.value }));
                  }
                }}
                className="w-full bg-surface border border-outline-variant/80 px-3 py-2.5 rounded-xl text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-sans cursor-pointer"
              >
                <option value="">-- Pilih Seri Klasifikasi Lahan --</option>
                {existingNames.map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
                <option value="__custom__">Tulis Seri Baru...</option>
              </select>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                className="w-full bg-surface border border-outline-variant/80 px-3 py-2.5 rounded-xl text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-sans"
                placeholder="Masukkan nama seri klasifikasi baru..."
              />
              {existingNames.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    setIsCustomName(false);
                    setFormData(prev => ({ ...prev, name: '' }));
                  }}
                  className="text-xs text-primary self-start hover:underline font-bold transition-all"
                >
                  Pilih dari Seri yang Sudah Ada
                </button>
              )}
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-on-surface-variant mb-1 font-display">
              pH Tanah
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              max="14"
              value={formData.ph_rata2}
              onChange={(e) => setFormData((prev) => ({ ...prev, ph_rata2: e.target.value }))}
              className="w-full bg-surface border border-outline-variant/80 px-3 py-2.5 rounded-xl text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-sans"
              placeholder="Contoh: 6.5"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-on-surface-variant mb-1 font-display">
              Nitrogen (N)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={formData.n_rata2}
              onChange={(e) => setFormData((prev) => ({ ...prev, n_rata2: e.target.value }))}
              className="w-full bg-surface border border-outline-variant/80 px-3 py-2.5 rounded-xl text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-sans"
              placeholder="Contoh: 24.5"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-on-surface-variant mb-1 font-display">
              Fosfor (P)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={formData.p_rata2}
              onChange={(e) => setFormData((prev) => ({ ...prev, p_rata2: e.target.value }))}
              className="w-full bg-surface border border-outline-variant/80 px-3 py-2.5 rounded-xl text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-sans"
              placeholder="Contoh: 18.0"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-on-surface-variant mb-1 font-display">
              Kalium (K)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={formData.k_rata2}
              onChange={(e) => setFormData((prev) => ({ ...prev, k_rata2: e.target.value }))}
              className="w-full bg-surface border border-outline-variant/80 px-3 py-2.5 rounded-xl text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-sans"
              placeholder="Contoh: 15.4"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-on-surface-variant mb-1 font-display">
            Kemiringan Lereng (%)
          </label>
          <select
            value={formData.slope__}
            onChange={(e) => setFormData((prev) => ({ ...prev, slope__: e.target.value }))}
            className="w-full bg-surface border border-outline-variant/80 px-3 py-2.5 rounded-xl text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-sans cursor-pointer"
          >
            <option value="">-- Pilih Kemiringan Lereng --</option>
            {SLOPE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-on-surface-variant mb-1 font-display">
            Tekstur Tanah
          </label>
          <select
            value={formData.texture_of}
            onChange={(e) => setFormData((prev) => ({ ...prev, texture_of: e.target.value }))}
            className="w-full bg-surface border border-outline-variant/80 px-3 py-2.5 rounded-xl text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-sans cursor-pointer"
          >
            <option value="">-- Pilih Tekstur Tanah --</option>
            {TEXTURE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex items-center gap-3 pt-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 bg-primary text-white py-3 rounded-xl font-bold font-display hover:bg-primary/95 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          <CheckIcon className="w-4 h-4" />
          {isSubmitting ? 'Menyimpan...' : 'Simpan'}
        </button>
        <button
          type="button"
          onClick={() => setIsEditing(false)}
          disabled={isSubmitting}
          className="flex-1 bg-surface hover:bg-surface-container border border-outline text-on-surface py-3 rounded-xl font-bold font-display active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          <ArrowUturnLeftIcon className="w-4 h-4" />
          Batal
        </button>
      </div>
    </form>
  );
};
