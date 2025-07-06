import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Car } from '@/types/car';
import { toast } from '@/hooks/use-toast';

export const useSupabaseCars = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);

  // Convert database row to Car type
  const dbRowToCar = (row: any): Car => ({
    id: row.id,
    make: row.make,
    model: row.model,
    year: row.year,
    price: row.price,
    priceRange: row.price_range,
    mileage: row.mileage,
    fuelType: row.fuel_type,
    condition: row.condition,
    engine: row.engine,
    transmission: row.transmission,
    drivetrain: row.drivetrain,
    exteriorColor: row.exterior_color,
    interiorColor: row.interior_color,
    stockNumber: row.stock_number,
    vin: row.vin,
    images: row.images,
    features: row.features,
    trim: row.trim,
    allowTestDrive: row.allow_test_drive,
    createdAt: row.created_at,
  });

  // Convert Car type to database row
  const carToDbRow = (car: Omit<Car, 'id' | 'createdAt'>) => ({
    make: car.make,
    model: car.model,
    year: car.year,
    price: car.price,
    price_range: car.priceRange,
    mileage: car.mileage,
    fuel_type: car.fuelType,
    condition: car.condition,
    engine: car.engine,
    transmission: car.transmission,
    drivetrain: car.drivetrain,
    exterior_color: car.exteriorColor,
    interior_color: car.interiorColor,
    stock_number: car.stockNumber,
    vin: car.vin,
    images: car.images,
    features: car.features,
    trim: car.trim,
    allow_test_drive: car.allowTestDrive,
  });

  const fetchCars = async () => {
    try {
      const { data, error } = await supabase
        .from('cars')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const processedData = data.map(row => 
        dbRowToCar({ ...row, images: row.images || [] })
      );

      setCars(processedData);
    } catch (error: any) {
      console.error('Error fetching cars:', error);
      toast({
        title: "Error",
        description: "Failed to load cars",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();

    // Set up real-time subscription with debouncing
    const subscription = supabase
      .channel('cars_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'cars' 
        }, 
        (payload) => {
          console.log('Real-time update:', payload);
          // Update local state directly instead of refetching
          if (payload.eventType === 'INSERT') {
            setCars(prev => [dbRowToCar(payload.new), ...prev]);
          } else if (payload.eventType === 'DELETE') {
            setCars(prev => prev.filter(car => car.id !== payload.old.id));
          } else if (payload.eventType === 'UPDATE') {
            setCars(prev => prev.map(car => 
              car.id === payload.new.id ? dbRowToCar(payload.new) : car
            ));
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const addCar = async (car: Omit<Car, 'id' | 'createdAt'>) => {
    try {
      const { data, error } = await supabase
        .from('cars')
        .insert([carToDbRow(car)])
        .select()
        .single();

      if (error) throw error;

      const newCar = dbRowToCar(data);
      setCars(prev => [newCar, ...prev]);
      
      toast({
        title: "Success",
        description: "Car added successfully",
      });

      return newCar;
    } catch (error: any) {
      console.error('Error adding car:', error);
      toast({
        title: "Error",
        description: "Failed to add car",
        variant: "destructive",
      });
      throw error;
    }
  };

  const removeCar = async (id: string) => {
    try {
      const { error } = await supabase
        .from('cars')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setCars(prev => prev.filter(car => car.id !== id));
      
      toast({
        title: "Success",
        description: "Car deleted successfully",
      });
    } catch (error: any) {
      console.error('Error deleting car:', error);
      toast({
        title: "Error",
        description: "Failed to delete car",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateCar = async (id: string, updates: Partial<Car>) => {
    try {
      const { data, error } = await supabase
        .from('cars')
        .update({
          ...carToDbRow(updates as any),
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      const updatedCar = dbRowToCar(data);
      setCars(prev => prev.map(car => car.id === id ? updatedCar : car));
      
      toast({
        title: "Success",
        description: "Car updated successfully",
      });

      return updatedCar;
    } catch (error: any) {
      console.error('Error updating car:', error);
      toast({
        title: "Error",
        description: "Failed to update car",
        variant: "destructive",
      });
      throw error;
    }
  };

  const getAvailableMakes = () => {
    const availableMakes = [...new Set(cars.map(car => car.make))];
    return availableMakes;
  };

  const getAvailableModels = (make: string) => {
    const availableModels = [...new Set(
      cars.filter(car => car.make === make).map(car => car.model)
    )];
    return availableModels;
  };

  return {
    cars,
    loading,
    addCar,
    removeCar,
    updateCar,
    getAvailableMakes,
    getAvailableModels,
    refetch: fetchCars,
  };
};