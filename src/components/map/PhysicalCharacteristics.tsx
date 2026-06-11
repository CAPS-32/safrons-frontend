import React from 'react';
import { InformationCircleIcon } from '@heroicons/react/24/outline';
import { formatSlope, formatTexture } from '../../utils/agronomyHelper';
import type { HaraProperties } from '../../types/api.types';

interface PhysicalCharacteristicsProps {
  properties: HaraProperties;
}

export const PhysicalCharacteristics: React.FC<PhysicalCharacteristicsProps> = ({ properties }) => {
  return (
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
          <div className="text-sm font-sans font-medium text-on-surface-variant text-right">
            {properties.name || 'Tidak tersedia'}
          </div>
        </div>
        <div className="flex justify-between items-center border-b border-outline-variant/30 pb-3">
          <div className="text-sm font-display font-bold text-on-surface">Kemiringan Lereng</div>
          <div className="text-sm font-sans font-medium text-on-surface-variant">
            {formatSlope(properties.slope__)}
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div className="text-sm font-display font-bold text-on-surface">Tekstur Tanah</div>
          <div className="text-sm font-sans font-medium text-on-surface-variant text-right max-w-[60%] leading-tight">
            {formatTexture(properties.texture_of)}
          </div>
        </div>
      </div>
    </div>
  );
};
