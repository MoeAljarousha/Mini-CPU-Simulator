import React from 'react';
import { Calendar, Clock } from 'lucide-react';

interface SchedulingSectionProps {
  formData: {
    preferredDate: string;
    preferredTime: string;
  };
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

const SchedulingSection = ({ formData, onInputChange }: SchedulingSectionProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-semibold mb-2">
          <Calendar className="h-4 w-4 inline mr-1" />
          Preferred Date
        </label>
        <input
          type="date"
          name="preferredDate"
          value={formData.preferredDate}
          onChange={onInputChange}
          min={new Date().toISOString().split('T')[0]}
          max={new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0]}
          className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-[#3cc421] focus:outline-none"
          onInput={(e) => {
            const input = e.target as HTMLInputElement;
            const date = new Date(input.value);
            if (isNaN(date.getTime())) return;
            
            const year = date.getFullYear();
            const month = date.getMonth() + 1;
            const day = date.getDate();
            
            const daysInMonth = new Date(year, month, 0).getDate();
            if (day > daysInMonth) {
              input.setCustomValidity(`This month only has ${daysInMonth} days`);
            } else {
              input.setCustomValidity('');
            }
          }}
        />
      </div>
      
      <div>
        <label className="block text-sm font-semibold mb-2">
          <Clock className="h-4 w-4 inline mr-1" />
          Preferred Time
        </label>
        <select
          name="preferredTime"
          value={formData.preferredTime}
          onChange={onInputChange}
          className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-[#3cc421] focus:outline-none"
        >
          <option value="">Select time</option>
          <option value="9:00 AM">9:00 AM</option>
          <option value="10:00 AM">10:00 AM</option>
          <option value="11:00 AM">11:00 AM</option>
          <option value="12:00 PM">12:00 PM</option>
          <option value="1:00 PM">1:00 PM</option>
          <option value="2:00 PM">2:00 PM</option>
          <option value="3:00 PM">3:00 PM</option>
          <option value="4:00 PM">4:00 PM</option>
        </select>
      </div>
    </div>
  );
};

export default SchedulingSection;