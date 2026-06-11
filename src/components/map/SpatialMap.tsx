import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { MapContainer, TileLayer, GeoJSON, Marker, Popup, useMap, Pane } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import booleanPointInPolygon from '@turf/boolean-point-in-polygon';
import { point } from '@turf/helpers';
import { haraService } from '../../services/hara.service';
import { MapLegend } from './MapLegend';
import { MapControls } from './MapControls';
import type { GeoJSONFeatureCollection, GeoJSONFeature } from '../../types/api.types';
import type { Layer, LeafletMouseEvent, PathOptions } from 'leaflet';
import type { MapFilterType } from '../../layouts/DashboardLayout';
import { getColorForpH, getColorForN, getColorForP, getColorForK } from '../../utils/agronomyHelper';

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
  const [activeBasemap, setActiveBasemap] = useState<string>('standar');
  const [searchedLocation, setSearchedLocation] = useState<{ lat: number; lon: number; name: string } | null>(null);
  const geoJsonRef = useRef<L.GeoJSON>(null);

  const basemapUrls: Record<string, string> = {
    'satelit': 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    'standar': 'https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png',
    'jalan': 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png',
    'topografi': 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}'
  };

  const basemapLabelsUrls: Record<string, string | null> = {
    'satelit': 'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}',
    'standar': 'https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png',
    'jalan': 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager_only_labels/{z}/{x}/{y}{r}.png',
    'topografi': 'https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png'
  };

  const basemapAttributions: Record<string, string> = {
    'satelit': '&copy; ESRI',
    'standar': '&copy; CartoDB',
    'jalan': '&copy; CartoDB &copy; OpenStreetMap',
    'topografi': '&copy; ESRI'
  };

  // Automatically select polygon if searched location falls within one
  useEffect(() => {
    if (searchedLocation && geoData && geoData.features) {
      const searchPt = point([searchedLocation.lon, searchedLocation.lat]);
      let foundFeature: GeoJSONFeature | null = null;
      
      for (const feature of geoData.features) {
        if (feature.geometry && (feature.geometry.type === 'Polygon' || feature.geometry.type === 'MultiPolygon')) {
          if (booleanPointInPolygon(searchPt, feature as any)) {
            foundFeature = feature;
            break;
          }
        }
      }

      if (foundFeature) {
        onPolygonClick(searchedLocation.lon, searchedLocation.lat, foundFeature);
      }
    }
  }, [searchedLocation, geoData, onPolygonClick]);

  const getPolygonStyle = useCallback((feature: any): PathOptions => {
    const isSelected = selectedFeature && (
      feature.properties?.id === selectedFeature.properties?.id ||
      feature === selectedFeature
    );

    if (activeFilter === 'none') {
      return {
        fillOpacity: isSelected ? 0.3 : 0,
        weight: isSelected ? 4 : 1,
        color: isSelected ? '#FFD700' : '#2C5E2E',
      };
    }

    let fillColor = '#9CA3AF'; // Default to No Data color
    if (feature && feature.properties) {
      const { ph_rata2, n_rata2, p_rata2, k_rata2 } = feature.properties;

      if (activeFilter === 'pH') {
        fillColor = getColorForpH(ph_rata2);
      } else if (activeFilter === 'N') {
        fillColor = getColorForN(n_rata2);
      } else if (activeFilter === 'P') {
        fillColor = getColorForP(p_rata2);
      } else if (activeFilter === 'K') {
        fillColor = getColorForK(k_rata2);
      }
    }

    return {
      fillColor,
      weight: isSelected ? 4 : 1,
      color: isSelected ? '#FFD700' : '#EFF3EA',
      fillOpacity: isSelected ? 0.9 : 0.7,
    };
  }, [activeFilter, selectedFeature]);

  const styleRef = useRef(getPolygonStyle);
  useEffect(() => {
    styleRef.current = getPolygonStyle;
    if (geoJsonRef.current) {
      if (geoData) {
        const featureMap = new Map(geoData.features.map(f => [f.properties.id, f]));
        geoJsonRef.current.eachLayer((layer: any) => {
          const id = layer.feature?.properties?.id;
          if (id !== undefined) {
            const updatedFeature = featureMap.get(id);
            if (updatedFeature) {
              layer.feature = updatedFeature;
            }
          }
        });
      }
      geoJsonRef.current.setStyle(getPolygonStyle);
    }
  }, [geoData, selectedFeature, activeFilter, getPolygonStyle]);

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
  }, [onPolygonClick]);

  const hasData = geoData !== null;
  // Memoize the heavy GeoJSON layer
  const geoJsonLayer = React.useMemo(() => {
    if (!geoData) return null;
    return (
      <GeoJSON
        ref={geoJsonRef}
        data={geoData}
        style={getPolygonStyle}
        onEachFeature={onEachFeature as any}
      />
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasData, activeFilter]);

  return (
    <>
      <MapContainer
        center={[-6.595, 106.816]}
        zoom={12}
        minZoom={6}
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
          url={basemapUrls[activeBasemap]}
          attribution={basemapAttributions[activeBasemap]}
        />

        {/* Memoized GeoJSON layer */}
        {geoJsonLayer}

        {/* Transparent basemap labels layer */}
        {basemapLabelsUrls[activeBasemap] && (
          <Pane name="map-labels" style={{ zIndex: 450, pointerEvents: 'none' }}>
            <TileLayer
              url={basemapLabelsUrls[activeBasemap]!}
              attribution=""
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
          <Marker position={[searchedLocation.lat, searchedLocation.lon]}>
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
        <span dangerouslySetInnerHTML={{ __html: basemapAttributions[activeBasemap] }} />
      </div>

      <MapLegend activeFilter={activeFilter} />
    </>
  );
};
