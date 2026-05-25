import { useState, useEffect } from 'react';
import { 
  XMarkIcon, 
  InformationCircleIcon,
  BookmarkIcon
} from '@heroicons/react/24/outline';
import { haraService } from '../../services/hara.service';
import { formatSlope, formatTexture, getPhBadge, getNBadge, getPBadge, getKBadge } from '../../utils/agronomyHelper';
import type { GeoJSONFeature, AdvisoryRead } from '../../types/api.types';

interface DataPanelProps {
  selectedFeature: GeoJSONFeature | null;
  onClose: () => void;
  onSaveClick: () => void;
}

export default function DataPanel({ selectedFeature, onClose, onSaveClick }: DataPanelProps) {
  const [advisories, setAdvisories] = useState<AdvisoryRead[]>([]);

  useEffect(() => {
    let isMounted = true;
    if (!selectedFeature) {
      setAdvisories([]);
      return;
    }

    const fetchAdvisories = async () => {

      try {
        const data = await haraService.getAdvisories(selectedFeature.properties.id);
        if (isMounted) setAdvisories(data);
      } catch (error) {
        if (isMounted) console.error('Failed to fetch advisories:', error);
      } finally {

      }
    };

    void fetchAdvisories();
    return () => { isMounted = false; };
  }, [selectedFeature]);

  if (!selectedFeature) return null;

  const { properties } = selectedFeature;

  return (
    <>
      {/* Overlay for mobile */}
      <div
        className="fixed inset-0 bg-on-surface/20 z-40 md:hidden transition-opacity"
        onClick={onClose}
      />

      <div
        className="absolute top-4 left-4 bottom-4 w-96 max-w-[calc(100vw-2rem)] z-[1000] bg-surface/95 backdrop-blur-md rounded-2xl shadow-2xl border border-outline-variant flex flex-col overflow-hidden transition-all duration-500 ease-out animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
        onPointerDown={(e) => e.stopPropagation()}
        onDoubleClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
        onWheel={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col h-full">
          {/* Drag handle for mobile */}
          <div className="w-full flex justify-center pt-4 pb-2 md:hidden">
            <div className="w-16 h-1.5 bg-outline-variant rounded-full" />
          </div>

          <div className="px-6 py-4 border-b border-outline-variant/50 flex justify-between items-center md:pt-6">
            <h2 className="text-xl font-bold text-on-surface font-display tracking-tight">
              Informasi Lahan
            </h2>
            <button
              onClick={onClose}
              className="p-2 -mr-2 text-on-surface-variant hover:text-primary hover:bg-surface-dim rounded-full transition-all"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          <div className="p-6 flex-1 overflow-y-auto space-y-6 scrollbar-hide">
            {/* Soil Metrics List */}
            <div>
              <h3 className="font-semibold text-on-surface mb-3 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-tertiary rounded-full"></span>
                Indikator Kesuburan
              </h3>
              <div className="flex flex-col gap-3">
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
            </div>

            {/* Karakteristik Fisik */}
            <div>
              <h3 className="font-semibold text-on-surface mb-3 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-secondary rounded-full"></span>
                Karakteristik Fisik
              </h3>
              <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/50 p-4 space-y-4">
                <div className="flex justify-between items-center border-b border-outline-variant/30 pb-3">
                  <div className="text-sm font-display font-bold text-on-surface flex items-center gap-1.5 relative group">
                    Seri Klasifikasi
                    <InformationCircleIcon className="w-4 h-4 text-on-surface-variant/70 cursor-help" />
                    <div className="absolute left-0 bottom-full mb-2 w-48 p-2 bg-on-surface text-surface text-xs font-sans rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 pointer-events-none">
                      Nama seri tanah atau Type Locality yang mewakili area ini.
                    </div>
                  </div>
                  <div className="text-sm font-sans font-medium text-on-surface-variant text-right">{properties.name || 'Tidak tersedia'}</div>
                </div>
                <div className="flex justify-between items-center border-b border-outline-variant/30 pb-3">
                  <div className="text-sm font-display font-bold text-on-surface">Kemiringan Lereng</div>
                  <div className="text-sm font-sans font-medium text-on-surface-variant">{formatSlope(properties.slope__)}</div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="text-sm font-display font-bold text-on-surface">Tekstur Tanah</div>
                  <div className="text-sm font-sans font-medium text-on-surface-variant text-right max-w-[60%] leading-tight">{formatTexture(properties.texture_of)}</div>
                </div>
              </div>
            </div>

            {/* Rekomendasi Pakar */}
            {advisories.length > 0 && (
              <div>
                <h3 className="font-semibold text-on-surface mb-3 flex items-center gap-2">
                  <span className="w-1.5 h-6 bg-primary rounded-full"></span>
                  Rekomendasi Pakar
                </h3>
                <div className="space-y-4">
                  {advisories.map((adv) => (
                    <div key={adv.id} className="bg-surface-container-lowest border-l-4 border-tertiary p-5 rounded-r-2xl rounded-l-sm shadow-sm hover:shadow-md transition-shadow">
                      <h4 className="font-bold text-on-surface font-display mb-2">{adv.title}</h4>
                      <p className="text-sm text-on-surface-variant font-sans leading-relaxed">{adv.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={onSaveClick}
              className="w-full bg-primary text-white py-3.5 rounded-full font-bold font-display hover:bg-primary/90 transition-all shadow-md active:scale-95 mt-6 flex items-center justify-center gap-2 cursor-pointer"
            >
              <BookmarkIcon className="w-5 h-5" />
              Simpan Lahan Ini
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
