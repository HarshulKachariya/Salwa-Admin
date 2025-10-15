import React from 'react';
import { useTranslation } from 'react-i18next';

interface Step6Data {
  healthAwarenessSupplements: string;
  epidemicControlDepartment: string;
  patientEducationServices: string;
  socialServices: string;
  medicalEquipmentRepairWorkshop: string;
  availabilityOfLongTermHospitalizationRiskManagement: string;
  availabilityOfHomecareServices: string;
  availabilityOfElderlyCareServices: string;
  availabilityOfMedicalEquipmentAndToolsStorage: string;
  availabilityOfMedicalEquipmentAnalysisStorage: string;
}

interface Step6Props {
  data: Step6Data;
  onChange: (data: Step6Data) => void;
}

const Step6PublicHealth: React.FC<Step6Props> = ({ data, onChange }) => {
  const { t } = useTranslation();
  const handleInputChange = (field: keyof Step6Data, value: string) => {
    onChange({
      ...data,
      [field]: value
    });
  };

  const renderYesNoDropdown = (field: keyof Step6Data, label: string) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <select
        value={data[field]}
        onChange={(e) => handleInputChange(field, e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">{t('steps.step1.selectOption')}</option>
        <option value="Yes">{t('steps.step1.yes')}</option>
        <option value="No">{t('steps.step1.no')}</option>
      </select>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('steps.step6.title')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {renderYesNoDropdown('healthAwarenessSupplements', t('steps.step6.healthAwarenessSupplements'))}
          {renderYesNoDropdown('epidemicControlDepartment', t('steps.step6.epidemicControlDepartment'))}
          {renderYesNoDropdown('patientEducationServices', t('steps.step6.patientEducationServices'))}
          {renderYesNoDropdown('socialServices', t('steps.step6.socialServices'))}
          {renderYesNoDropdown('medicalEquipmentRepairWorkshop', t('steps.step6.medicalEquipmentRepairWorkshop'))}
          {renderYesNoDropdown('availabilityOfLongTermHospitalizationRiskManagement', t('steps.step6.availabilityOfLongTermHospitalizationRiskManagement'))}
          {renderYesNoDropdown('availabilityOfHomecareServices', t('steps.step6.availabilityOfHomecareServices'))}
          {renderYesNoDropdown('availabilityOfElderlyCareServices', t('steps.step6.availabilityOfElderlyCareServices'))}
          {renderYesNoDropdown('availabilityOfMedicalEquipmentAndToolsStorage', t('steps.step6.availabilityOfMedicalEquipmentAndToolsStorage'))}
          {renderYesNoDropdown('availabilityOfMedicalEquipmentAnalysisStorage', t('steps.step6.availabilityOfMedicalEquipmentAnalysisStorage'))}
        </div>
      </div>
    </div>
  );
};

export default Step6PublicHealth;
