import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Calendar, Clock, User, Phone, Mail, Car, FileText } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Car as CarType } from '../types/car';
import { supabase } from '@/integrations/supabase/client';

interface TestDriveModalProps {
  isOpen: boolean;
  onClose: () => void;
  car: CarType;
}

const TestDriveModal = ({ isOpen, onClose, car }: TestDriveModalProps) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    driversLicense: '',
    preferredDate: '',
    preferredTime: '',
    additionalNotes: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const convertTimeToStandard = (time12: string) => {
    const [time, modifier] = time12.split(' ');
    let [hours, minutes] = time.split(':');
    if (hours === '12') {
      hours = '00';
    }
    if (modifier === 'PM') {
      hours = (parseInt(hours, 10) + 12).toString();
    }
    return `${hours}:${minutes}:00`;
  };

  const checkAvailability = async (date: string, time: string) => {
    if (!date || !time) return true;
    
    const standardTime = convertTimeToStandard(time);
    
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('id')
        .eq('appointment_date', date)
        .eq('appointment_time', standardTime)
        .eq('status', 'active')
        .limit(1);

      if (error) throw error;
      
      return data.length === 0; // Available if no existing appointment
    } catch (error) {
      console.error('Error checking availability:', error);
      return true; // Allow booking if check fails
    }
  };

  const isValidBusinessHours = (time: string) => {
    const hour = parseInt(time.split(':')[0]);
    const isPM = time.includes('PM');
    const hour24 = isPM && hour !== 12 ? hour + 12 : (hour === 12 && !isPM ? 0 : hour);
    return hour24 >= 9 && hour24 <= 16; // 9 AM to 4 PM
  };

  const isPastDateTime = (date: string, time: string) => {
    const now = new Date();
    const appointmentDate = new Date(date);
    
    // Check if it's today
    if (appointmentDate.toDateString() === now.toDateString()) {
      const hour = parseInt(time.split(':')[0]);
      const isPM = time.includes('PM');
      const hour24 = isPM && hour !== 12 ? hour + 12 : (hour === 12 && !isPM ? 0 : hour);
      
      return hour24 <= now.getHours();
    }
    
    return false;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.name || !formData.email || !formData.phone || !formData.driversLicense) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    if (!formData.preferredDate || !formData.preferredTime) {
      toast({
        title: "Missing Information",
        description: "Please select both date and time for your test drive",
        variant: "destructive"
      });
      return;
    }

    // Validate business hours
    if (!isValidBusinessHours(formData.preferredTime)) {
      toast({
        title: "Invalid Time",
        description: "Please select a time between 9:00 AM and 4:00 PM",
        variant: "destructive"
      });
      return;
    }

    // Check if the selected time is in the past (for today)
    if (isPastDateTime(formData.preferredDate, formData.preferredTime)) {
      toast({
        title: "Invalid Time",
        description: "Please select a future time for today's appointments",
        variant: "destructive"
      });
      return;
    }

    // Check availability
    const isAvailable = await checkAvailability(formData.preferredDate, formData.preferredTime);
    if (!isAvailable) {
      toast({
        title: "Time Unavailable",
        description: "This time slot is already booked. Please choose a different time.",
        variant: "destructive"
      });
      return;
    }

    try {
      const carDetails = `${car.year} ${car.make} ${car.model}`;
      
      // Save appointment to database
      const { error: dbError } = await supabase
        .from('appointments')
        .insert({
          type: 'testdrive',
          customer_name: formData.name,
          customer_email: formData.email,
          customer_phone: formData.phone,
          appointment_date: formData.preferredDate,
          appointment_time: convertTimeToStandard(formData.preferredTime),
          car_details: carDetails,
          drivers_license: formData.driversLicense,
          additional_notes: formData.additionalNotes,
          status: 'active'
        });

      if (dbError) throw dbError;
      
      const { data, error } = await supabase.functions.invoke('send-email', {
        body: {
          type: 'testdrive',
          formData: {
            ...formData,
            carDetails: carDetails
          }
        }
      });

      if (error) throw error;

      toast({
        title: "Test Drive Booked!",
        description: "We'll contact you within 24 hours to confirm your test drive appointment",
      });

      // Reset form and close modal
      setFormData({
        name: '',
        email: '',
        phone: '',
        driversLicense: '',
        preferredDate: '',
        preferredTime: '',
        additionalNotes: ''
      });
      onClose();
    } catch (error: any) {
      console.error('Test drive booking error:', error);
      toast({
        title: "Error",
        description: "Failed to book test drive. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-[#3cc421] flex items-center">
            <Car className="h-6 w-6 mr-2" />
            Book Test Drive
          </DialogTitle>
          <div className="bg-gray-50 p-4 rounded-lg mt-4">
            <h4 className="font-semibold text-gray-800">Vehicle:</h4>
            <p className="text-lg text-[#3cc421] font-bold">
              {car.year} {car.make} {car.model}
            </p>
            <p className="text-gray-600">Price: ${car.price.toLocaleString()}</p>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
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
                onChange={handleInputChange}
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
                onChange={handleInputChange}
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
              onChange={handleInputChange}
              required
              className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-[#3cc421] focus:outline-none"
              placeholder="your.email@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              <FileText className="h-4 w-4 inline mr-1" />
              Driver's License Number *
            </label>
            <input
              type="text"
              name="driversLicense"
              value={formData.driversLicense}
              onChange={handleInputChange}
              required
              className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-[#3cc421] focus:outline-none"
              placeholder="Enter your driver's license number"
            />
            <p className="text-xs text-gray-500 mt-1">
              Required for insurance and safety purposes
            </p>
          </div>

          {/* Appointment Scheduling */}
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
                onChange={handleInputChange}
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
                  
                  // Check for invalid dates
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
                onChange={handleInputChange}
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

          <div>
            <label className="block text-sm font-semibold mb-2">
              Additional Notes
            </label>
            <textarea
              name="additionalNotes"
              value={formData.additionalNotes}
              onChange={handleInputChange}
              rows={3}
              className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-[#3cc421] focus:outline-none resize-none"
              placeholder="Any specific questions about the vehicle or special requests..."
            />
          </div>

          {/* Terms and Submit */}
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
            <p className="text-sm text-yellow-800">
              <strong>Please note:</strong> You must bring a valid driver's license and proof of insurance for the test drive. 
              Test drives are typically 15-20 minutes and must be accompanied by a Breeze Motors representative.
            </p>
          </div>

          <div className="flex gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-[#3cc421] hover:bg-[#2ea01c] text-white"
            >
              Book Test Drive
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TestDriveModal;