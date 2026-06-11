import { apiClient } from './axios';
import type { 
  GeoJSONFeatureCollection, 
  GeoJSONFeature, 
  AdvisoryRead,
  HaraAreaUpdate,
  AdvisoryCreate,
  AdvisoryUpdate,
  HaraAreaCreate,
  MacroAnalyticsRead
} from '../types/api.types';

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

  updateArea: async (areaId: number, data: HaraAreaUpdate): Promise<GeoJSONFeature> => {
    const response = await apiClient.patch<GeoJSONFeature>(`/api/v1/expert/hara/areas/${areaId}`, data);
    return response.data;
  },

  createAdvisory: async (areaId: number, data: AdvisoryCreate): Promise<AdvisoryRead> => {
    const response = await apiClient.post<AdvisoryRead>(`/api/v1/expert/hara/areas/${areaId}/advisories`, data);
    return response.data;
  },

  updateAdvisory: async (advisoryId: number, data: AdvisoryUpdate): Promise<AdvisoryRead> => {
    const response = await apiClient.patch<AdvisoryRead>(`/api/v1/expert/advisories/${advisoryId}`, data);
    return response.data;
  },

  createArea: async (data: HaraAreaCreate): Promise<GeoJSONFeature> => {
    const response = await apiClient.post<GeoJSONFeature>('/api/v1/expert/hara/areas', data);
    return response.data;
  },

  getMacroAnalytics: async (): Promise<MacroAnalyticsRead> => {
    const response = await apiClient.get<MacroAnalyticsRead>('/api/v1/expert/analytics');
    return response.data;
  },
};

