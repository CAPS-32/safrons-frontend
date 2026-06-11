import { useState, useEffect } from 'react';
import { haraService } from '../services/hara.service';
import type { HaraDiagnosisRead, GeoJSONFeature } from '../types/api.types';

export function useHaraDiagnosis(selectedFeature: GeoJSONFeature | null) {
  const [diagnosis, setDiagnosis] = useState<HaraDiagnosisRead | null>(null);
  const [isDiagnosisLoading, setIsDiagnosisLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    if (!selectedFeature) {
      setDiagnosis(null);
      return;
    }

    const fetchDiagnosis = async () => {
      try {
        setIsDiagnosisLoading(true);
        const data = await haraService.getDiagnosis(selectedFeature.properties.id);
        if (isMounted) setDiagnosis(data);
      } catch (error) {
        if (isMounted) console.error('Failed to fetch diagnosis:', error);
      } finally {
        if (isMounted) setIsDiagnosisLoading(false);
      }
    };

    void fetchDiagnosis();
    return () => {
      isMounted = false;
    };
  }, [selectedFeature]);

  return { diagnosis, isDiagnosisLoading, setDiagnosis };
}
