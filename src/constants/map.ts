export const BASEMAPS = [
  { id: 'standar', name: 'Standar (CartoDB)' },
  { id: 'satelit', name: 'Satelit (ESRI)' },
  { id: 'jalan', name: 'Jalan (OSM)' },
  { id: 'topografi', name: 'Topografi (ESRI)' }
];

export const MAP_FILTERS = [
  { id: 'pH', label: 'Kadar pH', desc: 'Tingkat Keasaman' },
  { id: 'N', label: 'Nitrogen (N)', desc: 'Kesehatan Daun' },
  { id: 'P', label: 'Fosfor (P)', desc: 'Perkembangan Akar' },
  { id: 'K', label: 'Kalium (K)', desc: 'Kekebalan Tanaman' }
];

export const MAP_LEGENDS = {
  pH: {
    title: 'Kriteria pH Tanah',
    items: [
      { color: '#991B1B', label: '< 4.5 (Sangat Masam)' }, 
      { color: '#ba1a1a', label: '4.5 - 5.5 (Masam)' },
      { color: '#F97316', label: '5.6 - 6.5 (Sedikit Masam)' }, 
      { color: '#2C5E2E', label: '6.6 - 7.5 (Netral)' }, 
      { color: '#3B82F6', label: '7.6 - 8.5 (Sedikit Alkalis)' }, 
      { color: '#1E3A8A', label: '> 8.5 (Alkalis)' }, 
      { color: '#9CA3AF', label: 'Tidak Ada Data' }
    ]
  },
  N: {
    title: 'Kandungan Nitrogen',
    items: [
      { color: '#991B1B', label: '< 1.99 (Sangat Rendah)' },
      { color: '#ba1a1a', label: '1.99 - 2.45 (Rendah)' },
      { color: '#FFD700', label: '2.46 - 4.16 (Sedang)' },
      { color: '#8EC849', label: '4.17 - 5.54 (Tinggi)' },
      { color: '#2C5E2E', label: '> 5.54 (Sangat Tinggi)' },
      { color: '#9CA3AF', label: 'Tidak Ada Data' }
    ]
  },
  P: {
    title: 'Kandungan Fosfor',
    items: [
      { color: '#991B1B', label: '< 6.67 (Sangat Rendah)' },
      { color: '#ba1a1a', label: '6.67 - 7.79 (Rendah)' },
      { color: '#FFD700', label: '7.80 - 8.02 (Sedang)' },
      { color: '#8EC849', label: '8.03 - 8.97 (Tinggi)' },
      { color: '#2C5E2E', label: '> 8.97 (Sangat Tinggi)' },
      { color: '#9CA3AF', label: 'Tidak Ada Data' }
    ]
  },
  K: {
    title: 'Kandungan Kalium (mg/100g)',
    items: [
      { color: '#991B1B', label: '< 14.7 (Sangat Rendah)' },
      { color: '#ba1a1a', label: '14.7 - 19.7 (Rendah)' },
      { color: '#FFD700', label: '19.8 - 33.1 (Sedang)' },
      { color: '#8EC849', label: '33.2 - 44.8 (Tinggi)' },
      { color: '#2C5E2E', label: '> 44.8 (Sangat Tinggi)' },
      { color: '#9CA3AF', label: 'Tidak Ada Data' }
    ]
  }
};

export const DEFAULT_CENTER: [number, number] = [-6.595, 106.816];
export const DEFAULT_ZOOM = 12;
export const MIN_ZOOM = 6;

export const BASEMAP_URLS: Record<string, string> = {
  'satelit': 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
  'standar': 'https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png',
  'jalan': 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png',
  'topografi': 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}'
};

export const BASEMAP_LABELS_URLS: Record<string, string | null> = {
  'satelit': 'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}',
  'standar': 'https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png',
  'jalan': 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager_only_labels/{z}/{x}/{y}{r}.png',
  'topografi': 'https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png'
};

export const BASEMAP_ATTRIBUTIONS: Record<string, string> = {
  'satelit': '&copy; ESRI',
  'standar': '&copy; CartoDB',
  'jalan': '&copy; CartoDB &copy; OpenStreetMap',
  'topografi': '&copy; ESRI'
};
