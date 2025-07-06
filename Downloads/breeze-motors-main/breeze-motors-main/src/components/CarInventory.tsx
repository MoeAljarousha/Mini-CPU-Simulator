
import React, { useState } from 'react';
import { useCarData } from '../hooks/useCarData';
import { Car } from '../types/car';
import { useNavigate } from 'react-router-dom';
import CarImageCarousel from './ui/car-image-carousel';

interface CarInventoryProps {
  appliedFilters?: {
    make: string;
    model: string;
    minYear: number;
    maxYear: number;
    priceRange: string;
  };
  onClearFilters?: () => void;
}

const CarInventory = ({ appliedFilters, onClearFilters }: CarInventoryProps) => {
  const { cars, loading } = useCarData();
  const navigate = useNavigate();

  // Use applied filters from parent or default empty filters
  const activeFilters = appliedFilters || {
    make: '',
    model: '',
    minYear: 2010,
    maxYear: new Date().getFullYear() + 1,
    priceRange: ''
  };

  // Helper function to check if price falls within selected range
  const isPriceInRange = (price: number, priceRange: string): boolean => {
    if (!priceRange) return true;
    
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
    
    const range = priceRangeMap[priceRange];
    if (!range) return true;
    
    return price >= range.min && price <= range.max;
  };

  const filteredCars = cars.filter(car => {
    if (activeFilters.make && car.make !== activeFilters.make) return false;
    if (activeFilters.model && car.model !== activeFilters.model) return false;
    if (car.year < activeFilters.minYear || car.year > activeFilters.maxYear) return false;
    if (activeFilters.priceRange && !isPriceInRange(car.price, activeFilters.priceRange)) return false;
    return true;
  });

  const handleCarClick = (carId: string) => {
    navigate(`/car/${carId}`);
  };

  const hasActiveFilters = appliedFilters && (
    appliedFilters.make || 
    appliedFilters.model || 
    appliedFilters.priceRange || 
    appliedFilters.minYear > 2010
  );

  return (
    <section id="inventory" className="py-20 px-5 bg-gradient-to-br from-gray-200 to-gray-400 font-roboto-condensed text-center text-black">
      <h2 className="text-4xl md:text-5xl mb-12 font-bold">Browse Our Inventory</h2>
      
      {hasActiveFilters && (
        <div className="mb-8">
          <button
            onClick={onClearFilters}
            className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-300"
          >
            Remove Filters ({filteredCars.length} cars shown)
          </button>
        </div>
      )}
      
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-600 mx-auto mb-4"></div>
            <p className="text-lg text-gray-600">Loading our inventory...</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {filteredCars.map((car) => (
          <div
            key={car.id}
            onClick={() => handleCarClick(car.id)}
            className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:-translate-y-3 hover:shadow-xl cursor-pointer group"
          >
            <CarImageCarousel
              images={car.images}
              alt={`${car.make} ${car.model}`}
              className="h-56"
              autoScrollOnHover={true}
              autoScrollInterval={10000}
              aspectRatio="h-56"
            />
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-3 text-gray-800">
                {car.year} {car.make} {car.model}
              </h3>
              <div className="space-y-2">
                <p className="text-lg text-[#3cc421] font-bold">
                  ${car.price.toLocaleString()}
                </p>
                <p className="text-sm text-gray-600">
                  {car.mileage.toLocaleString()} km • {car.fuelType}
                </p>
              </div>
            </div>
          </div>
        ))}
          
          {filteredCars.length === 0 && !loading && (
            <div className="col-span-full text-center py-12">
              <h3 className="text-2xl font-semibold text-gray-600 mb-4">No cars match your criteria</h3>
              <p className="text-gray-500">Try adjusting your search filters to see more vehicles.</p>
              {hasActiveFilters && (
                <button
                  onClick={onClearFilters}
                  className="mt-4 bg-[#3cc421] hover:bg-[#2ea01c] text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-300"
                >
                  Show All Cars
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default CarInventory;
