import React, { useState } from 'react';
import type { MapFilterType } from '../../layouts/DashboardLayout';
import { MAP_LEGENDS } from '../../constants/map';
import { InformationCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface MapLegendProps {
  activeFilter: MapFilterType;
}

export const MapLegend: React.FC<MapLegendProps> = ({ activeFilter }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  if (activeFilter === 'none') return null;

  const activeLegend = MAP_LEGENDS[activeFilter as keyof typeof MAP_LEGENDS];
  if (!activeLegend) return null;

  const { title, items } = activeLegend;

  return (
    <div className="absolute bottom-24 md:bottom-6 right-4 md:right-6 z-[900] pointer-events-auto">
      {!isExpanded ? (
        <button 
          onClick={() => setIsExpanded(true)}
          className="w-12 h-12 bg-white text-on-surface rounded-full shadow-lg flex items-center justify-center hover:bg-surface-dim transition-all border border-outline-variant"
          title="Tampilkan Keterangan"
        >
          <InformationCircleIcon className="w-6 h-6 text-primary" />
        </button>
      ) : (
        <div className="bg-surface-lowest rounded-xl shadow-md p-4 border border-outline-variant bg-white min-w-[200px]">
          <div className="flex justify-between items-start mb-3">
            <h3 className="font-display font-semibold text-sm text-on-surface pr-4">
              {title}
            </h3>
            <button 
              onClick={() => setIsExpanded(false)}
              className="p-1 -mt-1 -mr-1 text-on-surface-variant hover:text-error hover:bg-error-container/20 rounded-full transition-all"
              title="Tutup Keterangan"
            >
              <XMarkIcon className="w-4 h-4" />
            </button>
          </div>
          <ul className="space-y-2">
            {items.map((item, idx) => (
              <li key={idx} className="flex items-center gap-2">
                <span className="block w-4 h-4 rounded-sm shadow-sm" style={{ backgroundColor: item.color }}></span>
                <span className="text-xs text-on-surface-variant">{item.label}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
