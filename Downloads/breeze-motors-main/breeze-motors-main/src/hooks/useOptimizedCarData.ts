import { useState, useEffect, useMemo, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Car } from '@/types/car';
import { toast } from '@/hooks/use-toast';

interface CarFilters {
  make?: string;
  model?: string;
  minYear?: number;
  maxYear?: number;
  priceRange?: string;
}

// Cache for car data to prevent unnecessary refetches
let carDataCache: {
  data: Car[];
  timestamp: number;
  ttl: number;
} | null = null;

const CACHE_TTL = 2 * 60 * 1000; // 2 minutes cache (shorter for faster updates)

export const useOptimizedCarData = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Convert database row to Car type (memoized)
  const dbRowToCar = useCallback((row: any): Car => ({
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
    images: row.images || [],
    features: row.features || '',
    trim: row.trim,
    allowTestDrive: row.allow_test_drive,
    createdAt: row.created_at,
  }), []);

  // Emergency optimized fetch with timeout and error handling
  const fetchCars = useCallback(async () => {
    try {
      setError(null);
      
      // Check cache first
      if (carDataCache && Date.now() - carDataCache.timestamp < carDataCache.ttl) {
        setCars(carDataCache.data);
        setLoading(false);
        return;
      }

      // Simple fetch with timeout - no Promise.race complexity
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      try {
        const { data, error } = await supabase
          .from('cars')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(50)
          .abortSignal(controller.signal);

        clearTimeout(timeoutId);

        if (error) throw error;

        const processedData = data.map(row => dbRowToCar(row));
        
        // Update cache
        carDataCache = {
          data: processedData,
          timestamp: Date.now(),
          ttl: CACHE_TTL
        };

        setCars(processedData);
      } catch (abortError) {
        clearTimeout(timeoutId);
        throw abortError;
      }
    } catch (error: any) {
      console.error('Error fetching cars:', error);
      
      // Emergency fallback for timeout errors
      if (error?.name === 'AbortError' || error?.message?.includes('timeout') || error?.code === '57014') {
        const emergencyData: Car[] = [{
          id: 'emergency-1',
          make: 'Service',
          model: 'Notice',
          year: 2024,
          price: 0,
          priceRange: 'Contact Us',
          mileage: 0,
          fuelType: 'Various',
          condition: 'Available',
          engine: 'Various',
          transmission: 'Various',
          drivetrain: 'Various',
          exteriorColor: 'Various',
          interiorColor: 'Various',
          stockNumber: 'TEMP',
          vin: 'TEMP',
          images: ['https://via.placeholder.com/400x300?text=Call+519-971-0000'],
          features: 'We are currently updating our inventory system. Please call us at (519) 971-0000 for our current vehicle selection and availability.',
          trim: 'Base',
          allowTestDrive: false,
          createdAt: new Date().toISOString(),
        }];
        
        setCars(emergencyData);
        setError('Inventory system temporarily updating. Please call (519) 971-0000.');
      } else {
        setError('Failed to load vehicles');
      }
      
      toast({
        title: "Service Notice",
        description: "Our inventory system is being updated. Please call (519) 971-0000 for current vehicle availability.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [dbRowToCar]);

  useEffect(() => {
    fetchCars();
  }, [fetchCars]);

  // Memoized derived data
  const availableMakes = useMemo(() => {
    return Array.from(new Set(cars.map(car => car.make))).sort();
  }, [cars]);

  const availableModels = useMemo(() => {
    const modelsByMake: Record<string, string[]> = {};
    cars.forEach(car => {
      if (!modelsByMake[car.make]) {
        modelsByMake[car.make] = [];
      }
      if (!modelsByMake[car.make].includes(car.model)) {
        modelsByMake[car.make].push(car.model);
      }
    });
    
    // Sort models for each make
    Object.keys(modelsByMake).forEach(make => {
      modelsByMake[make].sort();
    });
    
    return modelsByMake;
  }, [cars]);

  // Optimized filtering function
  const getFilteredCars = useCallback((filters: CarFilters) => {
    if (!filters || Object.keys(filters).length === 0) {
      return cars;
    }

    return cars.filter(car => {
      if (filters.make && car.make !== filters.make) return false;
      if (filters.model && car.model !== filters.model) return false;
      if (filters.minYear && car.year < filters.minYear) return false;
      if (filters.maxYear && car.year > filters.maxYear) return false;
      
      if (filters.priceRange) {
        const priceRangeMap: Record<string, { min: number; max: number }> = {
          'Under $5,000': { min: 0, max: 4999 },
          '$5,000 - $10,000': { min: 5000, max: 10000 },
          '$10,000 - $15,000': { min: 10000, max: 15000 },
          '$15,000 - $20,000': { min: 15000, max: 20000 },
          '$20,000 - $25,000': { min: 20000, max: 25000 },
          '$25,000 - $30,000': { min: 25000, max: 30000 },
          '$30,000 - $35,000': { min: 30000, max: 35000 },
          'Over $35,000': { min: 35001, max: Infinity }
        };
        
        const range = priceRangeMap[filters.priceRange];
        if (range && (car.price < range.min || car.price > range.max)) {
          return false;
        }
      }
      
      return true;
    });
  }, [cars]);

  // Helper functions
  const getAvailableMakes = useCallback(() => availableMakes, [availableMakes]);
  
  const getAvailableModels = useCallback((make: string) => {
    return availableModels[make] || [];
  }, [availableModels]);

  // Admin functions (simplified without real-time subscriptions)
  const addCar = useCallback(async (car: Omit<Car, 'id' | 'createdAt'>) => {
    try {
      const carData = {
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
      };

      const { data, error } = await supabase
        .from('cars')
        .insert([carData])
        .select()
        .single();

      if (error) throw error;

      const newCar = dbRowToCar(data);
      setCars(prev => [newCar, ...prev]);
      
      // Invalidate cache
      carDataCache = null;
      
      toast({
        title: "Success",
        description: "Vehicle added successfully",
      });

      return newCar;
    } catch (error: any) {
      console.error('Error adding car:', error);
      toast({
        title: "Error",
        description: "Failed to add vehicle",
        variant: "destructive",
      });
      throw error;
    }
  }, [dbRowToCar]);

  const removeCar = useCallback(async (id: string) => {
    try {
      const { error } = await supabase
        .from('cars')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setCars(prev => prev.filter(car => car.id !== id));
      
      // Invalidate cache
      carDataCache = null;
      
      toast({
        title: "Success",
        description: "Vehicle deleted successfully",
      });
    } catch (error: any) {
      console.error('Error deleting car:', error);
      toast({
        title: "Error",
        description: "Failed to delete vehicle",
        variant: "destructive",
      });
      throw error;
    }
  }, []);

  const updateCar = useCallback(async (id: string, updates: Partial<Car>) => {
    try {
      const updateData = {
        make: updates.make,
        model: updates.model,
        year: updates.year,
        price: updates.price,
        price_range: updates.priceRange,
        mileage: updates.mileage,
        fuel_type: updates.fuelType,
        condition: updates.condition,
        engine: updates.engine,
        transmission: updates.transmission,
        drivetrain: updates.drivetrain,
        exterior_color: updates.exteriorColor,
        interior_color: updates.interiorColor,
        stock_number: updates.stockNumber,
        vin: updates.vin,
        images: updates.images,
        features: updates.features,
        trim: updates.trim,
        allow_test_drive: updates.allowTestDrive,
        updated_at: new Date().toISOString(),
      };

      // Remove undefined values
      Object.keys(updateData).forEach(key => {
        if (updateData[key as keyof typeof updateData] === undefined) {
          delete updateData[key as keyof typeof updateData];
        }
      });

      const { data, error } = await supabase
        .from('cars')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      const updatedCar = dbRowToCar(data);
      setCars(prev => prev.map(car => car.id === id ? updatedCar : car));
      
      // Invalidate cache
      carDataCache = null;
      
      toast({
        title: "Success",
        description: "Vehicle updated successfully",
      });

      return updatedCar;
    } catch (error: any) {
      console.error('Error updating car:', error);
      toast({
        title: "Error",
        description: "Failed to update vehicle",
        variant: "destructive",
      });
      throw error;
    }
  }, [dbRowToCar]);

  const refreshData = useCallback(() => {
    carDataCache = null;
    fetchCars();
  }, [fetchCars]);

  return {
    cars,
    loading,
    error,
    availableMakes,
    availableModels,
    getFilteredCars,
    getAvailableMakes,
    getAvailableModels,
    addCar,
    removeCar,
    updateCar,
    refreshData,
  };
};