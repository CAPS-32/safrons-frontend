import { XMarkIcon, BookmarkIcon, PencilIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../hooks/useAuth';
import { useHaraDiagnosis } from '../../hooks/useHaraDiagnosis';
import { useHaraAdvisories } from '../../hooks/useHaraAdvisories';
import { useSoilMetricsForm } from '../../hooks/useSoilMetricsForm';
import { SoilMetricsList } from './SoilMetricsList';
import { PhysicalCharacteristics } from './PhysicalCharacteristics';
import { CropSuitabilityList } from './CropSuitabilityList';
import { ExpertEditForm } from './ExpertEditForm';
import { AdvisoriesSection } from './AdvisoriesSection';
import type { GeoJSONFeature } from '../../types/api.types';

interface DataPanelProps {
  selectedFeature: GeoJSONFeature | null;
  onAreaUpdate: (updatedFeature: GeoJSONFeature) => void;
  onClose: () => void;
  onSaveClick: () => void;
}

export default function DataPanel({
  selectedFeature,
  onAreaUpdate,
  onClose,
  onSaveClick,
}: DataPanelProps) {
  const { role } = useAuth();
  const isExpert = role === 'expert' || role === 'admin';

  // Custom Hooks
  const { diagnosis, isDiagnosisLoading } = useHaraDiagnosis(selectedFeature);

  const {
    advisories,
    isAddingAdvisory,
    setIsAddingAdvisory,
    editingAdvisoryId,
    setEditingAdvisoryId,
    newAdvisoryFormData,
    setNewAdvisoryFormData,
    advisoryFormData,
    setAdvisoryFormData,
    handleCreateAdvisory,
    startEditAdvisory,
    handleUpdateAdvisory,
    handleToggleAdvisoryActive,
  } = useHaraAdvisories(selectedFeature);

  const {
    isEditing,
    setIsEditing,
    isSubmitting,
    formData,
    setFormData,
    handleSaveArea,
  } = useSoilMetricsForm(selectedFeature, onAreaUpdate);

  if (!selectedFeature) return null;

  const { properties } = selectedFeature;

  return (
    <>
      {/* Overlay for mobile */}
      <div
        className="fixed inset-0 bg-on-surface/20 z-40 md:hidden transition-opacity"
        onClick={onClose}
      />

      <div
        className="absolute bottom-0 left-0 right-0 top-auto w-full max-h-[70vh] md:top-4 md:left-4 md:bottom-4 md:w-96 md:max-w-[calc(100vw-2rem)] md:h-auto z-[1000] bg-surface/95 backdrop-blur-md rounded-t-3xl rounded-b-none md:rounded-2xl shadow-2xl border-t border-x-0 border-b-0 md:border border-outline-variant flex flex-col overflow-hidden transition-all duration-500 ease-out animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
        onDoubleClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
        onWheel={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col h-full">
          {/* Drag handle for mobile */}
          <div className="w-full flex justify-center pt-4 pb-2 md:hidden">
            <div className="w-16 h-1.5 bg-outline-variant rounded-full" />
          </div>

          <div className="px-6 py-4 border-b border-outline-variant/50 flex justify-between items-center md:pt-6">
            <div className="flex flex-col gap-0.5">
              <h2 className="text-xl font-bold text-on-surface font-display tracking-tight">
                Informasi Lahan
              </h2>
              {role === 'admin' && (
                <span className="text-[10px] text-error font-bold uppercase tracking-wider">
                  Mode Admin
                </span>
              )}
              {role === 'expert' && (
                <span className="text-[10px] text-primary font-bold uppercase tracking-wider">
                  Mode Pakar
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {isExpert && !isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 rounded-full text-xs font-bold transition-all cursor-pointer"
                >
                  <PencilIcon className="w-3.5 h-3.5" />
                  Edit Lahan
                </button>
              )}
              <button
                onClick={onClose}
                className="p-2 text-on-surface-variant hover:text-primary hover:bg-surface-dim rounded-full transition-all"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div className="p-6 flex-1 overflow-y-auto space-y-6 scrollbar-hide">
            {isEditing ? (
              <ExpertEditForm
                formData={formData}
                setFormData={setFormData}
                isSubmitting={isSubmitting}
                handleSaveArea={handleSaveArea}
                setIsEditing={setIsEditing}
              />
            ) : (
              <>
                {/* Soil Chemistry indicators */}
                <SoilMetricsList properties={properties} />

                {/* Soil Physical characteristics */}
                <PhysicalCharacteristics properties={properties} />

                {/* Crop suitability diagnostics */}
                <CropSuitabilityList
                  cropSuitabilities={diagnosis?.crop_suitabilities}
                  isLoading={isDiagnosisLoading}
                />

                {/* Expert Recommendations */}
                <AdvisoriesSection
                  isExpert={isExpert}
                  advisories={advisories}
                  isAddingAdvisory={isAddingAdvisory}
                  setIsAddingAdvisory={setIsAddingAdvisory}
                  newAdvisoryFormData={newAdvisoryFormData}
                  setNewAdvisoryFormData={setNewAdvisoryFormData}
                  editingAdvisoryId={editingAdvisoryId}
                  setEditingAdvisoryId={setEditingAdvisoryId}
                  advisoryFormData={advisoryFormData}
                  setAdvisoryFormData={setAdvisoryFormData}
                  handleCreateAdvisory={handleCreateAdvisory}
                  startEditAdvisory={startEditAdvisory}
                  handleUpdateAdvisory={handleUpdateAdvisory}
                  handleToggleAdvisoryActive={handleToggleAdvisoryActive}
                />

                <button
                  onClick={onSaveClick}
                  className="w-full bg-primary text-white py-3.5 rounded-full font-bold font-display hover:bg-primary/90 transition-all shadow-md active:scale-95 mt-6 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <BookmarkIcon className="w-5 h-5" />
                  Simpan Lahan Ini
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
