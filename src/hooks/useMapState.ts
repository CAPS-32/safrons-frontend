import { useState, useEffect, useCallback, useRef } from 'react';
import L from 'leaflet';
import booleanPointInPolygon from '@turf/boolean-point-in-polygon';
import { point } from '@turf/helpers';
import type { GeoJSONFeatureCollection, GeoJSONFeature } from '../types/api.types';
import type { PathOptions } from 'leaflet';
import type { MapFilterType } from '../layouts/DashboardLayout';
import { getColorForpH, getColorForN, getColorForP, getColorForK } from '../utils/agronomyHelper';

export function useMapState(
  geoData: GeoJSONFeatureCollection | null,
  selectedFeature: GeoJSONFeature | null,
  activeFilter: MapFilterType,
  onPolygonClick: (lon: number, lat: number, feature: GeoJSONFeature) => void,
  geoJsonRef: React.RefObject<L.GeoJSON | null>
) {
  const [activeBasemap, setActiveBasemap] = useState<string>('standar');
  const [searchedLocation, setSearchedLocation] = useState<{ lat: number; lon: number; name: string } | null>(null);

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
  }, [geoData, selectedFeature, activeFilter, getPolygonStyle, geoJsonRef]);

  return {
    activeBasemap,
    setActiveBasemap,
    searchedLocation,
    setSearchedLocation,
    getPolygonStyle,
    styleRef
  };
}
