import React from 'react';
import { getPhBadge, getNBadge, getPBadge, getKBadge } from '../../utils/agronomyHelper';
import type { HaraProperties } from '../../types/api.types';

interface SoilMetricsListProps {
  properties: HaraProperties;
}

export const SoilMetricsList: React.FC<SoilMetricsListProps> = ({ properties }) => {
  return (
    <div>
      <h3 className="font-semibold text-on-surface mb-3 flex items-center gap-2">
        <span className="w-1.5 h-6 bg-tertiary rounded-full"></span>
        Indikator Kesuburan
      </h3>
      <div className="flex flex-col gap-3">
        <div className="flex justify-between items-center bg-surface-bright p-3 rounded-xl border border-outline-variant">
          <span className="font-display text-sm font-bold text-on-surface w-1/3">pH Tanah</span>
          <span className="font-sans font-medium text-on-surface-variant w-1/3 text-center">
            {properties.ph_rata2 !== undefined && properties.ph_rata2 !== null && properties.ph_rata2 !== -9999
              ? properties.ph_rata2.toFixed(2)
              : '-'}
          </span>
          <div className="w-1/3 flex justify-end">{getPhBadge(properties.ph_rata2)}</div>
        </div>
        <div className="flex justify-between items-center bg-surface-bright p-3 rounded-xl border border-outline-variant">
          <span className="font-display text-sm font-bold text-on-surface w-1/3">Nitrogen (N)</span>
          <span className="font-sans font-medium text-on-surface-variant w-1/3 text-center">
            {properties.n_rata2 !== undefined && properties.n_rata2 !== null && properties.n_rata2 !== -9999
              ? properties.n_rata2.toFixed(2)
              : '-'}
          </span>
          <div className="w-1/3 flex justify-end">{getNBadge(properties.n_rata2)}</div>
        </div>
        <div className="flex justify-between items-center bg-surface-bright p-3 rounded-xl border border-outline-variant">
          <span className="font-display text-sm font-bold text-on-surface w-1/3">Fosfor (P)</span>
          <span className="font-sans font-medium text-on-surface-variant w-1/3 text-center">
            {properties.p_rata2 !== undefined && properties.p_rata2 !== null && properties.p_rata2 !== -9999
              ? properties.p_rata2.toFixed(2)
              : '-'}
          </span>
          <div className="w-1/3 flex justify-end">{getPBadge(properties.p_rata2)}</div>
        </div>
        <div className="flex justify-between items-center bg-surface-bright p-3 rounded-xl border border-outline-variant">
          <span className="font-display text-sm font-bold text-on-surface w-1/3">Kalium (K)</span>
          <span className="font-sans font-medium text-on-surface-variant w-1/3 text-center">
            {properties.k_rata2 !== undefined && properties.k_rata2 !== null && properties.k_rata2 !== -9999
              ? (properties.k_rata2 / 10).toFixed(2)
              : '-'}
          </span>
          <div className="w-1/3 flex justify-end">{getKBadge(properties.k_rata2)}</div>
        </div>
      </div>
    </div>
  );
};
