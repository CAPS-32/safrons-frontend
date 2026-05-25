import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/navigation/Navbar';
import BottomNav from '../components/navigation/BottomNav';
import DataPanel from '../components/map/DataPanel';
import { SpatialMap } from '../components/map/SpatialMap';
import { SaveRegionModal } from '../components/map/SaveRegionModal';
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import type { GeoJSONFeature } from '../types/api.types';

export type MapFilterType = 'none' | 'N' | 'P' | 'K' | 'pH';

export default function DashboardLayout() {

  const [selectedFeature, setSelectedFeature] = useState<GeoJSONFeature | null>(null);
  const [clickedCoordinates, setClickedCoordinates] = useState<{ lon: number; lat: number } | null>(null);
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<MapFilterType>('none');
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

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
      <div className="flex h-screen items-center justify-center bg-surface">
        <div className="text-xl font-bold text-primary animate-pulse font-display">
          Memuat SAFRONS...
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
