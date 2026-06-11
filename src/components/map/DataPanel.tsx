import React, { useState, useEffect } from 'react';
import { 
  XMarkIcon, 
  InformationCircleIcon,
  BookmarkIcon,
  PencilIcon,
  PlusIcon,
  CheckIcon,
  ArrowUturnLeftIcon
} from '@heroicons/react/24/outline';
import { haraService } from '../../services/hara.service';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../contexts/ToastContext';
import { formatSlope, formatTexture, getPhBadge, getNBadge, getPBadge, getKBadge } from '../../utils/agronomyHelper';
import type { GeoJSONFeature, AdvisoryRead } from '../../types/api.types';

interface DataPanelProps {
  selectedFeature: GeoJSONFeature | null;
  onAreaUpdate: (updatedFeature: GeoJSONFeature) => void;
  onClose: () => void;
  onSaveClick: () => void;
}

export default function DataPanel({ selectedFeature, onAreaUpdate, onClose, onSaveClick }: DataPanelProps) {
  const { role } = useAuth();
  const { showToast } = useToast();
  
  const [advisories, setAdvisories] = useState<AdvisoryRead[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Area Form State
  const [formData, setFormData] = useState({
    name: '',
    ph_rata2: '',
    n_rata2: '',
    p_rata2: '',
    k_rata2: '',
    slope__: '',
    texture_of: ''
  });

  // Advisory Creation State
  const [isAddingAdvisory, setIsAddingAdvisory] = useState(false);
  const [newAdvisoryFormData, setNewAdvisoryFormData] = useState({
    title: '',
    content: '',
    category: 'general' as 'soil' | 'fertilizer' | 'general',
    is_active: true
  });

  // Advisory Editing State
  const [editingAdvisoryId, setEditingAdvisoryId] = useState<number | null>(null);
  const [advisoryFormData, setAdvisoryFormData] = useState({
    title: '',
    content: '',
    category: 'general' as 'soil' | 'fertilizer' | 'general',
    is_active: true
  });

  const isExpert = role === 'expert' || role === 'admin';

  useEffect(() => {
    let isMounted = true;
    if (!selectedFeature) {
      setAdvisories([]);
      setIsEditing(false);
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
    return () => { isMounted = false; };
  }, [selectedFeature]);

  // Pre-fill form when entering edit mode or when selectedFeature changes
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
  }, [selectedFeature]);

  if (!selectedFeature) return null;

  const { properties } = selectedFeature;

  const handleSaveArea = async (e: React.FormEvent) => {
    e.preventDefault();
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
        k_rata2: k !== null ? k * 10 : null, // multiply by 10 to restore scale
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

  const handleCreateAdvisory = async (e: React.FormEvent) => {
    e.preventDefault();
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

  return (
    <>
      {/* Overlay for mobile */}
      <div
        className="fixed inset-0 bg-on-surface/20 z-40 md:hidden transition-opacity"
        onClick={onClose}
      />

      <div
        className="absolute top-4 left-4 bottom-4 w-96 max-w-[calc(100vw-2rem)] z-[1000] bg-surface/95 backdrop-blur-md rounded-2xl shadow-2xl border border-outline-variant flex flex-col overflow-hidden transition-all duration-500 ease-out animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
        onPointerDown={(e) => e.stopPropagation()}
        onDoubleClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
        onWheel={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col h-full">
          {/* Drag handle for mobile */}
          <div className="w-full flex justify-center pt-4 pb-2 md:hidden">
            <div className="w-16 h-1.5 bg-outline-variant rounded-full" />
          </div>

          <div className="px-6 py-4 border-b border-outline-variant/50 flex justify-between items-center md:pt-6">
            <div className="flex flex-col gap-0.5">
              <h2 className="text-xl font-bold text-on-surface font-display tracking-tight">
                Informasi Lahan
              </h2>
              {isExpert && (
                <span className="text-[10px] text-primary font-bold uppercase tracking-wider">
                  Mode Pakar
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {isExpert && !isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 rounded-full text-xs font-bold transition-all cursor-pointer"
                >
                  <PencilIcon className="w-3.5 h-3.5" />
                  Edit Lahan
                </button>
              )}
              <button
                onClick={onClose}
                className="p-2 text-on-surface-variant hover:text-primary hover:bg-surface-dim rounded-full transition-all"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div className="p-6 flex-1 overflow-y-auto space-y-6 scrollbar-hide">
            {isEditing ? (
              /* Edit Hara Properties Form */
              <form onSubmit={handleSaveArea} className="space-y-5">
                <h3 className="font-semibold text-on-surface mb-3 flex items-center gap-2">
                  <span className="w-1.5 h-6 bg-primary rounded-full"></span>
                  Form Edit Data Hara
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-on-surface-variant mb-1 font-display">
                      Seri Klasifikasi Lahan
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full bg-surface border border-outline-variant/80 px-3 py-2.5 rounded-xl text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-sans"
                      placeholder="Masukkan nama seri klasifikasi..."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-on-surface-variant mb-1 font-display">
                        pH Tanah
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        max="14"
                        value={formData.ph_rata2}
                        onChange={(e) => setFormData(prev => ({ ...prev, ph_rata2: e.target.value }))}
                        className="w-full bg-surface border border-outline-variant/80 px-3 py-2.5 rounded-xl text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-sans"
                        placeholder="Contoh: 6.5"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-on-surface-variant mb-1 font-display">
                        Nitrogen (N)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.n_rata2}
                        onChange={(e) => setFormData(prev => ({ ...prev, n_rata2: e.target.value }))}
                        className="w-full bg-surface border border-outline-variant/80 px-3 py-2.5 rounded-xl text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-sans"
                        placeholder="Contoh: 24.5"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-on-surface-variant mb-1 font-display">
                        Fosfor (P)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.p_rata2}
                        onChange={(e) => setFormData(prev => ({ ...prev, p_rata2: e.target.value }))}
                        className="w-full bg-surface border border-outline-variant/80 px-3 py-2.5 rounded-xl text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-sans"
                        placeholder="Contoh: 18.0"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-on-surface-variant mb-1 font-display">
                        Kalium (K)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.k_rata2}
                        onChange={(e) => setFormData(prev => ({ ...prev, k_rata2: e.target.value }))}
                        className="w-full bg-surface border border-outline-variant/80 px-3 py-2.5 rounded-xl text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-sans"
                        placeholder="Contoh: 15.4"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-on-surface-variant mb-1 font-display">
                      Kemiringan Lereng (%)
                    </label>
                    <input
                      type="text"
                      value={formData.slope__}
                      onChange={(e) => setFormData(prev => ({ ...prev, slope__: e.target.value }))}
                      className="w-full bg-surface border border-outline-variant/80 px-3 py-2.5 rounded-xl text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-sans"
                      placeholder="Masukkan persentase lereng..."
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-on-surface-variant mb-1 font-display">
                      Tekstur Tanah
                    </label>
                    <input
                      type="text"
                      value={formData.texture_of}
                      onChange={(e) => setFormData(prev => ({ ...prev, texture_of: e.target.value }))}
                      className="w-full bg-surface border border-outline-variant/80 px-3 py-2.5 rounded-xl text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-sans"
                      placeholder="Masukkan tekstur tanah..."
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-3">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-primary text-white py-3 rounded-xl font-bold font-display hover:bg-primary/95 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <CheckIcon className="w-4 h-4" />
                    {isSubmitting ? 'Menyimpan...' : 'Simpan'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    disabled={isSubmitting}
                    className="flex-1 bg-surface hover:bg-surface-container border border-outline text-on-surface py-3 rounded-xl font-bold font-display active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <ArrowUturnLeftIcon className="w-4 h-4" />
                    Batal
                  </button>
                </div>
              </form>
            ) : (
              /* Read-only view */
              <>
                {/* Soil Metrics List */}
                <div>
                  <h3 className="font-semibold text-on-surface mb-3 flex items-center gap-2">
                    <span className="w-1.5 h-6 bg-tertiary rounded-full"></span>
                    Indikator Kesuburan
                  </h3>
                  <div className="flex flex-col gap-3">
                    <div className="flex justify-between items-center bg-surface-bright p-3 rounded-xl border border-outline-variant">
                      <span className="font-display text-sm font-bold text-on-surface w-1/3">pH Tanah</span>
                      <span className="font-sans font-medium text-on-surface-variant w-1/3 text-center">
                        {(properties.ph_rata2 !== undefined && properties.ph_rata2 !== null && properties.ph_rata2 !== -9999) 
                          ? properties.ph_rata2.toFixed(2) 
                          : '-'}
                      </span>
                      <div className="w-1/3 flex justify-end">{getPhBadge(properties.ph_rata2)}</div>
                    </div>
                    <div className="flex justify-between items-center bg-surface-bright p-3 rounded-xl border border-outline-variant">
                      <span className="font-display text-sm font-bold text-on-surface w-1/3">Nitrogen (N)</span>
                      <span className="font-sans font-medium text-on-surface-variant w-1/3 text-center">
                        {(properties.n_rata2 !== undefined && properties.n_rata2 !== null && properties.n_rata2 !== -9999) 
                          ? properties.n_rata2.toFixed(2) 
                          : '-'}
                      </span>
                      <div className="w-1/3 flex justify-end">{getNBadge(properties.n_rata2)}</div>
                    </div>
                    <div className="flex justify-between items-center bg-surface-bright p-3 rounded-xl border border-outline-variant">
                      <span className="font-display text-sm font-bold text-on-surface w-1/3">Fosfor (P)</span>
                      <span className="font-sans font-medium text-on-surface-variant w-1/3 text-center">
                        {(properties.p_rata2 !== undefined && properties.p_rata2 !== null && properties.p_rata2 !== -9999) 
                          ? properties.p_rata2.toFixed(2) 
                          : '-'}
                      </span>
                      <div className="w-1/3 flex justify-end">{getPBadge(properties.p_rata2)}</div>
                    </div>
                    <div className="flex justify-between items-center bg-surface-bright p-3 rounded-xl border border-outline-variant">
                      <span className="font-display text-sm font-bold text-on-surface w-1/3">Kalium (K)</span>
                      <span className="font-sans font-medium text-on-surface-variant w-1/3 text-center">
                        {(properties.k_rata2 !== undefined && properties.k_rata2 !== null && properties.k_rata2 !== -9999) 
                          ? (properties.k_rata2 / 10).toFixed(2) 
                          : '-'}
                      </span>
                      <div className="w-1/3 flex justify-end">{getKBadge(properties.k_rata2)}</div>
                    </div>
                  </div>
                </div>

                {/* Karakteristik Fisik */}
                <div>
                  <h3 className="font-semibold text-on-surface mb-3 flex items-center gap-2">
                    <span className="w-1.5 h-6 bg-secondary rounded-full"></span>
                    Karakteristik Fisik
                  </h3>
                  <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/50 p-4 space-y-4">
                    <div className="flex justify-between items-center border-b border-outline-variant/30 pb-3">
                      <div className="text-sm font-display font-bold text-on-surface flex items-center gap-1.5 relative group">
                        Seri Klasifikasi
                        <InformationCircleIcon className="w-4 h-4 text-on-surface-variant/70 cursor-help" />
                        <div className="absolute left-0 bottom-full mb-2 w-48 p-2 bg-on-surface text-surface text-xs font-sans rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 pointer-events-none">
                          Nama seri tanah atau Type Locality yang mewakili area ini.
                        </div>
                      </div>
                      <div className="text-sm font-sans font-medium text-on-surface-variant text-right">{properties.name || 'Tidak tersedia'}</div>
                    </div>
                    <div className="flex justify-between items-center border-b border-outline-variant/30 pb-3">
                      <div className="text-sm font-display font-bold text-on-surface">Kemiringan Lereng</div>
                      <div className="text-sm font-sans font-medium text-on-surface-variant">{formatSlope(properties.slope__)}</div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="text-sm font-display font-bold text-on-surface">Tekstur Tanah</div>
                      <div className="text-sm font-sans font-medium text-on-surface-variant text-right max-w-[60%] leading-tight">{formatTexture(properties.texture_of)}</div>
                    </div>
                  </div>
                </div>

                {/* Advisories Section */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-on-surface flex items-center gap-2">
                      <span className="w-1.5 h-6 bg-primary rounded-full"></span>
                      Rekomendasi Pakar
                    </h3>
                    {isExpert && !isAddingAdvisory && (
                      <button
                        onClick={() => setIsAddingAdvisory(true)}
                        className="flex items-center gap-1 text-[11px] font-bold text-primary hover:text-primary/95 transition-all cursor-pointer bg-primary/5 hover:bg-primary/10 border border-primary/15 px-2.5 py-1 rounded-full"
                      >
                        <PlusIcon className="w-3 h-3" />
                        Tambah
                      </button>
                    )}
                  </div>

                  {/* Add New Advisory Form */}
                  {isAddingAdvisory && (
                    <form onSubmit={handleCreateAdvisory} className="bg-surface-bright border border-primary/20 p-4 rounded-2xl shadow-md space-y-3.5 mb-4 animate-fade-in-up">
                      <div className="font-display font-bold text-xs text-primary uppercase tracking-wide">
                        Tambah Rekomendasi Baru
                      </div>
                      <div className="space-y-3">
                        <div>
                          <input
                            type="text"
                            required
                            placeholder="Judul Rekomendasi"
                            value={newAdvisoryFormData.title}
                            onChange={(e) => setNewAdvisoryFormData(prev => ({ ...prev, title: e.target.value }))}
                            className="w-full bg-surface border border-outline px-3 py-2 rounded-xl text-sm text-on-surface focus:outline-none focus:border-primary transition-all font-sans font-semibold"
                          />
                        </div>
                        <div>
                          <textarea
                            required
                            rows={3}
                            placeholder="Isi Rekomendasi..."
                            value={newAdvisoryFormData.content}
                            onChange={(e) => setNewAdvisoryFormData(prev => ({ ...prev, content: e.target.value }))}
                            className="w-full bg-surface border border-outline px-3 py-2 rounded-xl text-sm text-on-surface focus:outline-none focus:border-primary transition-all font-sans leading-relaxed"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <select
                              value={newAdvisoryFormData.category}
                              onChange={(e) => setNewAdvisoryFormData(prev => ({ ...prev, category: e.target.value as any }))}
                              className="w-full bg-surface border border-outline px-3 py-2 rounded-xl text-xs font-semibold text-on-surface focus:outline-none focus:border-primary transition-all cursor-pointer"
                            >
                              <option value="soil">Tanah (Soil)</option>
                              <option value="fertilizer">Pemupukan (Fertilizer)</option>
                              <option value="general">Umum (General)</option>
                            </select>
                          </div>
                          <div className="flex items-center justify-end gap-2 px-1">
                            <input
                              type="checkbox"
                              id="new-adv-active"
                              checked={newAdvisoryFormData.is_active}
                              onChange={(e) => setNewAdvisoryFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                              className="w-4 h-4 rounded text-primary focus:ring-primary border-outline cursor-pointer"
                            />
                            <label htmlFor="new-adv-active" className="text-xs font-bold text-on-surface-variant cursor-pointer select-none">
                              Status Aktif
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 pt-1">
                        <button
                          type="submit"
                          className="flex-1 bg-primary text-white py-2 rounded-xl text-xs font-bold hover:bg-primary/95 transition-all cursor-pointer"
                        >
                          Simpan
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsAddingAdvisory(false)}
                          className="flex-1 bg-surface border border-outline text-on-surface py-2 rounded-xl text-xs font-bold hover:bg-surface-container transition-all cursor-pointer"
                        >
                          Batal
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Advisories list */}
                  {advisories.length > 0 ? (
                    <div className="space-y-4">
                      {advisories.map((adv) => {
                        const isEditingThis = editingAdvisoryId === adv.id;
                        
                        if (isEditingThis) {
                          return (
                            <form 
                              key={adv.id} 
                              onSubmit={(e) => handleUpdateAdvisory(e, adv.id)}
                              className="bg-surface-bright border border-outline-variant p-4 rounded-2xl shadow-sm space-y-3 animate-fade-in-up"
                            >
                              <div>
                                <input
                                  type="text"
                                  required
                                  value={advisoryFormData.title}
                                  onChange={(e) => setAdvisoryFormData(prev => ({ ...prev, title: e.target.value }))}
                                  className="w-full bg-surface border border-outline px-3 py-2 rounded-xl text-sm font-semibold text-on-surface focus:outline-none focus:border-primary transition-all font-sans"
                                />
                              </div>
                              <div>
                                <textarea
                                  required
                                  rows={3}
                                  value={advisoryFormData.content}
                                  onChange={(e) => setAdvisoryFormData(prev => ({ ...prev, content: e.target.value }))}
                                  className="w-full bg-surface border border-outline px-3 py-2 rounded-xl text-sm text-on-surface focus:outline-none focus:border-primary transition-all font-sans leading-relaxed"
                                />
                              </div>
                              <div className="grid grid-cols-2 gap-3">
                                <div>
                                  <select
                                    value={advisoryFormData.category}
                                    onChange={(e) => setAdvisoryFormData(prev => ({ ...prev, category: e.target.value as any }))}
                                    className="w-full bg-surface border border-outline px-3 py-2 rounded-xl text-xs font-semibold text-on-surface focus:outline-none focus:border-primary transition-all cursor-pointer"
                                  >
                                    <option value="soil">Tanah (Soil)</option>
                                    <option value="fertilizer">Pemupukan (Fertilizer)</option>
                                    <option value="general">Umum (General)</option>
                                  </select>
                                </div>
                                <div className="flex items-center justify-end gap-2 px-1">
                                  <input
                                    type="checkbox"
                                    id={`edit-adv-active-${adv.id}`}
                                    checked={advisoryFormData.is_active}
                                    onChange={(e) => setAdvisoryFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                                    className="w-4 h-4 rounded text-primary focus:ring-primary border-outline cursor-pointer"
                                  />
                                  <label htmlFor={`edit-adv-active-${adv.id}`} className="text-xs font-bold text-on-surface-variant cursor-pointer select-none">
                                    Status Aktif
                                  </label>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 pt-1">
                                <button
                                  type="submit"
                                  className="flex-1 bg-primary text-white py-2 rounded-xl text-xs font-bold hover:bg-primary/95 transition-all cursor-pointer"
                                >
                                  Simpan
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setEditingAdvisoryId(null)}
                                  className="flex-1 bg-surface border border-outline text-on-surface py-2 rounded-xl text-xs font-bold hover:bg-surface-container transition-all cursor-pointer"
                                >
                                  Batal
                                </button>
                              </div>
                            </form>
                          );
                        }

                        // Localized category label
                        let catLabel = 'Umum';
                        if (adv.category === 'soil') catLabel = 'Kondisi Tanah';
                        if (adv.category === 'fertilizer') catLabel = 'Rekomendasi Pemupukan';

                        return (
                          <div 
                            key={adv.id} 
                            className={`bg-surface-container-lowest border-l-4 p-5 rounded-r-2xl rounded-l-sm shadow-sm hover:shadow-md transition-shadow relative group ${
                              adv.is_active ? 'border-primary' : 'border-outline-variant/60 opacity-60'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-2 mb-2">
                              <span className="text-[10px] uppercase font-bold text-on-surface-variant bg-surface-dim border border-outline-variant/30 px-2 py-0.5 rounded-full font-display">
                                {catLabel}
                              </span>
                              {isExpert && (
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => handleToggleAdvisoryActive(adv)}
                                    className={`px-2 py-0.5 rounded-md text-[10px] font-bold transition-all border cursor-pointer ${
                                      adv.is_active 
                                        ? 'bg-success/5 text-success border-success/15 hover:bg-success/10' 
                                        : 'bg-outline-variant/10 text-on-surface-variant border-outline-variant/20 hover:bg-outline-variant/20'
                                    }`}
                                  >
                                    {adv.is_active ? 'Aktif' : 'Nonaktif'}
                                  </button>
                                  <button
                                    onClick={() => startEditAdvisory(adv)}
                                    className="p-1 hover:bg-surface border border-transparent hover:border-outline-variant/30 rounded text-on-surface-variant hover:text-primary transition-all cursor-pointer"
                                  >
                                    <PencilIcon className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              )}
                            </div>
                            <h4 className="font-bold text-on-surface font-display mb-1.5">{adv.title}</h4>
                            <p className="text-sm text-on-surface-variant font-sans leading-relaxed">{adv.content}</p>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-6 border-2 border-dashed border-outline-variant/50 rounded-2xl text-on-surface-variant/70 text-xs font-medium">
                      Belum ada rekomendasi pakar untuk area lahan ini.
                    </div>
                  )}
                </div>

                <button
                  onClick={onSaveClick}
                  className="w-full bg-primary text-white py-3.5 rounded-full font-bold font-display hover:bg-primary/90 transition-all shadow-md active:scale-95 mt-6 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <BookmarkIcon className="w-5 h-5" />
                  Simpan Lahan Ini
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
