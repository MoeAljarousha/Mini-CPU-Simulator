import React from 'react';
import { SERVICE_TYPES } from '../../types/car';

interface ServiceInfoSectionProps {
  formData: {
    serviceType: string;
    vehicleInfo: string;
    additionalNotes: string;
  };
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}

const ServiceInfoSection = ({ formData, onInputChange }: ServiceInfoSectionProps) => {
  return (
    <>
      <div>
        <label className="block text-sm font-semibold mb-2">
          Service Type *
        </label>
        <select
          name="serviceType"
          value={formData.serviceType}
          onChange={onInputChange}
          required
          className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-[#3cc421] focus:outline-none"
        >
          <option value="">Select a service</option>
          {SERVICE_TYPES.map((service) => (
            <option key={service} value={service}>{service}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2">
          Vehicle Information
        </label>
        <input
          type="text"
          name="vehicleInfo"
          value={formData.vehicleInfo}
          onChange={onInputChange}
          className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-[#3cc421] focus:outline-none"
          placeholder="e.g., 2018 Honda Civic, License Plate: ABC123"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2">
          Additional Notes
        </label>
        <textarea
          name="additionalNotes"
          value={formData.additionalNotes}
          onChange={onInputChange}
          rows={3}
          className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-[#3cc421] focus:outline-none resize-none"
          placeholder="Any specific concerns or additional information..."
        />
      </div>
    </>
  );
};

export default ServiceInfoSection;