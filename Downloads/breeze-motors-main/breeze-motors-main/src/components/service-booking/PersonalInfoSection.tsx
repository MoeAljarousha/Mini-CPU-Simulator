import React from 'react';
import { User, Phone, Mail } from 'lucide-react';

interface PersonalInfoSectionProps {
  formData: {
    name: string;
    email: string;
    phone: string;
  };
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const PersonalInfoSection = ({ formData, onInputChange }: PersonalInfoSectionProps) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold mb-2">
            <User className="h-4 w-4 inline mr-1" />
            Full Name *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={onInputChange}
            required
            className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-[#3cc421] focus:outline-none"
            placeholder="Enter your full name"
          />
        </div>
        
        <div>
          <label className="block text-sm font-semibold mb-2">
            <Phone className="h-4 w-4 inline mr-1" />
            Phone Number *
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={onInputChange}
            required
            className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-[#3cc421] focus:outline-none"
            placeholder="(519) 123-4567"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2">
          <Mail className="h-4 w-4 inline mr-1" />
          Email Address *
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={onInputChange}
          required
          className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-[#3cc421] focus:outline-none"
          placeholder="your.email@example.com"
        />
      </div>
    </>
  );
};

export default PersonalInfoSection;