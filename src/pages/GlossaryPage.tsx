import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import GlossaryCard from '../components/GlossaryCard';
import glossaryImg from '../assets/images/glosarium.webp';
import { 
  MagnifyingGlassIcon, 
  XMarkIcon,
  PlusIcon,
  PencilSquareIcon,
  TrashIcon,
  CheckIcon
} from '@heroicons/react/24/outline';
import { glossaryService } from '../services/glossary.service';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../contexts/ToastContext';
import type { GlossaryTerm } from '../types/api.types';

export default function GlossaryPage() {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [terms, setTerms] = useState<GlossaryTerm[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // CMS modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedTermId, setSelectedTermId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    term: '',
    definition: ''
  });

  // Delete confirm state
  const [termToDelete, setTermToDelete] = useState<number | null>(null);

  const isExpert = user?.role === 'expert' || user?.role === 'admin';

  const fetchTerms = async () => {
    try {
      setIsLoading(true);
      const data = await glossaryService.getAll();
      setTerms(data);
    } catch (err) {
      console.error('Failed to fetch glossary terms:', err);
      showToast('Gagal memuat istilah glosarium.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void fetchTerms();
  }, []);

  const handleOpenCreateModal = () => {
    setModalMode('create');
    setFormData({ term: '', definition: '' });
    setSelectedTermId(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (termObj: GlossaryTerm) => {
    setModalMode('edit');
    setFormData({ term: termObj.term, definition: termObj.definition });
    setSelectedTermId(termObj.id);
    setIsModalOpen(true);
  };

  const handleSaveTerm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.term.trim() || !formData.definition.trim()) {
      showToast('Istilah dan definisi tidak boleh kosong.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      if (modalMode === 'create') {
        const created = await glossaryService.create({
          term: formData.term.trim(),
          definition: formData.definition.trim()
        });
        setTerms((prev) => [...prev, created].sort((a, b) => a.term.localeCompare(b.term)));
        showToast('Istilah baru berhasil ditambahkan.', 'success');
      } else if (modalMode === 'edit' && selectedTermId !== null) {
        const updated = await glossaryService.update(selectedTermId, {
          term: formData.term.trim(),
          definition: formData.definition.trim()
        });
        setTerms((prev) => prev.map((t) => (t.id === selectedTermId ? updated : t)).sort((a, b) => a.term.localeCompare(b.term)));
        showToast('Istilah berhasil diperbarui.', 'success');
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error('Failed to save glossary term:', err);
      showToast('Gagal menyimpan istilah. Periksa apakah istilah sudah ada.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteTerm = async () => {
    if (termToDelete === null) return;
    const id = termToDelete;
    setTermToDelete(null);

    const originalTerms = [...terms];
    setTerms((prev) => prev.filter((t) => t.id !== id));

    try {
      await glossaryService.delete(id);
      showToast('Istilah berhasil dihapus.', 'success');
    } catch (err) {
      console.error('Failed to delete glossary term:', err);
      setTerms(originalTerms);
      showToast('Gagal menghapus istilah. Silakan coba lagi.', 'error');
    }
  };

  const filteredData = terms.filter((item) => 
    item.term.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.definition.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full">
      {/* Header with Background Image */}
      <div className="relative w-full py-20 sm:py-28 overflow-hidden">
        <img 
          src={glossaryImg} 
          alt="Glosarium Latar Belakang" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-[#1A2F16]/60"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex flex-col items-center justify-center gap-4 mb-6">
            <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-tertiary tracking-tight">
              Glosarium Pertanian
            </h1>
            {isExpert && (
              <button
                onClick={handleOpenCreateModal}
                className="flex items-center gap-1.5 px-4 py-2 bg-primary text-white font-display text-sm font-bold rounded-full hover:bg-primary/95 transition-all shadow-md hover:scale-105 active:scale-95 cursor-pointer mt-2"
              >
                <PlusIcon className="w-4 h-4" />
                Tambah Istilah
              </button>
            )}
          </div>
          <p className="font-sans text-lg text-white/90 max-w-2xl mx-auto mb-8">
            Kamus istilah pertanian untuk membantu Anda memahami unsur hara dan konsep penting dalam budidaya tanaman.
          </p>
          
          {/* Functional Search Bar */}
          <div className="max-w-xl mx-auto relative group">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-6 w-6 text-on-surface-variant/70 group-focus-within:text-primary transition-colors duration-300" />
            </div>
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari istilah (contoh: Fosfor, Hara)..." 
              className="w-full pl-14 pr-14 py-4 rounded-full bg-surface-container-lowest/95 backdrop-blur-sm border border-outline/30 focus:outline-none focus:ring-2 focus:ring-primary shadow-lg font-sans text-on-surface transition-all placeholder:text-on-surface-variant/60"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-5 flex items-center text-on-surface-variant hover:text-error transition-colors"
                title="Hapus pencarian"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Glossary Content */}
      <div className="py-12 sm:py-20 bg-background pb-24 md:pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            /* Pulsing skeleton loaders */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-surface-container-lowest border border-outline/40 rounded-3xl p-8 shadow-lg animate-pulse space-y-6">
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-surface-dim rounded-2xl"></div>
                    <div className="h-6 bg-surface-dim rounded w-2/3"></div>
                  </div>
                  <div className="space-y-2.5">
                    <div className="h-4 bg-surface-dim rounded w-full"></div>
                    <div className="h-4 bg-surface-dim rounded w-5/6"></div>
                    <div className="h-4 bg-surface-dim rounded w-4/5"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredData.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredData.map((item) => {
                const firstLetter = item.term.charAt(0).toUpperCase() || 'A';
                return (
                  <div key={item.id} className="relative group">
                    <GlossaryCard
                      letter={firstLetter}
                      title={item.term}
                      description={item.definition}
                    />
                    
                    {/* In-place edit/delete buttons for expert */}
                    {isExpert && (
                      <div className="absolute top-4 right-4 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity bg-surface-container-lowest/80 backdrop-blur-md px-2 py-1 rounded-full border border-outline-variant shadow-sm z-10">
                        <button
                          onClick={() => handleOpenEditModal(item)}
                          className="p-1.5 hover:bg-surface rounded-full text-on-surface-variant hover:text-primary transition-all cursor-pointer"
                          title="Edit istilah"
                        >
                          <PencilSquareIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setTermToDelete(item.id)}
                          className="p-1.5 hover:bg-surface rounded-full text-on-surface-variant hover:text-error transition-all cursor-pointer"
                          title="Hapus istilah"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-24 px-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-surface-dim mb-4">
                <MagnifyingGlassIcon className="w-8 h-8 text-on-surface-variant/50" />
              </div>
              <h3 className="text-xl font-display font-bold text-on-surface mb-2">
                Istilah "{searchQuery}" tidak ditemukan
              </h3>
              <p className="text-on-surface-variant font-sans max-w-md mx-auto">
                Silakan coba gunakan kata kunci yang berbeda atau periksa ejaan kata yang Anda masukkan.
              </p>
              <button 
                onClick={() => setSearchQuery('')}
                className="mt-6 px-6 py-2 bg-primary/10 text-primary font-sans font-bold rounded-full hover:bg-primary/20 transition-colors cursor-pointer"
              >
                Tampilkan Semua Istilah
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Glossary CMS Create/Edit Modal */}
      {isModalOpen && createPortal(
        <div className="fixed inset-0 bg-on-surface/50 backdrop-blur-sm z-[3000] flex items-center justify-center p-4 pointer-events-auto">
          <form 
            onSubmit={handleSaveTerm}
            className="bg-surface-container-lowest rounded-3xl p-6 shadow-xl w-[480px] max-w-full animate-fade-in-up border border-outline-variant flex flex-col gap-5"
          >
            <div>
              <h3 className="font-display font-bold text-lg text-on-surface">
                {modalMode === 'create' ? 'Tambah Istilah Baru' : 'Edit Istilah'}
              </h3>
              <p className="font-sans text-xs text-on-surface-variant/85 mt-1">
                Lengkapi nama istilah dan definisinya di bawah ini.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-on-surface-variant mb-1 font-display">
                  Istilah / Term
                </label>
                <input
                  type="text"
                  required
                  disabled={modalMode === 'edit'}
                  value={formData.term}
                  onChange={(e) => setFormData(prev => ({ ...prev, term: e.target.value }))}
                  className="w-full bg-surface border border-outline-variant/80 px-3 py-2.5 rounded-xl text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-sans disabled:opacity-60 disabled:cursor-not-allowed"
                  placeholder="Masukkan nama istilah..."
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface-variant mb-1 font-display">
                  Definisi
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.definition}
                  onChange={(e) => setFormData(prev => ({ ...prev, definition: e.target.value }))}
                  className="w-full bg-surface border border-outline-variant/80 px-3 py-2.5 rounded-xl text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-sans leading-relaxed"
                  placeholder="Tulis definisi atau penjelasan detail di sini..."
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                disabled={isSubmitting}
                className="font-sans px-4 py-2.5 rounded-full border border-outline text-on-surface-variant hover:bg-surface-dim transition-all text-sm font-semibold cursor-pointer disabled:opacity-50"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="font-sans bg-primary text-white hover:bg-primary/95 rounded-full px-5 py-2.5 transition-all text-sm font-bold shadow-md cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
              >
                <CheckIcon className="w-4 h-4" />
                {isSubmitting ? 'Menyimpan...' : 'Simpan'}
              </button>
            </div>
          </form>
        </div>,
        document.body
      )}

      {/* Delete Confirmation Modal */}
      {termToDelete !== null && createPortal(
        <div className="fixed inset-0 bg-on-surface/50 backdrop-blur-sm z-[3000] flex items-center justify-center p-4 pointer-events-auto">
          <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-xl w-96 max-w-full animate-fade-in-up border border-outline-variant">
            <h3 className="font-display font-bold text-lg text-on-surface mb-2">Hapus Istilah?</h3>
            <p className="font-sans text-on-surface-variant mb-6">Apakah Anda yakin ingin menghapus istilah ini dari glosarium?</p>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setTermToDelete(null)}
                className="font-sans px-4 py-2 rounded-full border border-outline text-on-surface-variant hover:bg-surface-dim transition-colors font-medium cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleDeleteTerm}
                className="font-sans bg-error text-white hover:bg-error/90 rounded-full px-5 py-2 transition-colors font-bold shadow-md cursor-pointer"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
