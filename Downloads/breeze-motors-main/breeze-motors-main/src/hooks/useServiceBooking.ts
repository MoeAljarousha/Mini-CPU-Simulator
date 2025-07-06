import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ServiceBookingData {
  name: string;
  email: string;
  phone: string;
  serviceType: string;
  vehicleInfo: string;
  preferredDate: string;
  preferredTime: string;
  additionalNotes: string;
}

export const useServiceBooking = () => {
  const [formData, setFormData] = useState<ServiceBookingData>({
    name: '',
    email: '',
    phone: '',
    serviceType: '',
    vehicleInfo: '',
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
      
      return data.length === 0;
    } catch (error) {
      console.error('Error checking availability:', error);
      return true;
    }
  };

  const isValidBusinessHours = (time: string) => {
    const hour = parseInt(time.split(':')[0]);
    const isPM = time.includes('PM');
    const hour24 = isPM && hour !== 12 ? hour + 12 : (hour === 12 && !isPM ? 0 : hour);
    return hour24 >= 9 && hour24 <= 16;
  };

  const isPastDateTime = (date: string, time: string) => {
    const now = new Date();
    const appointmentDate = new Date(date);
    
    if (appointmentDate.toDateString() === now.toDateString()) {
      const hour = parseInt(time.split(':')[0]);
      const isPM = time.includes('PM');
      const hour24 = isPM && hour !== 12 ? hour + 12 : (hour === 12 && !isPM ? 0 : hour);
      
      return hour24 <= now.getHours();
    }
    
    return false;
  };

  const validateForm = async () => {
    if (!formData.name || !formData.email || !formData.phone || !formData.serviceType) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return false;
    }

    if (!formData.preferredDate || !formData.preferredTime) {
      toast({
        title: "Missing Information",
        description: "Please select both date and time for your appointment",
        variant: "destructive"
      });
      return false;
    }

    if (!isValidBusinessHours(formData.preferredTime)) {
      toast({
        title: "Invalid Time",
        description: "Please select a time between 9:00 AM and 4:00 PM",
        variant: "destructive"
      });
      return false;
    }

    if (isPastDateTime(formData.preferredDate, formData.preferredTime)) {
      toast({
        title: "Invalid Time",
        description: "Please select a future time for today's appointments",
        variant: "destructive"
      });
      return false;
    }

    const isAvailable = await checkAvailability(formData.preferredDate, formData.preferredTime);
    if (!isAvailable) {
      toast({
        title: "Time Unavailable",
        description: "This time slot is already booked. Please choose a different time.",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const submitBooking = async () => {
    try {
      const { error: dbError } = await supabase
        .from('appointments')
        .insert({
          type: 'service',
          customer_name: formData.name,
          customer_email: formData.email,
          customer_phone: formData.phone,
          appointment_date: formData.preferredDate,
          appointment_time: convertTimeToStandard(formData.preferredTime),
          service_type: formData.serviceType,
          vehicle_info: formData.vehicleInfo,
          additional_notes: formData.additionalNotes,
          status: 'active'
        });

      if (dbError) throw dbError;

      const { data, error } = await supabase.functions.invoke('send-email', {
        body: {
          type: 'service',
          formData: formData
        }
      });

      if (error) throw error;

      toast({
        title: "Service Booked!",
        description: "We'll contact you within 24 hours to confirm your appointment",
      });

      return true;
    } catch (error: any) {
      console.error('Service booking error:', error);
      toast({
        title: "Error",
        description: "Failed to book service. Please try again.",
        variant: "destructive"
      });
      return false;
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      serviceType: '',
      vehicleInfo: '',
      preferredDate: '',
      preferredTime: '',
      additionalNotes: ''
    });
  };

  return {
    formData,
    handleInputChange,
    validateForm,
    submitBooking,
    resetForm
  };
};