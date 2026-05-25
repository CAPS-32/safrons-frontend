import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { savedRegionsService } from '../../services/savedRegions.service';
import { useToast } from '../../contexts/ToastContext';
import { MapPinIcon, MapIcon, TrashIcon } from '@heroicons/react/24/outline';
import { formatSlope, formatTexture, getPhBadge, getNBadge, getPBadge, getKBadge } from '../../utils/agronomyHelper';
import type { SavedRegionRead } from '../../types/api.types';

export default function SavedRecordsPage() {
  const [records, setRecords] = useState<SavedRegionRead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);
  const navigate = useNavigate();
  const { showToast } = useToast();

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const data = await savedRegionsService.getAll();
        setRecords(data);
      } catch (err) {
        console.error('Failed to fetch saved records:', err);
        setError('Gagal memuat lahan tersimpan. Silakan coba lagi.');
      } finally {
        setIsLoading(false);
      }
    };
    void fetchRecords();
  }, []);

  const confirmDelete = (id: number) => {
    setItemToDelete(id);
  };

  const handleDelete = async () => {
    if (itemToDelete === null) return;
    const id = itemToDelete;
    setItemToDelete(null);
    
    const originalRecords = [...records];
    
    setRecords((prev) => prev.filter((record) => record.id !== id));
    showToast('Lahan berhasil dihapus', 'success');

    try {
      await savedRegionsService.delete(id);
    } catch (err) {
      console.error('Failed to delete record:', err);
      setRecords(originalRecords);
      showToast('Gagal menghapus lahan. Silakan coba lagi.', 'error');
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center bg-surface-dim">
        <div className="animate-pulse font-display text-primary font-bold text-xl">Memuat data...</div>
      </div>
    );
  }

  return (
    <div className="h-full bg-surface-dim p-4 md:p-10 overflow-y-auto pb-24 pointer-events-auto relative z-20">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10">
          <h1 className="text-4xl font-bold font-display text-on-surface tracking-tight">Lahan Tersimpan</h1>
          <p className="text-on-surface-variant mt-2">Kelola dan pantau seluruh area pertanian yang telah Anda simpan.</p>
        </div>

        {error && (
          <div className="bg-error/10 text-error p-4 rounded-xl mb-6 font-medium">
            {error}
          </div>
        )}

        {records.length === 0 && !error ? (
          <div className="text-center py-20 bg-surface-container-lowest rounded-3xl shadow-sm border border-outline-variant">
            <MapIcon className="w-16 h-16 text-outline mx-auto mb-4" />
            <p className="text-on-surface-variant text-lg font-medium">Anda belum menyimpan lahan apapun.</p>
            <p className="text-on-surface-variant/70 mt-1">Eksplorasi peta untuk mulai memantau area pertanian Anda.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {records.map((record) => {
              const { properties } = record.area;
              const lon = record.selected_point?.coordinates?.[0] ?? 0;
              const lat = record.selected_point?.coordinates?.[1] ?? 0;

              return (
                <div key={record.id} className="bg-surface-container-lowest rounded-3xl p-6 border border-outline-variant shadow-md transition-all hover:shadow-xl hover:-translate-y-1 duration-300 flex flex-col pointer-events-none">
                  {/* 1. Header Block */}
                  <div className="mb-5">
                    <h2 className="text-xl font-bold text-on-surface font-display">{record.label}</h2>
                    <div className="flex items-center gap-1.5 mt-2.5 text-on-surface-variant/70 text-xs font-mono bg-surface-dim w-max px-2 py-1 rounded-md">
                      <MapPinIcon className="w-3.5 h-3.5" />
                      <span>{lat.toFixed(4)}, {lon.toFixed(4)}</span>
                    </div>
                  </div>
                  
                  {/* 2. Middle Block: Karakteristik Fisik */}
                  <div className="bg-surface-container-low p-4 rounded-xl mb-5 space-y-3 border border-outline-variant/50">
                    <div className="flex justify-between items-center border-b border-outline-variant/30 pb-3">
                      <span className="font-display text-sm font-bold text-on-surface">Seri Klasifikasi Tanah</span>
                      <span className="font-sans text-sm font-medium text-on-surface-variant text-right">{properties.name || 'Tidak tersedia'}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-outline-variant/30 pb-3">
                      <span className="font-display text-sm font-bold text-on-surface">Kemiringan Lereng</span>
                      <span className="font-sans text-sm font-medium text-on-surface-variant text-right">{formatSlope(properties.slope__)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-display text-sm font-bold text-on-surface">Tekstur Tanah</span>
                      <span className="font-sans text-sm font-medium text-on-surface-variant text-right">{formatTexture(properties.texture_of)}</span>
                    </div>
                  </div>

                  {/* 3. Bottom Block: Indikator Kesuburan */}
                  <div className="flex flex-col gap-3 mb-6">
                    <div className="flex justify-between items-center bg-surface-bright p-3 rounded-xl border border-outline-variant">
                      <span className="font-display text-sm font-bold text-on-surface w-1/3">pH Tanah</span>
                      <span className="font-sans font-medium text-on-surface-variant w-1/3 text-center">{properties.ph_rata2?.toFixed(2) || '-'}</span>
                      <div className="w-1/3 flex justify-end">{getPhBadge(properties.ph_rata2)}</div>
                    </div>
                    <div className="flex justify-between items-center bg-surface-bright p-3 rounded-xl border border-outline-variant">
                      <span className="font-display text-sm font-bold text-on-surface w-1/3">Nitrogen (N)</span>
                      <span className="font-sans font-medium text-on-surface-variant w-1/3 text-center">{properties.n_rata2?.toFixed(2) || '-'}</span>
                      <div className="w-1/3 flex justify-end">{getNBadge(properties.n_rata2)}</div>
                    </div>
                    <div className="flex justify-between items-center bg-surface-bright p-3 rounded-xl border border-outline-variant">
                      <span className="font-display text-sm font-bold text-on-surface w-1/3">Fosfor (P)</span>
                      <span className="font-sans font-medium text-on-surface-variant w-1/3 text-center">{properties.p_rata2?.toFixed(2) || '-'}</span>
                      <div className="w-1/3 flex justify-end">{getPBadge(properties.p_rata2)}</div>
                    </div>
                    <div className="flex justify-between items-center bg-surface-bright p-3 rounded-xl border border-outline-variant">
                      <span className="font-display text-sm font-bold text-on-surface w-1/3">Kalium (K)</span>
                      <span className="font-sans font-medium text-on-surface-variant w-1/3 text-center">
                        {(properties.k_rata2 !== undefined && properties.k_rata2 !== null && properties.k_rata2 !== -9999) 
                          ? (properties.k_rata2 / 10).toFixed(2) 
                          : '-'}
                      </span>
                      <div className="w-1/3 flex justify-end">{getKBadge(properties.k_rata2)}</div>
                    </div>
                  </div>

                  {/* 4. Action Buttons */}
                  <div className="flex items-center gap-3 mt-auto pointer-events-auto">
                    <button
                      onClick={() => navigate('/dashboard', { state: { flyToFeature: record.area, flyTo: { lat, lon } } })}
                      className="flex-1 bg-primary text-white py-2.5 px-4 rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                    >
                      <MapPinIcon className="w-5 h-5" />
                      Lihat di Peta
                    </button>
                    <button
                      onClick={() => confirmDelete(record.id)}
                      className="p-2.5 text-on-surface-variant hover:text-error hover:bg-error/10 rounded-xl transition-colors border border-outline-variant hover:border-error/20 cursor-pointer"
                      title="Hapus Lahan"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {itemToDelete !== null && createPortal(
        <div className="fixed inset-0 bg-on-surface/50 backdrop-blur-sm z-[3000] flex items-center justify-center p-4 pointer-events-auto">
          <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-xl w-96 max-w-full animate-fade-in-up border border-outline-variant">
            <h3 className="font-display font-bold text-lg text-on-surface mb-2">Hapus Lahan Tersimpan?</h3>
            <p className="font-sans text-on-surface-variant mb-6">Apakah Anda yakin ingin menghapus data wilayah ini dari daftar pantauan Anda?</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setItemToDelete(null)}
                className="font-sans px-4 py-2 rounded-full border border-outline text-on-surface-variant hover:bg-surface-dim transition-colors font-medium cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={handleDelete}
                className="font-sans bg-error text-white hover:bg-error/90 rounded-full px-5 py-2 transition-colors font-bold shadow-md cursor-pointer"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
