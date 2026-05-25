import { apiClient } from './axios';
import type { SavedRegionRead } from '../types/api.types';

export const savedRegionsService = {
  getAll: async (): Promise<SavedRegionRead[]> => {
    const response = await apiClient.get<SavedRegionRead[]>('/api/v1/saved-regions');
    return response.data;
  },

  create: async (lon: number, lat: number, label: string): Promise<SavedRegionRead> => {
    const response = await apiClient.post<SavedRegionRead>('/api/v1/saved-regions', { lon, lat, label });
    return response.data;
  },

  update: async (id: number, label: string): Promise<SavedRegionRead> => {
    const response = await apiClient.patch<SavedRegionRead>(`/api/v1/saved-regions/${id}`, { label });
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/v1/saved-regions/${id}`);
  },
};
