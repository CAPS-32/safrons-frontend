import { apiClient } from './axios';
import type { GlossaryTerm, GlossaryCreate, GlossaryUpdate } from '../types/api.types';

export const glossaryService = {
  getAll: async (): Promise<GlossaryTerm[]> => {
    const response = await apiClient.get<GlossaryTerm[]>('/api/v1/glossaries');
    return response.data;
  },

  create: async (data: GlossaryCreate): Promise<GlossaryTerm> => {
    const response = await apiClient.post<GlossaryTerm>('/api/v1/expert/glossaries', data);
    return response.data;
  },

  update: async (id: number, data: GlossaryUpdate): Promise<GlossaryTerm> => {
    const response = await apiClient.put<GlossaryTerm>(`/api/v1/expert/glossaries/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/v1/expert/glossaries/${id}`);
  },
};
