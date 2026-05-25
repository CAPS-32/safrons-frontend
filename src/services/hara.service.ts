import { apiClient } from './axios';
import type { GeoJSONFeatureCollection, GeoJSONFeature, AdvisoryRead } from '../types/api.types';

export const haraService = {
  getAreas: async (): Promise<GeoJSONFeatureCollection> => {
    const response = await apiClient.get<GeoJSONFeatureCollection>('/api/v1/hara/areas');
    return response.data;
  },

  getAreaById: async (id: number): Promise<GeoJSONFeature> => {
    const response = await apiClient.get<GeoJSONFeature>(`/api/v1/hara/areas/${id}`);
    return response.data;
  },

  getAreaByPoint: async (lon: number, lat: number): Promise<GeoJSONFeature> => {
    const response = await apiClient.get<GeoJSONFeature>(`/api/v1/hara/point?lon=${lon}&lat=${lat}`);
    return response.data;
  },

  getAdvisories: async (areaId: number): Promise<AdvisoryRead[]> => {
    const response = await apiClient.get<AdvisoryRead[]>(`/api/v1/hara/areas/${areaId}/advisories`);
    return response.data;
  },
};
