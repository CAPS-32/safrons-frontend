import React from 'react';
import type { CropSuitability } from '../../types/api.types';

interface CropSuitabilityListProps {
  cropSuitabilities: CropSuitability[] | undefined;
  isLoading: boolean;
}

export const CropSuitabilityList: React.FC<CropSuitabilityListProps> = ({
  cropSuitabilities,
  isLoading
}) => {
  if (isLoading) {
    return (
      <div className="space-y-3">
        <h3 className="font-semibold text-on-surface flex items-center gap-2">
          <span className="w-1.5 h-6 bg-primary rounded-full animate-pulse"></span>
          Kecocokan Komoditas
        </h3>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-16 bg-surface-container-lowest border border-outline-variant/50 rounded-xl animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  if (!cropSuitabilities || cropSuitabilities.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-on-surface flex items-center gap-2">
        <span className="w-1.5 h-6 bg-primary rounded-full"></span>
        Kecocokan Komoditas
      </h3>
      <div className="grid grid-cols-1 gap-3">
        {cropSuitabilities.map((suitability) => (
          <CropSuitabilityCard key={suitability.crop} suitability={suitability} />
        ))}
      </div>
    </div>
  );
};

interface CropSuitabilityCardProps {
  suitability: CropSuitability;
}

function CropSuitabilityCard({ suitability }: CropSuitabilityCardProps) {
  const formatCropName = (name: string): string => {
    return name
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const getSuitabilityLabel = (suitabilityClass: 'S1' | 'S2' | 'S3' | 'N'): string => {
    switch (suitabilityClass) {
      case 'S1':
        return 'Sangat Sesuai';
      case 'S2':
        return 'Cukup Sesuai';
      case 'S3':
        return 'Sesuai Marginal';
      case 'N':
        return 'Tidak Sesuai';
      default:
        return '';
    }
  };

  const getSuitabilityStyles = (suitabilityClass: 'S1' | 'S2' | 'S3' | 'N') => {
    switch (suitabilityClass) {
      case 'S1':
        return {
          card: 'bg-green-50 border-green-200 text-green-800',
          badge: 'bg-green-100 text-green-800 border-green-300'
        };
      case 'S2':
        return {
          card: 'bg-yellow-50 border-yellow-200 text-yellow-800',
          badge: 'bg-yellow-100 text-yellow-800 border-yellow-300'
        };
      case 'S3':
        return {
          card: 'bg-orange-50 border-orange-200 text-orange-800',
          badge: 'bg-orange-100 text-orange-800 border-orange-300'
        };
      case 'N':
        return {
          card: 'bg-red-50 border-red-200 text-red-800',
          badge: 'bg-red-100 text-red-800 border-red-300'
        };
      default:
        return {
          card: 'bg-slate-50 border-slate-200 text-slate-800',
          badge: 'bg-slate-100 text-slate-800 border-slate-300'
        };
    }
  };

  const styles = getSuitabilityStyles(suitability.class);
  const showLimitingFactors =
    (suitability.class === 'S3' || suitability.class === 'N') &&
    suitability.limiting_factors &&
    suitability.limiting_factors.length > 0;

  return (
    <div className={`p-4 rounded-xl border flex flex-col gap-2.5 transition-all ${styles.card}`}>
      <div className="flex justify-between items-center">
        <span className="font-display font-bold text-sm tracking-tight">
          {formatCropName(suitability.crop)}
        </span>
        <div className={`px-2.5 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 ${styles.badge}`}>
          <span className="font-mono text-xs">{suitability.class}</span>
          <span className="text-[10px] uppercase font-sans tracking-wide">
            {getSuitabilityLabel(suitability.class)}
          </span>
        </div>
      </div>

      {showLimitingFactors && (
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-current/10">
          <span className="text-[10px] font-bold uppercase tracking-wider opacity-90 mr-0.5">
            Faktor Pembatas:
          </span>
          {suitability.limiting_factors.map((factor) => (
            <span
              key={factor}
              className="bg-red-600 text-white font-bold px-2 py-0.5 rounded text-[10px] tracking-wider uppercase"
            >
              {factor.toUpperCase()}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
