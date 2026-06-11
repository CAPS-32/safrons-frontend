import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/navigation/Navbar';
import BottomNav from '../components/navigation/BottomNav';
import DataPanel from '../components/map/DataPanel';
import { SpatialMap } from '../components/map/SpatialMap';
import { SaveRegionModal } from '../components/map/SaveRegionModal';
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import { haraService } from '../services/hara.service';
import logoUrl from '../assets/icons/safrons.png';
import type { GeoJSONFeature, GeoJSONFeatureCollection } from '../types/api.types';

export type MapFilterType = 'none' | 'N' | 'P' | 'K' | 'pH';

export default function DashboardLayout() {
  const [geoData, setGeoData] = useState<GeoJSONFeatureCollection | null>(null);
  const [selectedFeature, setSelectedFeature] = useState<GeoJSONFeature | null>(null);
  const [clickedCoordinates, setClickedCoordinates] = useState<{ lon: number; lat: number } | null>(null);
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<MapFilterType>('none');
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    let isMounted = true;
    const fetchAreas = async () => {
      try {
        const data = await haraService.getAreas();
        if (isMounted) setGeoData(data);
      } catch (error) {
        if (isMounted) console.error('Failed to fetch hara areas:', error);
      }
    };
    void fetchAreas();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleAreaUpdate = useCallback((updatedFeature: GeoJSONFeature) => {
    setGeoData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        features: prev.features.map((f) =>
          f.properties.id === updatedFeature.properties.id ? updatedFeature : f
        ),
      };
    });
    setSelectedFeature(updatedFeature);
  }, []);

  useEffect(() => {
    const state = location.state as { flyToFeature?: GeoJSONFeature } | null;
    if (state?.flyToFeature) {
      setSelectedFeature(state.flyToFeature);
    } else {
      setSelectedFeature(null);
    }
  }, [location.pathname, location.state]);

  const handlePolygonClick = useCallback((lon: number, lat: number, feature: GeoJSONFeature) => {
    setSelectedFeature(feature);
    setClickedCoordinates({ lon, lat });
  }, []);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      void navigate('/login');
    }
  }, [isLoading, isAuthenticated, navigate]);

  if (isLoading) {
    return (
      <div className="flex flex-col h-screen w-screen items-center justify-center bg-surface transition-all duration-300">
        <div className="flex flex-col items-center justify-center space-y-5 animate-fade-in">
          <div className="relative flex items-center justify-center">
            <div className="absolute w-24 h-24 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
            <div className="w-16 h-16 bg-surface-container rounded-full flex items-center justify-center shadow-lg border border-outline-variant/30 animate-pulse">
              <img src={logoUrl} alt="SAFRONS Logo" className="w-10 h-10 object-contain" />
            </div>
          </div>
          <div className="flex flex-col items-center space-y-1">
            <span className="text-2xl font-black text-primary font-display tracking-wider">
              SAFRONS
            </span>
            <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest animate-pulse">
              Memuat Sistem...
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-surface pb-16 md:pb-0">
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1 relative overflow-hidden">
        {/* Fullscreen Map */}
        <div className="absolute inset-0 z-0">
          <SpatialMap
            geoData={geoData}
            onPolygonClick={handlePolygonClick}
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
            currentLocation={currentLocation}
            setCurrentLocation={setCurrentLocation}
            selectedFeature={selectedFeature}
          />
        </div>

        {/* Child routes */}
        <div className="relative z-10 pointer-events-none h-full">
          <Outlet />
        </div>

        {/* Data Panel */}
        <DataPanel
          selectedFeature={selectedFeature}
          onAreaUpdate={handleAreaUpdate}
          onClose={() => {
            setSelectedFeature(null);
          }}
          onSaveClick={() => setIsSaveModalOpen(true)}
        />
      </main>

      <BottomNav />

      {/* Save Region Modal */}
      <SaveRegionModal
        isOpen={isSaveModalOpen}
        onClose={() => setIsSaveModalOpen(false)}
        selectedFeature={selectedFeature}
        clickedCoordinates={clickedCoordinates}
      />
    </div>
  );
}
