import React from 'react';
import { Button } from '../ui/button';
import { Download, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { exportAppointmentsToCSV } from '../../utils/csvExport';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface BulkActionsProps {
  selectedAppointments: string[];
  allAppointments: any[];
  onSelectionChange: (selected: string[]) => void;
  onDataChange: () => void;
}

const BulkActions = ({ 
  selectedAppointments, 
  allAppointments, 
  onSelectionChange,
  onDataChange 
}: BulkActionsProps) => {
  const selectedData = allAppointments.filter(apt => 
    selectedAppointments.includes(apt.id)
  );

  const handleExportAll = () => {
    exportAppointmentsToCSV(allAppointments);
    toast({
      title: "Export Complete",
      description: "All appointments exported to CSV",
    });
  };

  const handleExportSelected = () => {
    if (selectedAppointments.length === 0) {
      toast({
        title: "No Selection",
        description: "Please select appointments to export",
        variant: "destructive"
      });
      return;
    }
    exportAppointmentsToCSV(selectedData);
    toast({
      title: "Export Complete",
      description: `${selectedAppointments.length} appointments exported to CSV`,
    });
  };

  const handleBulkStatusUpdate = async (status: string) => {
    if (selectedAppointments.length === 0) {
      toast({
        title: "No Selection",
        description: "Please select appointments to update",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status })
        .in('id', selectedAppointments);

      if (error) throw error;

      toast({
        title: "Success",
        description: `${selectedAppointments.length} appointments updated to ${status}`,
      });

      onSelectionChange([]);
      onDataChange();
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to update appointments",
        variant: "destructive"
      });
    }
  };

  const handleBulkDelete = async () => {
    if (selectedAppointments.length === 0) {
      toast({
        title: "No Selection", 
        description: "Please select appointments to delete",
        variant: "destructive"
      });
      return;
    }

    if (!confirm(`Are you sure you want to delete ${selectedAppointments.length} appointments?`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('appointments')
        .delete()
        .in('id', selectedAppointments);

      if (error) throw error;

      toast({
        title: "Success",
        description: `${selectedAppointments.length} appointments deleted`,
      });

      onSelectionChange([]);
      onDataChange();
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to delete appointments",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="flex flex-wrap gap-2 mb-4 p-4 bg-gray-50 rounded-lg">
      <Button
        onClick={handleExportAll}
        variant="outline"
        size="sm"
        className="flex items-center gap-2"
      >
        <Download className="h-4 w-4" />
        Export All
      </Button>

      {selectedAppointments.length > 0 && (
        <>
          <Button
            onClick={handleExportSelected}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Export Selected ({selectedAppointments.length})
          </Button>

          <Button
            onClick={() => handleBulkStatusUpdate('completed')}
            variant="outline"
            size="sm"
            className="flex items-center gap-2 text-green-600 hover:text-green-700"
          >
            <CheckCircle className="h-4 w-4" />
            Mark Completed
          </Button>

          <Button
            onClick={() => handleBulkStatusUpdate('cancelled')}
            variant="outline"
            size="sm"
            className="flex items-center gap-2 text-yellow-600 hover:text-yellow-700"
          >
            <XCircle className="h-4 w-4" />
            Mark Cancelled
          </Button>

          <Button
            onClick={handleBulkDelete}
            variant="outline"
            size="sm"
            className="flex items-center gap-2 text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
            Delete Selected
          </Button>
        </>
      )}
    </div>
  );
};

export default BulkActions;