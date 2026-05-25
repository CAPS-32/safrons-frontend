import { useState } from 'react';
import GlossaryCard from '../components/GlossaryCard';
import glossaryImg from '../assets/images/glosarium.webp';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { GLOSSARY_DATA } from '../constants/glossary';

export default function GlossaryPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredData = GLOSSARY_DATA.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.description.toLowerCase().includes(searchQuery.toLowerCase())
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
          <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-tertiary mb-6 tracking-tight">
            Glosarium Pertanian
          </h1>
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
      <div className="py-12 sm:py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredData.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredData.map((item, index) => (
                <GlossaryCard
                  key={index}
                  letter={item.letter}
                  title={item.title}
                  description={item.description}
                />
              ))}
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
                className="mt-6 px-6 py-2 bg-primary/10 text-primary font-sans font-bold rounded-full hover:bg-primary/20 transition-colors"
              >
                Tampilkan Semua Istilah
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
