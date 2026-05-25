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
      { color: '#991B1B', label: '< 10 (Sangat Rendah)' },
      { color: '#ba1a1a', label: '10 - 20 (Rendah)' },
      { color: '#FFD700', label: '21 - 50 (Sedang)' },
      { color: '#8EC849', label: '51 - 75 (Tinggi)' },
      { color: '#2C5E2E', label: '> 75 (Sangat Tinggi)' },
      { color: '#9CA3AF', label: 'Tidak Ada Data' }
    ]
  },
  P: {
    title: 'Kandungan Fosfor',
    items: [
      { color: '#991B1B', label: '< 15 (Sangat Rendah)' },
      { color: '#ba1a1a', label: '15 - 20 (Rendah)' },
      { color: '#FFD700', label: '21 - 40 (Sedang)' },
      { color: '#8EC849', label: '41 - 60 (Tinggi)' },
      { color: '#2C5E2E', label: '> 60 (Sangat Tinggi)' },
      { color: '#9CA3AF', label: 'Tidak Ada Data' }
    ]
  },
  K: {
    title: 'Kandungan Kalium (mg/100g)',
    items: [
      { color: '#991B1B', label: '< 10 (Sangat Rendah)' },
      { color: '#ba1a1a', label: '10 - 20 (Rendah)' },
      { color: '#FFD700', label: '21 - 40 (Sedang)' },
      { color: '#8EC849', label: '41 - 60 (Tinggi)' },
      { color: '#2C5E2E', label: '> 60 (Sangat Tinggi)' },
      { color: '#9CA3AF', label: 'Tidak Ada Data' }
    ]
  }
};
