import { useState } from 'react';
import { useMap } from 'react-leaflet';
import { 
  MagnifyingGlassIcon, 
  MapPinIcon, 
  MapIcon, 
  ChevronDownIcon, 
  XMarkIcon, 
  AdjustmentsHorizontalIcon
} from '@heroicons/react/24/outline';
import { useToast } from '../../contexts/ToastContext';
import axios from 'axios';
import type { MapFilterType } from '../../layouts/DashboardLayout';
import { BASEMAPS, MAP_FILTERS } from '../../constants/map';

interface MapControlsProps {
  setCurrentLocation: (loc: { lat: number; lon: number } | null) => void;
  activeFilter: MapFilterType;
  setActiveFilter: (filter: MapFilterType) => void;
  activeBasemap: string;
  setActiveBasemap: (basemap: string) => void;
  setSearchedLocation: (loc: { lat: number; lon: number; name: string } | null) => void;
}

export const MapControls: React.FC<MapControlsProps> = ({ 
  setCurrentLocation,
  activeFilter,
  setActiveFilter,
  activeBasemap,
  setActiveBasemap,
  setSearchedLocation
}) => {
  const map = useMap();
  const { showToast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [isLocating, setIsLocating] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [showBasemaps, setShowBasemaps] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);



  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      // viewbox format: left,top,right,bottom (lon1,lat1,lon2,lat2)
      const viewbox = '106.2,-5.9,107.2,-7.6';
      
      const res = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&viewbox=${viewbox}&bounded=1`
      );
      
      if (res.data && res.data.length > 0) {
        const { lat, lon, display_name } = res.data[0];
        const parsedLat = parseFloat(lat);
        const parsedLon = parseFloat(lon);
        map.flyTo([parsedLat, parsedLon], 13);
        setSearchedLocation({ lat: parsedLat, lon: parsedLon, name: display_name });
        showToast('Lokasi ditemukan.', 'success');
      } else {
        showToast('Lokasi tidak ditemukan dalam area ketersediaan data.', 'error');
      }
    } catch (err) {
      console.error('Geocoding error:', err);
      showToast('Terjadi kesalahan pencarian.', 'error');
    } finally {
      setIsSearching(false);
    }
  };

  const locateUser = () => {
    if (!navigator.geolocation) {
      showToast('Geolocation tidak didukung oleh browser Anda.', 'error');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCurrentLocation({ lat: latitude, lon: longitude });
        map.flyTo([latitude, longitude], 14);
        setIsLocating(false);
      },
      (error) => {
        console.error('Geolocation error:', error);
        showToast('Tidak dapat menemukan lokasi Anda.', 'error');
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const stopPropagation = (e: React.SyntheticEvent) => {
    e.stopPropagation();
  };

  // Collapsed State
  if (!isExpanded) {
    return (
      <div 
        className="absolute top-4 right-4 z-[1000] pointer-events-auto"
        onPointerDown={stopPropagation}
        onDoubleClick={stopPropagation}
        onClick={stopPropagation}
      >
        <button 
          onClick={() => setIsExpanded(true)}
          className="w-14 h-14 bg-primary text-white rounded-full shadow-lg flex items-center justify-center hover:bg-primary/95 transition-all active:scale-95 cursor-pointer border-2 border-outline-variant"
          title="Buka Kontrol Peta"
        >
          <AdjustmentsHorizontalIcon className="w-7 h-7" />
        </button>
      </div>
    );
  }

  // Expanded State
  return (
    <div 
      className="absolute top-4 right-4 z-[1000] w-[calc(100vw-2rem)] max-w-xs md:w-80 bg-surface/95 backdrop-blur-md rounded-2xl border border-outline-variant shadow-2xl p-5 flex flex-col gap-4 pointer-events-auto transition-all duration-300 ease-out"
      onClick={stopPropagation}
      onPointerDown={stopPropagation}
      onDoubleClick={stopPropagation}
      onKeyDown={stopPropagation}
      onScroll={stopPropagation}
      onWheel={stopPropagation}
    >
      {/* Header */}
      <div className="flex justify-between items-center pb-2 border-b border-outline-variant/50">
        <h3 className="text-sm font-display font-bold text-primary">Kontrol Peta</h3>
        <button 
          onClick={() => setIsExpanded(false)}
          className="p-1 text-on-surface-variant hover:text-primary hover:bg-surface-dim rounded-full transition-all"
          title="Tutup Panel"
        >
          <XMarkIcon className="w-5 h-5" />
        </button>
      </div>

      {/* Search Bar & Locate */}
      <div className="flex flex-col gap-1.5">
        <span className="text-[11px] font-display font-bold text-on-surface-variant/80 tracking-wide uppercase">Cari Lokasi</span>
        <div className="flex items-center gap-1.5 bg-surface-container-lowest border border-outline rounded-xl p-1.5 shadow-sm">
          <form onSubmit={handleSearch} className="flex flex-1 items-center bg-transparent">
            <input 
              type="text" 
              placeholder="Cari lokasi pertanian..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-2.5 py-1.5 text-xs outline-none text-on-surface bg-transparent font-sans font-medium placeholder:text-on-surface-variant/70 min-w-0"
            />
            {searchQuery && (
              <button 
                type="button" 
                onClick={() => { setSearchQuery(''); setSearchedLocation(null); }}
                className="p-1 mr-1 text-on-surface-variant hover:text-error transition-colors"
                title="Hapus pencarian"
              >
                <XMarkIcon className="w-4 h-4" />
              </button>
            )}
            <button type="submit" disabled={isSearching} className="p-1.5 text-primary hover:bg-surface-dim transition-colors rounded-full disabled:opacity-50">
              <MagnifyingGlassIcon className="w-4 h-4" />
            </button>
          </form>
          
          <div className="w-px h-6 bg-outline-variant mx-0.5"></div>

          <button 
            type="button"
            onClick={locateUser} 
            disabled={isLocating}
            className="p-2 bg-primary text-white hover:bg-primary/90 rounded-full transition-colors disabled:opacity-50 flex items-center justify-center shrink-0 shadow-sm"
            title="Lokasi Saya"
          >
            <MapPinIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Basemap Selector */}
      <div className="flex flex-col gap-1.5">
        <span className="text-[11px] font-display font-bold text-on-surface-variant/80 tracking-wide uppercase">Pilihan Basemap</span>
        <div className="bg-surface-container-low rounded-xl border border-outline-variant p-1.5 flex flex-col gap-1 relative">
          <button 
            onClick={() => setShowBasemaps(!showBasemaps)} 
            className="flex justify-between items-center w-full px-2.5 py-2.5 text-xs font-sans font-semibold text-on-surface hover:bg-surface-dim rounded-lg transition-colors"
          >
            <div className="flex items-center gap-2">
              <MapIcon className="w-5 h-5 text-primary shrink-0" />
              <span>{BASEMAPS.find(b => b.id === activeBasemap)?.name}</span>
            </div>
            <ChevronDownIcon className={`w-4 h-4 transition-transform ${showBasemaps ? 'rotate-180' : ''}`} />
          </button>
          {showBasemaps && (
            <div className="flex flex-col gap-1 mt-1 border-t border-outline-variant/30 pt-1.5">
              {BASEMAPS.map(b => (
                <button 
                  key={b.id} 
                  onClick={() => { setActiveBasemap(b.id); setShowBasemaps(false); }} 
                  className={`text-left px-2.5 py-1.5 text-xs font-sans rounded-lg transition-colors ${activeBasemap === b.id ? 'bg-primary/10 text-primary font-bold' : 'text-on-surface-variant hover:bg-surface-dim hover:text-on-surface'}`}
                >
                  {b.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Filter Panel */}
      <div className="flex flex-col gap-1.5">
        <span className="text-[11px] font-display font-bold text-on-surface-variant/80 tracking-wide uppercase">Filter Unsur Hara</span>
        <div className="grid grid-cols-2 gap-2">
          {MAP_FILTERS.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveFilter(item.id as MapFilterType)}
              className={`flex flex-col items-center justify-center p-3.5 rounded-2xl border transition-all text-center cursor-pointer ${
                activeFilter === item.id 
                  ? 'bg-primary border-primary text-on-primary shadow-md scale-95 font-bold' 
                  : 'bg-surface-bright border-outline-variant text-on-surface hover:border-primary/50 hover:text-primary font-medium hover:bg-primary/5'
              }`}
            >
              <span className="text-xs font-display font-bold">{item.label}</span>
              <span className={`text-[9px] font-sans ${activeFilter === item.id ? 'text-on-primary/80' : 'text-on-surface-variant/70'}`}>{item.desc}</span>
            </button>
          ))}
        </div>
        <button
          onClick={() => setActiveFilter('none')}
          className={`w-full py-2.5 mt-1 rounded-xl transition-all text-xs font-display font-bold border cursor-pointer ${
            activeFilter === 'none'
              ? 'bg-primary/10 border-primary text-primary shadow-sm'
              : 'bg-surface-dim border-transparent text-on-surface-variant hover:bg-surface-container-high'
          }`}
        >
          Reset Filter (Batas Wilayah)
        </button>
      </div>
    </div>
  );
};
