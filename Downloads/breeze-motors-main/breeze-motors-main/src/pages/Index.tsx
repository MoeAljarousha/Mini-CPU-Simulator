
import React, { useState } from 'react';
import Navigation from '../components/Navigation';
import Hero from '../components/Hero';
import OptimizedCarInquiry from '../components/optimized/OptimizedCarInquiry';
import OptimizedCarInventory from '../components/optimized/OptimizedCarInventory';
import Services from '../components/Services';
import ServicesAd from '../components/ServicesAd';
import Contact from '../components/Contact';
import Location from '../components/Location';
import About from '../components/About';

const Index = () => {
  const [inventoryFilters, setInventoryFilters] = useState<{
    make: string;
    model: string;
    minYear: number;
    maxYear: number;
    priceRange: string;
  } | undefined>(undefined);

  const handleFiltersChange = (filters: {
    make: string;
    model: string;
    minYear: number;
    maxYear: number;
    priceRange: string;
  }) => {
    setInventoryFilters(filters);
  };

  const handleClearFilters = () => {
    setInventoryFilters(undefined);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />
      <Hero />
      <OptimizedCarInquiry onFiltersChange={handleFiltersChange} />
      <OptimizedCarInventory 
        appliedFilters={inventoryFilters} 
        onClearFilters={handleClearFilters} 
      />
      <Services />
      <ServicesAd />
      <Contact />
      <Location />
      <About />
      
      <footer className="bg-gradient-to-r from-black to-gray-800 text-white text-center py-10 px-5">
        <div className="footer-content">
          <p className="mb-2 opacity-90">&copy; 2025 Breeze Motors. All rights reserved.</p>
          <p className="opacity-90">Designed and developed with Phoenix 🐦‍🔥 and by Jarousha and Co. ☕</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
