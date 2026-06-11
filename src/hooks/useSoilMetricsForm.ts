import { useState, useEffect } from 'react';
import { haraService } from '../services/hara.service';
import { useToast } from '../contexts/ToastContext';
import type { GeoJSONFeature } from '../types/api.types';

export function useSoilMetricsForm(
  selectedFeature: GeoJSONFeature | null,
  onAreaUpdate: (updatedFeature: GeoJSONFeature) => void
) {
  const { showToast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    ph_rata2: '',
    n_rata2: '',
    p_rata2: '',
    k_rata2: '',
    slope__: '',
    texture_of: ''
  });

  useEffect(() => {
    if (selectedFeature) {
      const { properties } = selectedFeature;

      const formatValue = (val: number | undefined | null) => {
        if (val === -9999 || val === undefined || val === null) return '';
        return val.toString();
      };

      const formatKValue = (val: number | undefined | null) => {
        if (val === -9999 || val === undefined || val === null) return '';
        return (val / 10).toString();
      };

      setFormData({
        name: properties.name || '',
        ph_rata2: formatValue(properties.ph_rata2),
        n_rata2: formatValue(properties.n_rata2),
        p_rata2: formatValue(properties.p_rata2),
        k_rata2: formatKValue(properties.k_rata2),
        slope__: properties.slope__ || '',
        texture_of: properties.texture_of || ''
      });
    }
  }, [selectedFeature, isEditing]);

  const handleSaveArea = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFeature) return;
    setIsSubmitting(true);

    try {
      const ph = formData.ph_rata2.trim() === '' ? null : parseFloat(formData.ph_rata2);
      const n = formData.n_rata2.trim() === '' ? null : parseFloat(formData.n_rata2);
      const p = formData.p_rata2.trim() === '' ? null : parseFloat(formData.p_rata2);
      const k = formData.k_rata2.trim() === '' ? null : parseFloat(formData.k_rata2);

      if (ph !== null && (ph < 0 || ph > 14)) {
        showToast('pH tanah harus bernilai antara 0 dan 14', 'error');
        setIsSubmitting(false);
        return;
      }
      if (n !== null && n < 0) {
        showToast('Nitrogen (N) harus bernilai >= 0', 'error');
        setIsSubmitting(false);
        return;
      }
      if (p !== null && p < 0) {
        showToast('Fosfor (P) harus bernilai >= 0', 'error');
        setIsSubmitting(false);
        return;
      }
      if (k !== null && k < 0) {
        showToast('Kalium (K) harus bernilai >= 0', 'error');
        setIsSubmitting(false);
        return;
      }

      const payload = {
        name: formData.name.trim() || null,
        ph_rata2: ph,
        n_rata2: n,
        p_rata2: p,
        k_rata2: k !== null ? k * 10 : null,
        slope__: formData.slope__.trim() || null,
        texture_of: formData.texture_of.trim() || null
      };

      const updatedFeature = await haraService.updateArea(selectedFeature.properties.id, payload);
      onAreaUpdate(updatedFeature);
      showToast('Data hara area berhasil diperbarui', 'success');
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update area properties:', error);
      showToast('Gagal memperbarui data hara area', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isEditing,
    setIsEditing,
    isSubmitting,
    formData,
    setFormData,
    handleSaveArea
  };
}
