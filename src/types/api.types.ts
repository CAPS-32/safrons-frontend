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
