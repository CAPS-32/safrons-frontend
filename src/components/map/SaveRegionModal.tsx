import React, { useState } from 'react';
import { savedRegionsService } from '../../services/savedRegions.service';
import { useToast } from '../../contexts/ToastContext';
import type { GeoJSONFeature } from '../../types/api.types';

interface SaveRegionModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedFeature: GeoJSONFeature | null;
  clickedCoordinates: { lon: number; lat: number } | null;
}

export const SaveRegionModal: React.FC<SaveRegionModalProps> = ({ isOpen, onClose, selectedFeature, clickedCoordinates }) => {
  const [label, setLabel] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const { showToast } = useToast();

  if (!isOpen || !selectedFeature || !clickedCoordinates) return null;

  const handleSave = async () => {
    if (!label.trim()) return;
    setIsSaving(true);
    try {
      await savedRegionsService.create(clickedCoordinates.lon, clickedCoordinates.lat, label);
      showToast('Lahan berhasil disimpan!', 'success');
      setLabel('');
      onClose();
    } catch (error) {
      console.error('Failed to save region:', error);
      showToast('Gagal menyimpan lahan. Silakan coba lagi.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-on-surface/40 backdrop-blur-sm p-4">
      <div className="bg-surface w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-fade-in-up">
        <div className="p-6">
          <h2 className="text-xl font-bold text-on-surface font-display mb-2">Simpan Lahan</h2>
          <p className="text-sm text-on-surface-variant mb-6">
            Berikan nama atau label untuk lokasi ini agar mudah ditemukan nanti.
          </p>

          <div className="space-y-4">
            <div>
              <label htmlFor="regionLabel" className="block text-sm font-medium text-on-surface mb-1">
                Nama/Label Lahan
              </label>
              <input
                id="regionLabel"
                type="text"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                className="w-full px-4 py-2 bg-surface border border-outline rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-on-surface"
                placeholder="Contoh: Kebun Tomat Blok A"
                autoFocus
              />
            </div>
            
            <div className="text-xs text-on-surface-variant bg-surface-container p-3 rounded-lg">
              <span className="font-semibold block mb-1">Data Area:</span>
              {selectedFeature.properties.name}<br/>
              Lon: {clickedCoordinates.lon.toFixed(4)}, Lat: {clickedCoordinates.lat.toFixed(4)}
            </div>
          </div>
        </div>

        <div className="px-6 py-4 bg-surface-container flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2 text-on-surface font-medium hover:bg-surface-variant rounded-full transition-colors"
          >
            Batal
          </button>
          <button
            onClick={handleSave}
            disabled={!label.trim() || isSaving}
            className="px-5 py-2 bg-primary text-white font-medium rounded-full hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? 'Menyimpan...' : 'Simpan'}
          </button>
        </div>
      </div>
    </div>
  );
};
