import React, { useMemo } from 'react';
import { useOptimizedCarData } from '../../hooks/useOptimizedCarData';
import { useNavigate } from 'react-router-dom';
import OptimizedCarImageCarousel from '../optimized/OptimizedCarImageCarousel';
import LoadingFallback from '../ui/loading-fallback';

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

const OptimizedCarInventory = ({ appliedFilters, onClearFilters }: CarInventoryProps) => {
  const { cars, loading, error, getFilteredCars, refreshData } = useOptimizedCarData();
  const navigate = useNavigate();

  // Memoize filtered cars to prevent recalculation on every render
  const filteredCars = useMemo(() => {
    if (!appliedFilters) return cars;
    
    return getFilteredCars({
      make: appliedFilters.make || undefined,
      model: appliedFilters.model || undefined,
      minYear: appliedFilters.minYear,
      maxYear: appliedFilters.maxYear,
      priceRange: appliedFilters.priceRange || undefined,
    });
  }, [cars, appliedFilters, getFilteredCars]);

  const hasActiveFilters = useMemo(() => {
    return appliedFilters && (
      appliedFilters.make || 
      appliedFilters.model || 
      appliedFilters.priceRange || 
      appliedFilters.minYear > 2010
    );
  }, [appliedFilters]);

  const handleCarClick = (carId: string) => {
    navigate(`/car/${carId}`);
  };

  if (error || (loading && cars.length === 0)) {
    return (
      <section id="inventory" className="py-20 px-5 bg-gradient-to-br from-gray-200 to-gray-400 font-roboto-condensed text-center text-black">
        <h2 className="text-4xl md:text-5xl mb-12 font-bold">Browse Our Inventory</h2>
        <LoadingFallback 
          error={error} 
          onRetry={refreshData}
          showPhoneNumber={true}
        />
      </section>
    );
  }

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
              <OptimizedCarImageCarousel
                images={car.images}
                alt={`${car.make} ${car.model}`}
                className="h-56"
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

export default OptimizedCarInventory;