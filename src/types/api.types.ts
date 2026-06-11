export interface UserRead {
  id: number;
  email: string;
  full_name: string;
  role: 'user' | 'expert' | 'admin';
  is_active: boolean;
  created_at: string;
}

export interface Token {
  access_token: string;
  token_type: string;
}

export interface HaraProperties {
  id: number;
  name: string;
  ph_rata2: number;
  n_rata2: number;
  p_rata2: number;
  k_rata2: number;
  slope__?: string;
  texture_of?: string;
}

export interface GeoJSONFeature {
  type: 'Feature';
  geometry: any;
  properties: HaraProperties;
}

export interface GeoJSONFeatureCollection {
  type: 'FeatureCollection';
  features: GeoJSONFeature[];
}

export interface AdvisoryRead {
  id: number;
  hara_area_id: number;
  title: string;
  content: string;
  category: string;
  is_active: boolean;
  created_at: string;
}

export interface SavedRegionPoint {
  type: 'Point';
  coordinates: [number, number];
}

export interface SavedRegionRead {
  id: number;
  hara_area_id: number;
  selected_point: SavedRegionPoint;
  label: string;
  area: GeoJSONFeature;
  created_at: string;
}

export interface UserLogin {
  email: string;
  password: string;
}

export interface UserRegister {
  email: string;
  password: string;
  full_name: string;
}

export interface HaraAreaUpdate {
  name?: string | null;
  ph_rata2?: number | null;
  n_rata2?: number | null;
  p_rata2?: number | null;
  k_rata2?: number | null;
  slope__?: string | null;
  texture_of?: string | null;
}

export interface AdvisoryCreate {
  title: string;
  content: string;
  category?: 'soil' | 'fertilizer' | 'general' | null;
  is_active?: boolean;
}

export interface AdvisoryUpdate {
  title?: string | null;
  content?: string | null;
  category?: 'soil' | 'fertilizer' | 'general' | null;
  is_active?: boolean | null;
}

export interface GlossaryTerm {
  id: number;
  term: string;
  definition: string;
  created_at: string;
  updated_at?: string;
}

export interface GlossaryCreate {
  term: string;
  definition: string;
}

export interface GlossaryUpdate {
  term?: string;
  definition?: string;
}

export interface HaraAreaCreate {
  geometry: any;
  properties: {
    name?: string | null;
    ph_rata2?: number | null;
    n_rata2?: number | null;
    p_rata2?: number | null;
    k_rata2?: number | null;
    slope__?: string | null;
    texture_of?: string | null;
  };
}

export interface Averages {
  ph: number;
  n: number;
  p: number;
  k: number;
}

export interface PhDistribution {
  sangat_masam: number;
  masam: number;
  sedikit_masam: number;
  netral: number;
  sedikit_alkalis: number;
  alkalis: number;
}

export interface CriticalArea {
  id: number;
  name: string;
  value: number;
  parameter: string;
}

export interface MacroAnalyticsRead {
  averages: Averages;
  ph_distribution: PhDistribution;
  critical_areas: CriticalArea[];
}

export interface DiagnosisFactor {
  key: string;
  label: string;
  value: number | string | null;
  status: string;
  status_label: string;
  severity: 'info' | 'watch' | 'attention' | 'critical';
  message: string;
}

export interface DiagnosisRecommendation {
  priority: number;
  category: string;
  title: string;
  action: string;
  reason: string;
}

export interface CropSuitability {
  crop: string;
  class: 'S1' | 'S2' | 'S3' | 'N';
  limiting_factors: string[];
  ph_class: 'S1' | 'S2' | 'S3' | 'N';
  n_class: 'S1' | 'S2' | 'S3' | 'N';
  p_class: 'S1' | 'S2' | 'S3' | 'N';
  k_class: 'S1' | 'S2' | 'S3' | 'N';
}

export interface HaraDiagnosisRead {
  rule_set_version: string;
  status: 'ready' | 'insufficient_data';
  summary: string;
  area: any;
  factors: DiagnosisFactor[];
  recommendations: DiagnosisRecommendation[];
  crop_suitabilities: CropSuitability[];
}



