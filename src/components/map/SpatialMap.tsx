import React, { useEffect, useCallback, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { MapContainer, TileLayer, GeoJSON, Marker, Popup, useMap, Pane } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapLegend } from './MapLegend';
import { MapControls } from './MapControls';
import type { GeoJSONFeatureCollection, GeoJSONFeature } from '../../types/api.types';
import type { Layer, LeafletMouseEvent } from 'leaflet';
import type { MapFilterType } from '../../layouts/DashboardLayout';
import { useMapState } from '../../hooks/useMapState';
import {
  DEFAULT_CENTER,
  DEFAULT_ZOOM,
  MIN_ZOOM,
  BASEMAP_URLS,
  BASEMAP_LABELS_URLS,
  BASEMAP_ATTRIBUTIONS
} from '../../constants/map';

interface SpatialMapProps {
  geoData: GeoJSONFeatureCollection | null;
  onPolygonClick: (lon: number, lat: number, feature: GeoJSONFeature) => void;
  activeFilter: MapFilterType;
  setActiveFilter: (filter: MapFilterType) => void;
  currentLocation: { lat: number; lon: number } | null;
  setCurrentLocation: (loc: { lat: number; lon: number } | null) => void;
  selectedFeature: GeoJSONFeature | null;
}


// Current location (Lokasi Saya)
const customMarkerIcon = L.divIcon({
  className: 'custom-location-marker-container',
  html: `
    <div class="relative flex items-center justify-center w-6 h-6">
      <div class="absolute w-6 h-6 bg-tertiary rounded-full animate-ping opacity-60"></div>
      <div class="relative w-4.5 h-4.5 bg-tertiary border-2 border-primary rounded-full shadow-lg"></div>
    </div>
  `,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

// Search location (Hasil Pencarian)
const searchMarkerIcon = L.divIcon({
  className: 'custom-search-marker-container',
  html: `
    <div class="relative flex items-center justify-center w-8 h-8">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-8 h-8 text-error drop-shadow-md animate-bounce">
        <path fill-rule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd" />
      </svg>
    </div>
  `,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});


const MapEffects: React.FC = () => {
  const map = useMap();
  const location = useLocation();

  useEffect(() => {
    const state = location.state as { flyTo?: { lat: number; lon: number } } | null;
    if (state?.flyTo) {
      map.flyTo([state.flyTo.lat, state.flyTo.lon], 13);
    }
  }, [location.state, map]);

  return null;
};

export const SpatialMap: React.FC<SpatialMapProps> = ({
  geoData,
  onPolygonClick,
  activeFilter,
  setActiveFilter,
  currentLocation,
  setCurrentLocation,
  selectedFeature
}) => {
  const geoJsonRef = useRef<L.GeoJSON>(null);

  const {
    activeBasemap,
    setActiveBasemap,
    searchedLocation,
    setSearchedLocation,
    getPolygonStyle,
    styleRef
  } = useMapState(geoData, selectedFeature, activeFilter, onPolygonClick, geoJsonRef);

  const onEachFeature = useCallback((feature: GeoJSONFeature, layer: Layer) => {
    layer.on({
      mouseover: (e: LeafletMouseEvent) => {
        const target = e.target;
        target.setStyle({
          fillOpacity: 0.95,
          weight: 2,
        });
      },
      mouseout: (e: LeafletMouseEvent) => {
        const target = e.target;
        target.setStyle(styleRef.current(target.feature || feature));
      },
      click: (e: LeafletMouseEvent) => {
        const latLng = e.latlng;
        // Make sure we pass the updated feature from layer.feature if available
        onPolygonClick(latLng.lng, latLng.lat, (e.target as any).feature || feature);
      },
    });
  }, [onPolygonClick, styleRef]);

  const geoJsonLayer = React.useMemo(() => {
    if (!geoData) return null;
    return (
      <GeoJSON
        key={`geojson-layer-${geoData.features.length}`}
        ref={geoJsonRef}
        data={geoData}
        style={getPolygonStyle}
        onEachFeature={onEachFeature as any}
      />
    );
  }, [geoData, activeFilter, getPolygonStyle, onEachFeature]);

  return (
    <>
      <MapContainer
        center={DEFAULT_CENTER}
        zoom={DEFAULT_ZOOM}
        minZoom={MIN_ZOOM}
        className="h-full w-full z-0 relative"
        zoomControl={false}
        attributionControl={false}
      >
        <MapControls
          setCurrentLocation={setCurrentLocation}
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
          activeBasemap={activeBasemap}
          setActiveBasemap={setActiveBasemap}
          setSearchedLocation={setSearchedLocation}
        />
        <MapEffects />

        <TileLayer
          url={BASEMAP_URLS[activeBasemap]}
          attribution={BASEMAP_ATTRIBUTIONS[activeBasemap]}
        />

        {/* Memoized GeoJSON layer */}
        {geoJsonLayer}

        {/* Transparent basemap labels layer */}
        {BASEMAP_LABELS_URLS[activeBasemap] && (
          <Pane name="map-labels" style={{ zIndex: 450, pointerEvents: 'none' }}>
            <TileLayer
              url={BASEMAP_LABELS_URLS[activeBasemap]}
              attribution=""
              pane="map-labels"
            />
          </Pane>
        )}

        {currentLocation && (
          <Marker
            position={[currentLocation.lat, currentLocation.lon]}
            icon={customMarkerIcon}
          />
        )}

        {searchedLocation && (
          <Marker
            position={[searchedLocation.lat, searchedLocation.lon]}
            icon={searchMarkerIcon}
          >
            <Popup className="font-sans">
              <div className="font-display font-bold text-primary text-sm mb-1">Hasil Pencarian</div>
              <div className="text-xs text-on-surface-variant leading-relaxed max-w-[200px]">
                {searchedLocation.name}
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>

      {/* Custom attribution: show basemap provider credit while Leaflet's control is disabled */}
      <div className="absolute bottom-1 right-1 z-[1000] text-xs bg-white/80 dark:bg-surface/80 text-on-surface px-2 py-1 rounded pointer-events-none">
        <span dangerouslySetInnerHTML={{ __html: BASEMAP_ATTRIBUTIONS[activeBasemap] }} />
      </div>

      <MapLegend activeFilter={activeFilter} />
    </>
  );
};
