import { useState, useEffect } from 'react';
import { haraService } from '../services/hara.service';
import { useToast } from '../contexts/ToastContext';
import type { AdvisoryRead, GeoJSONFeature } from '../types/api.types';

export function useHaraAdvisories(selectedFeature: GeoJSONFeature | null) {
  const { showToast } = useToast();
  const [advisories, setAdvisories] = useState<AdvisoryRead[]>([]);
  const [isAddingAdvisory, setIsAddingAdvisory] = useState(false);
  const [newAdvisoryFormData, setNewAdvisoryFormData] = useState({
    title: '',
    content: '',
    category: 'general' as 'soil' | 'fertilizer' | 'general',
    is_active: true
  });

  const [editingAdvisoryId, setEditingAdvisoryId] = useState<number | null>(null);
  const [advisoryFormData, setAdvisoryFormData] = useState({
    title: '',
    content: '',
    category: 'general' as 'soil' | 'fertilizer' | 'general',
    is_active: true
  });

  useEffect(() => {
    let isMounted = true;
    if (!selectedFeature) {
      setAdvisories([]);
      setIsAddingAdvisory(false);
      setEditingAdvisoryId(null);
      return;
    }

    const fetchAdvisories = async () => {
      try {
        const data = await haraService.getAdvisories(selectedFeature.properties.id);
        if (isMounted) setAdvisories(data);
      } catch (error) {
        if (isMounted) console.error('Failed to fetch advisories:', error);
      }
    };

    void fetchAdvisories();
    return () => {
      isMounted = false;
    };
  }, [selectedFeature]);

  const handleCreateAdvisory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFeature) return;
    if (!newAdvisoryFormData.title.trim() || !newAdvisoryFormData.content.trim()) {
      showToast('Judul dan Isi rekomendasi harus diisi', 'error');
      return;
    }

    try {
      const created = await haraService.createAdvisory(selectedFeature.properties.id, {
        title: newAdvisoryFormData.title.trim(),
        content: newAdvisoryFormData.content.trim(),
        category: newAdvisoryFormData.category,
        is_active: newAdvisoryFormData.is_active
      });

      setAdvisories((prev) => [...prev, created]);
      setIsAddingAdvisory(false);
      setNewAdvisoryFormData({
        title: '',
        content: '',
        category: 'general',
        is_active: true
      });
      showToast('Rekomendasi baru berhasil ditambahkan', 'success');
    } catch (error) {
      console.error('Failed to create advisory:', error);
      showToast('Gagal menambahkan rekomendasi', 'error');
    }
  };

  const startEditAdvisory = (adv: AdvisoryRead) => {
    setEditingAdvisoryId(adv.id);
    setAdvisoryFormData({
      title: adv.title,
      content: adv.content,
      category: (adv.category || 'general') as 'soil' | 'fertilizer' | 'general',
      is_active: adv.is_active
    });
  };

  const handleUpdateAdvisory = async (e: React.FormEvent, id: number) => {
    e.preventDefault();
    if (!advisoryFormData.title.trim() || !advisoryFormData.content.trim()) {
      showToast('Judul dan Isi rekomendasi harus diisi', 'error');
      return;
    }

    try {
      const updated = await haraService.updateAdvisory(id, {
        title: advisoryFormData.title.trim(),
        content: advisoryFormData.content.trim(),
        category: advisoryFormData.category,
        is_active: advisoryFormData.is_active
      });

      setAdvisories((prev) => prev.map((a) => (a.id === id ? updated : a)));
      setEditingAdvisoryId(null);
      showToast('Rekomendasi berhasil diperbarui', 'success');
    } catch (error) {
      console.error('Failed to update advisory:', error);
      showToast('Gagal memperbarui rekomendasi', 'error');
    }
  };

  const handleToggleAdvisoryActive = async (adv: AdvisoryRead) => {
    try {
      const updated = await haraService.updateAdvisory(adv.id, {
        is_active: !adv.is_active
      });
      setAdvisories((prev) => prev.map((a) => (a.id === adv.id ? updated : a)));
      showToast(
        `Rekomendasi berhasil ${updated.is_active ? 'diaktifkan' : 'dinonaktifkan'}`,
        'success'
      );
    } catch (error) {
      console.error('Failed to toggle advisory status:', error);
      showToast('Gagal mengubah status rekomendasi', 'error');
    }
  };

  return {
    advisories,
    setAdvisories,
    isAddingAdvisory,
    setIsAddingAdvisory,
    editingAdvisoryId,
    setEditingAdvisoryId,
    newAdvisoryFormData,
    setNewAdvisoryFormData,
    advisoryFormData,
    setAdvisoryFormData,
    handleCreateAdvisory,
    startEditAdvisory,
    handleUpdateAdvisory,
    handleToggleAdvisoryActive
  };
}
