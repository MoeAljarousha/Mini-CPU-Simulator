import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Search, Calendar, Clock, User, Mail, Phone, Car } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

const AppointmentLookup = () => {
  const [email, setEmail] = useState('');
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleLookup = async () => {
    if (!email.trim()) {
      toast({
        title: "Email Required",
        description: "Please enter your email address",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('customer_email', email.toLowerCase().trim())
        .order('appointment_date', { ascending: false });

      if (error) throw error;

      setAppointments(data || []);
      setSearched(true);

      if (data?.length === 0) {
        toast({
          title: "No Appointments Found",
          description: "We couldn't find any appointments with that email address",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to lookup appointments. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAppointment = async (appointmentId: string) => {
    if (!confirm('Are you sure you want to cancel this appointment?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status: 'cancelled' })
        .eq('id', appointmentId);

      if (error) throw error;

      toast({
        title: "Appointment Cancelled",
        description: "Your appointment has been cancelled successfully",
      });

      // Refresh the appointments
      handleLookup();
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to cancel appointment. Please contact us directly.",
        variant: "destructive"
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      active: "default",
      completed: "secondary", 
      cancelled: "destructive"
    };

    return (
      <Badge variant={variants[status] || "outline"}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (time: string) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-[#3cc421] mb-4">
          Look Up Your Appointments
        </h1>
        <p className="text-gray-600">
          Enter your email address to view and manage your appointments
        </p>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Find Your Appointments
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleLookup()}
              className="flex-1"
            />
            <Button 
              onClick={handleLookup}
              disabled={loading}
              className="bg-[#3cc421] hover:bg-[#2ea01c]"
            >
              {loading ? 'Searching...' : 'Search'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {searched && (
        <div className="space-y-4">
          {appointments.length > 0 ? (
            <>
              <h2 className="text-xl font-semibold mb-4">
                Found {appointments.length} appointment{appointments.length !== 1 ? 's' : ''}
              </h2>
              {appointments.map((appointment) => (
                <Card key={appointment.id} className="border-l-4 border-l-[#3cc421]">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-2">
                        <Car className="h-5 w-5 text-[#3cc421]" />
                        <span className="font-semibold text-lg">
                          {appointment.type === 'service' ? 'Service Appointment' : 'Test Drive'}
                        </span>
                      </div>
                      {getStatusBadge(appointment.status)}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span>{formatDate(appointment.appointment_date)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span>{formatTime(appointment.appointment_time)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-500" />
                        <span>{appointment.customer_name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-gray-500" />
                        <span>{appointment.customer_email}</span>
                      </div>
                    </div>

                    {appointment.service_type && (
                      <div className="mb-2">
                        <strong>Service Type:</strong> {appointment.service_type}
                      </div>
                    )}

                    {appointment.car_details && (
                      <div className="mb-2">
                        <strong>Car Details:</strong> {appointment.car_details}
                      </div>
                    )}

                    {appointment.vehicle_info && (
                      <div className="mb-2">
                        <strong>Vehicle Info:</strong> {appointment.vehicle_info}
                      </div>
                    )}

                    {appointment.additional_notes && (
                      <div className="mb-4">
                        <strong>Notes:</strong> {appointment.additional_notes}
                      </div>
                    )}

                    {appointment.status === 'active' && (
                      <div className="flex gap-2 pt-4 border-t">
                        <Button
                          variant="outline"
                          onClick={() => handleCancelAppointment(appointment.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          Cancel Appointment
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </>
          ) : (
            <Card>
              <CardContent className="text-center p-8">
                <p className="text-gray-500">
                  No appointments found with email: <strong>{email}</strong>
                </p>
                <p className="text-sm text-gray-400 mt-2">
                  Make sure you're using the same email address you used when booking
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default AppointmentLookup;