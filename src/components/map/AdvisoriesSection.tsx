import React from 'react';
import { PlusIcon, PencilIcon } from '@heroicons/react/24/outline';
import type { AdvisoryRead } from '../../types/api.types';

interface AdvisoriesSectionProps {
  isExpert: boolean;
  advisories: AdvisoryRead[];
  isAddingAdvisory: boolean;
  setIsAddingAdvisory: (val: boolean) => void;
  newAdvisoryFormData: {
    title: string;
    content: string;
    category: 'soil' | 'fertilizer' | 'general';
    is_active: boolean;
  };
  setNewAdvisoryFormData: React.Dispatch<
    React.SetStateAction<{
      title: string;
      content: string;
      category: 'soil' | 'fertilizer' | 'general';
      is_active: boolean;
    }>
  >;
  editingAdvisoryId: number | null;
  setEditingAdvisoryId: (val: number | null) => void;
  advisoryFormData: {
    title: string;
    content: string;
    category: 'soil' | 'fertilizer' | 'general';
    is_active: boolean;
  };
  setAdvisoryFormData: React.Dispatch<
    React.SetStateAction<{
      title: string;
      content: string;
      category: 'soil' | 'fertilizer' | 'general';
      is_active: boolean;
    }>
  >;
  handleCreateAdvisory: (e: React.FormEvent) => Promise<void>;
  startEditAdvisory: (adv: AdvisoryRead) => void;
  handleUpdateAdvisory: (e: React.FormEvent, id: number) => Promise<void>;
  handleToggleAdvisoryActive: (adv: AdvisoryRead) => Promise<void>;
}

export const AdvisoriesSection: React.FC<AdvisoriesSectionProps> = ({
  isExpert,
  advisories,
  isAddingAdvisory,
  setIsAddingAdvisory,
  newAdvisoryFormData,
  setNewAdvisoryFormData,
  editingAdvisoryId,
  setEditingAdvisoryId,
  advisoryFormData,
  setAdvisoryFormData,
  handleCreateAdvisory,
  startEditAdvisory,
  handleUpdateAdvisory,
  handleToggleAdvisoryActive,
}) => {
  return (
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
        <form
          onSubmit={handleCreateAdvisory}
          className="bg-surface-bright border border-primary/20 p-4 rounded-2xl shadow-md space-y-3.5 mb-4 animate-fade-in-up"
        >
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
                onChange={(e) =>
                  setNewAdvisoryFormData((prev) => ({ ...prev, title: e.target.value }))
                }
                className="w-full bg-surface border border-outline px-3 py-2 rounded-xl text-sm text-on-surface focus:outline-none focus:border-primary transition-all font-sans font-semibold"
              />
            </div>
            <div>
              <textarea
                required
                rows={3}
                placeholder="Isi Rekomendasi..."
                value={newAdvisoryFormData.content}
                onChange={(e) =>
                  setNewAdvisoryFormData((prev) => ({ ...prev, content: e.target.value }))
                }
                className="w-full bg-surface border border-outline px-3 py-2 rounded-xl text-sm text-on-surface focus:outline-none focus:border-primary transition-all font-sans leading-relaxed"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <select
                  value={newAdvisoryFormData.category}
                  onChange={(e) =>
                    setNewAdvisoryFormData((prev) => ({
                      ...prev,
                      category: e.target.value as 'soil' | 'fertilizer' | 'general',
                    }))
                  }
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
                  onChange={(e) =>
                    setNewAdvisoryFormData((prev) => ({ ...prev, is_active: e.target.checked }))
                  }
                  className="w-4 h-4 rounded text-primary focus:ring-primary border-outline cursor-pointer"
                />
                <label
                  htmlFor="new-adv-active"
                  className="text-xs font-bold text-on-surface-variant cursor-pointer select-none"
                >
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
                      onChange={(e) =>
                        setAdvisoryFormData((prev) => ({ ...prev, title: e.target.value }))
                      }
                      className="w-full bg-surface border border-outline px-3 py-2 rounded-xl text-sm font-semibold text-on-surface focus:outline-none focus:border-primary transition-all font-sans"
                    />
                  </div>
                  <div>
                    <textarea
                      required
                      rows={3}
                      value={advisoryFormData.content}
                      onChange={(e) =>
                        setAdvisoryFormData((prev) => ({ ...prev, content: e.target.value }))
                      }
                      className="w-full bg-surface border border-outline px-3 py-2 rounded-xl text-sm text-on-surface focus:outline-none focus:border-primary transition-all font-sans leading-relaxed"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <select
                        value={advisoryFormData.category}
                        onChange={(e) =>
                          setAdvisoryFormData((prev) => ({
                            ...prev,
                            category: e.target.value as 'soil' | 'fertilizer' | 'general',
                          }))
                        }
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
                        onChange={(e) =>
                          setAdvisoryFormData((prev) => ({ ...prev, is_active: e.target.checked }))
                        }
                        className="w-4 h-4 rounded text-primary focus:ring-primary border-outline cursor-pointer"
                      />
                      <label
                        htmlFor={`edit-adv-active-${adv.id}`}
                        className="text-xs font-bold text-on-surface-variant cursor-pointer select-none"
                      >
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
                <p className="text-sm text-on-surface-variant font-sans leading-relaxed">
                  {adv.content}
                </p>
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
  );
};
