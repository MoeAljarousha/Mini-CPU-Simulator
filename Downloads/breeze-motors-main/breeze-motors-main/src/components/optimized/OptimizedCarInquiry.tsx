import React, { useState, useMemo } from 'react';
import { useOptimizedCarData } from '../../hooks/useOptimizedCarData';
import { PRICE_RANGES, CAR_TRIMS } from '../../types/car';

interface CarInquiryProps {
  onFiltersChange?: (filters: {
    make: string;
    model: string;
    minYear: number;
    maxYear: number;
    priceRange: string;
  }) => void;
}

const OptimizedCarInquiry = ({ onFiltersChange }: CarInquiryProps) => {
  const { getAvailableMakes, getAvailableModels } = useOptimizedCarData();
  const [formData, setFormData] = useState({
    make: '',
    model: '',
    trim: '',
    year: 2010,
    priceRange: ''
  });

  // Memoize expensive computations
  const availableMakes = useMemo(() => getAvailableMakes(), [getAvailableMakes]);
  const availableModels = useMemo(() => 
    formData.make ? getAvailableModels(formData.make) : []
  , [formData.make, getAvailableModels]);

  const availableTrims = useMemo(() => {
    if (!formData.make || !formData.model) return [];
    return CAR_TRIMS[formData.make]?.[formData.model] || [];
  }, [formData.make, formData.model]);

  const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      // Reset dependent fields efficiently
      ...(name === 'make' && { model: '', trim: '' }),
      ...(name === 'model' && { trim: '' })
    }));
  };

  const scrollToInventory = () => {
    const inventorySection = document.getElementById('inventory');
    if (inventorySection) {
      inventorySection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (onFiltersChange) {
      onFiltersChange({
        make: formData.make,
        model: formData.model,
        minYear: formData.year,
        maxYear: new Date().getFullYear() + 1,
        priceRange: formData.priceRange
      });
    }
    
    scrollToInventory();
  };

  return (
    <section className="bg-gradient-to-br from-gray-100 to-gray-300 py-20 px-5 text-center font-roboto-condensed text-black">
      <h2 className="text-4xl md:text-5xl mb-10 font-bold">Find Your Perfect Car</h2>
      
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 max-w-6xl mx-auto">
        <div className="flex flex-col text-left">
          <label htmlFor="make" className="mb-2 font-bold text-gray-800 text-lg">Make:</label>
          <select
            id="make"
            name="make"
            value={formData.make}
            onChange={handleInputChange}
            className="p-4 text-base rounded-lg border-2 border-gray-300 transition-colors duration-300 focus:outline-none focus:border-[#3cc421] bg-white"
          >
            <option value="">Select Make</option>
            {availableMakes.map((make) => (
              <option key={make} value={make}>{make}</option>
            ))}
          </select>
        </div>
        
        <div className="flex flex-col text-left">
          <label htmlFor="model" className="mb-2 font-bold text-gray-800 text-lg">Model:</label>
          <select
            id="model"
            name="model"
            value={formData.model}
            onChange={handleInputChange}
            disabled={!formData.make}
            className="p-4 text-base rounded-lg border-2 border-gray-300 transition-colors duration-300 focus:outline-none focus:border-[#3cc421] bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            <option value="">Select Model</option>
            {availableModels.map((model) => (
              <option key={model} value={model}>{model}</option>
            ))}
          </select>
        </div>
        
        <div className="flex flex-col text-left">
          <label htmlFor="trim" className="mb-2 font-bold text-gray-800 text-lg">Trim:</label>
          <select
            id="trim"
            name="trim"
            value={formData.trim}
            onChange={handleInputChange}
            disabled={!formData.make || !formData.model}
            className="p-4 text-base rounded-lg border-2 border-gray-300 transition-colors duration-300 focus:outline-none focus:border-[#3cc421] bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            <option value="">Select Trim</option>
            {availableTrims.map((trim) => (
              <option key={trim} value={trim}>{trim}</option>
            ))}
          </select>
        </div>
        
        <div className="flex flex-col text-left">
          <label htmlFor="year" className="mb-2 font-bold text-gray-800 text-lg">Year:</label>
          <input
            type="number"
            id="year"
            name="year"
            value={formData.year}
            onChange={handleInputChange}
            min="2010"
            max="2040"
            className="p-4 text-base rounded-lg border-2 border-gray-300 transition-colors duration-300 focus:outline-none focus:border-[#3cc421]"
          />
        </div>
        
        <div className="flex flex-col text-left">
          <label htmlFor="priceRange" className="mb-2 font-bold text-gray-800 text-lg">Price Range:</label>
          <select
            id="priceRange"
            name="priceRange"
            value={formData.priceRange}
            onChange={handleInputChange}
            className="p-4 text-base rounded-lg border-2 border-gray-300 transition-colors duration-300 focus:outline-none focus:border-[#3cc421] bg-white"
          >
            <option value="">Select Price Range</option>
            {PRICE_RANGES.map((range) => (
              <option key={range} value={range}>{range}</option>
            ))}
          </select>
        </div>
        
        <button
          type="submit"
          className="col-span-full justify-self-center bg-gradient-to-r from-black to-gray-800 text-white border-none py-4 px-10 mt-8 text-xl cursor-pointer rounded-lg transition-all duration-300 font-roboto-condensed font-semibold hover:bg-gradient-to-r hover:from-[#3cc421] hover:to-[#2ea01c] hover:text-black hover:-translate-y-1 hover:shadow-lg"
        >
          Search Inventory
        </button>
      </form>
    </section>
  );
};

export default OptimizedCarInquiry;