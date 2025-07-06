export const exportAppointmentsToCSV = (appointments: any[]) => {
  const headers = [
    'Date',
    'Time', 
    'Type',
    'Customer Name',
    'Customer Email',
    'Customer Phone',
    'Service Type',
    'Car Details',
    'Vehicle Info',
    'Driver\'s License',
    'Status',
    'Additional Notes',
    'Created At'
  ];

  const csvContent = [
    headers.join(','),
    ...appointments.map(apt => [
      apt.appointment_date,
      apt.appointment_time,
      apt.type,
      `"${apt.customer_name}"`,
      apt.customer_email,
      apt.customer_phone || '',
      apt.service_type || '',
      `"${apt.car_details || ''}"`,
      `"${apt.vehicle_info || ''}"`,
      apt.drivers_license || '',
      apt.status,
      `"${apt.additional_notes || ''}"`,
      new Date(apt.created_at).toLocaleString()
    ].join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `appointments_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};