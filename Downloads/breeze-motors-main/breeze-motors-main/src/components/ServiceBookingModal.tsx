import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Car } from 'lucide-react';
import { useServiceBooking } from '../hooks/useServiceBooking';
import PersonalInfoSection from './service-booking/PersonalInfoSection';
import ServiceInfoSection from './service-booking/ServiceInfoSection';
import SchedulingSection from './service-booking/SchedulingSection';

interface ServiceBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ServiceBookingModal = ({ isOpen, onClose }: ServiceBookingModalProps) => {
  const { formData, handleInputChange, validateForm, submitBooking, resetForm } = useServiceBooking();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const isValid = await validateForm();
    if (!isValid) return;

    const success = await submitBooking();
    if (success) {
      resetForm();
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-[#3cc421] flex items-center">
            <Car className="h-6 w-6 mr-2" />
            Book Service Appointment
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <PersonalInfoSection formData={formData} onInputChange={handleInputChange} />
          <ServiceInfoSection formData={formData} onInputChange={handleInputChange} />
          <SchedulingSection formData={formData} onInputChange={handleInputChange} />

          {/* Submit Buttons */}
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
              Book Appointment
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ServiceBookingModal;