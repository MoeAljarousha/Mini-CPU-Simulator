import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Calendar, Clock, User, Phone, Mail, Car, Wrench, CheckCircle, XCircle, X, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import BulkActions from './BulkActions';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface Appointment {
  id: string;
  type: 'service' | 'testdrive';
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  appointment_date: string;
  appointment_time: string;
  service_type?: string;
  vehicle_info?: string;
  car_details?: string;
  drivers_license?: string;
  additional_notes?: string;
  status: 'active' | 'completed' | 'cancelled';
  created_at: string;
}

const AdminAppointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed' | 'cancelled'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAppointments, setSelectedAppointments] = useState<string[]>([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    fetchAppointments();
  }, [refreshTrigger]);

  const fetchAppointments = async () => {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .order('appointment_date', { ascending: true })
        .order('appointment_time', { ascending: true });

      if (error) throw error;
      setAppointments(data as Appointment[] || []);
    } catch (error: any) {
      console.error('Error fetching appointments:', error);
      toast({
        title: "Error",
        description: "Failed to fetch appointments",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateAppointmentStatus = async (id: string, status: 'active' | 'completed' | 'cancelled') => {
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status })
        .eq('id', id);

      if (error) throw error;

      setAppointments(prev => 
        prev.map(apt => apt.id === id ? { ...apt, status } : apt)
      );

      toast({
        title: "Status Updated",
        description: `Appointment marked as ${status}`,
      });
    } catch (error: any) {
      console.error('Error updating appointment:', error);
      toast({
        title: "Error",
        description: "Failed to update appointment status",
        variant: "destructive"
      });
    }
  };

  const deleteAppointment = async (id: string) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setAppointments(prev => prev.filter(apt => apt.id !== id));

      toast({
        title: "Appointment Deleted",
        description: "Appointment has been removed",
      });
    } catch (error: any) {
      console.error('Error deleting appointment:', error);
      toast({
        title: "Error",
        description: "Failed to delete appointment",
        variant: "destructive"
      });
      
      setSelectedAppointments([]);
      setRefreshTrigger(prev => prev + 1);
    }
  };

  const isAppointmentActive = (appointment: Appointment) => {
    const now = new Date();
    const appointmentDateTime = new Date(`${appointment.appointment_date}T${appointment.appointment_time}`);
    return appointmentDateTime > now && appointment.status === 'active';
  };

  const filteredAppointments = appointments.filter(apt => {
    // Filter by status
    let statusMatch = true;
    if (filter === 'active') {
      statusMatch = isAppointmentActive(apt);
    } else if (filter !== 'all') {
      statusMatch = apt.status === filter;
    }

    // Filter by search term
    let searchMatch = true;
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      searchMatch = 
        apt.customer_name.toLowerCase().includes(searchLower) ||
        apt.customer_email.toLowerCase().includes(searchLower) ||
        (apt.customer_phone && apt.customer_phone.toLowerCase().includes(searchLower)) ||
        apt.type.toLowerCase().includes(searchLower) ||
        (apt.service_type && apt.service_type.toLowerCase().includes(searchLower)) ||
        (apt.vehicle_info && apt.vehicle_info.toLowerCase().includes(searchLower)) ||
        (apt.car_details && apt.car_details.toLowerCase().includes(searchLower)) ||
        (apt.additional_notes && apt.additional_notes.toLowerCase().includes(searchLower));
    }

    return statusMatch && searchMatch;
  });

  const getStatusBadge = (appointment: Appointment) => {
    const isActive = isAppointmentActive(appointment);
    
    if (appointment.status === 'cancelled') {
      return <Badge variant="destructive">Cancelled</Badge>;
    }
    if (appointment.status === 'completed') {
      return <Badge variant="secondary">Completed</Badge>;
    }
    if (isActive) {
      return <Badge variant="default">Active</Badge>;
    }
    return <Badge variant="outline">Expired</Badge>;
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timeStr: string) => {
    return new Date(`2000-01-01T${timeStr}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedAppointments(filteredAppointments.map(apt => apt.id));
    } else {
      setSelectedAppointments([]);
    }
  };

  const handleSelectAppointment = (appointmentId: string, checked: boolean) => {
    if (checked) {
      setSelectedAppointments(prev => [...prev, appointmentId]);
    } else {
      setSelectedAppointments(prev => prev.filter(id => id !== appointmentId));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-white">Loading appointments...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Appointments ({filteredAppointments.length})</h2>
        <div className="flex space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search appointments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64 bg-black/20 border-white/10 text-white placeholder:text-gray-400"
            />
          </div>
          <Select value={filter} onValueChange={(value: any) => setFilter(value)}>
            <SelectTrigger className="w-48 bg-black/20 border-white/10 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Appointments</SelectItem>
              <SelectItem value="active">Active Only</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <BulkActions
        selectedAppointments={selectedAppointments}
        allAppointments={appointments}
        onSelectionChange={setSelectedAppointments}
        onDataChange={() => setRefreshTrigger(prev => prev + 1)}
      />

      {filteredAppointments.length === 0 ? (
        <Card className="bg-black/20 border-white/10">
          <CardContent className="py-8 text-center text-white">
            No appointments found.
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-black/20 border-white/10">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-white/10">
                  <TableHead className="text-white">
                    <Checkbox
                      checked={selectedAppointments.length === filteredAppointments.length && filteredAppointments.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead className="text-white">Type</TableHead>
                  <TableHead className="text-white">Customer</TableHead>
                  <TableHead className="text-white">Date & Time</TableHead>
                  <TableHead className="text-white">Details</TableHead>
                  <TableHead className="text-white">Status</TableHead>
                  <TableHead className="text-white">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAppointments.map((appointment) => (
                  <TableRow key={appointment.id} className="border-white/10">
                    <TableCell className="text-white">
                      <Checkbox
                        checked={selectedAppointments.includes(appointment.id)}
                        onCheckedChange={(checked) => handleSelectAppointment(appointment.id, checked as boolean)}
                      />
                    </TableCell>
                    <TableCell className="text-white">
                      <div className="flex items-center space-x-2">
                        {appointment.type === 'service' ? (
                          <Wrench className="h-4 w-4" />
                        ) : (
                          <Car className="h-4 w-4" />
                        )}
                        <span className="capitalize">{appointment.type}</span>
                      </div>
                    </TableCell>
                    
                    <TableCell className="text-white">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <User className="h-3 w-3" />
                          <span className="font-medium">{appointment.customer_name}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-300">
                          <Mail className="h-3 w-3" />
                          <span>{appointment.customer_email}</span>
                        </div>
                        {appointment.customer_phone && (
                          <div className="flex items-center space-x-2 text-sm text-gray-300">
                            <Phone className="h-3 w-3" />
                            <span>{appointment.customer_phone}</span>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    
                    <TableCell className="text-white">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-3 w-3" />
                          <span>{formatDate(appointment.appointment_date)}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="h-3 w-3" />
                          <span>{formatTime(appointment.appointment_time)}</span>
                        </div>
                      </div>
                    </TableCell>
                    
                    <TableCell className="text-white">
                      <div className="space-y-1 text-sm">
                        {appointment.service_type && (
                          <div><strong>Service:</strong> {appointment.service_type}</div>
                        )}
                        {appointment.vehicle_info && (
                          <div><strong>Vehicle:</strong> {appointment.vehicle_info}</div>
                        )}
                        {appointment.car_details && (
                          <div><strong>Car:</strong> {appointment.car_details}</div>
                        )}
                        {appointment.drivers_license && (
                          <div><strong>License:</strong> {appointment.drivers_license}</div>
                        )}
                        {appointment.additional_notes && (
                          <div><strong>Notes:</strong> {appointment.additional_notes}</div>
                        )}
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      {getStatusBadge(appointment)}
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex space-x-2">
                        {appointment.status === 'active' && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateAppointmentStatus(appointment.id, 'completed')}
                              className="text-green-500 border-green-500/50 hover:bg-green-500/10"
                            >
                              <CheckCircle className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateAppointmentStatus(appointment.id, 'cancelled')}
                              className="text-red-500 border-red-500/50 hover:bg-red-500/10"
                            >
                              <XCircle className="h-3 w-3" />
                            </Button>
                          </>
                        )}
                        {(appointment.status === 'completed' || appointment.status === 'cancelled') && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => deleteAppointment(appointment.id)}
                            className="text-gray-500 border-gray-500/50 hover:bg-gray-500/10"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminAppointments;