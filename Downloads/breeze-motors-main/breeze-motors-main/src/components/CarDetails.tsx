
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCarData } from '../hooks/useCarData';
import { ArrowLeft, Calendar, Phone } from 'lucide-react';
import { Button } from './ui/button';
import OptimizedCarImageCarousel from './optimized/OptimizedCarImageCarousel';
import TestDriveModal from './TestDriveModal';

const CarDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { cars, loading } = useCarData();
  const [isTestDriveModalOpen, setIsTestDriveModalOpen] = useState(false);
  
  const car = cars.find(c => c.id === id);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg">Loading car details...</div>
        </div>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Car not found</h1>
          <Button onClick={() => navigate('/')}>Return Home</Button>
        </div>
      </div>
    );
  }

  const handleTestDrive = () => {
    if (!car.allowTestDrive) return;
    setIsTestDriveModalOpen(true);
  };

  const handleCall = () => {
    const phoneNumber = '5199710000';
    
    console.log('Car details call button clicked');
    console.log('User agent:', navigator.userAgent);
    
    // Try multiple approaches for mobile calling
    try {
      // Method 1: Direct tel link with +1 country code
      console.log('Trying tel: link with +1');
      const telLink = `tel:+1${phoneNumber}`;
      window.location.href = telLink;
    } catch (error) {
      console.error('Tel link failed:', error);
      
      // Method 2: Try opening in new window
      try {
        console.log('Trying window.open');
        window.open(`tel:+1${phoneNumber}`, '_self');
      } catch (error2) {
        console.error('Window.open failed:', error2);
        
        // Method 3: Fallback - show alert with number
        alert('Please call us at: (519) 971-0000');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate('/')}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Home
              </Button>
              <div className="h-8 w-8 bg-[#3cc421] rounded flex items-center justify-center">
                <span className="text-white font-bold text-sm">BM</span>
              </div>
            </div>
            <h1 className="text-xl font-bold text-gray-900">
              {car.year} {car.make} {car.model}
            </h1>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Images */}
          <div className="space-y-4">
            <OptimizedCarImageCarousel
              images={car.images}
              alt={`${car.make} ${car.model}`}
              className=""
              aspectRatio="aspect-video"
            />
          </div>

          {/* Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {car.year} {car.make} {car.model}
              </h1>
              <p className="text-2xl font-bold text-[#3cc421]">
                ${car.price.toLocaleString()}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 py-4 border-y">
              <div>
                <p className="text-sm text-gray-500">Condition</p>
                <p className="font-semibold">{car.condition}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Mileage</p>
                <p className="font-semibold">{car.mileage.toLocaleString()} km</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Fuel Type</p>
                <p className="font-semibold">{car.fuelType}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Engine</p>
                <p className="font-semibold">{car.engine}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Transmission</p>
                <p className="font-semibold">{car.transmission}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Drivetrain</p>
                <p className="font-semibold">{car.drivetrain}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Exterior Color</p>
                <p className="font-semibold">{car.exteriorColor}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Interior Color</p>
                <p className="font-semibold">{car.interiorColor}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Stock Number</p>
                <p className="font-semibold">{car.stockNumber}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">VIN</p>
                <p className="font-semibold">{car.vin}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Year</p>
                <p className="font-semibold">{car.year}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Price Range</p>
                <p className="font-semibold">{car.priceRange}</p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Features</h3>
              <p className="text-gray-700">{car.features}</p>
            </div>

            <div className="space-y-3">
              {car.allowTestDrive ? (
                <Button 
                  onClick={handleTestDrive}
                  className="w-full bg-[#3cc421] hover:bg-[#2ea01c] text-white"
                  size="lg"
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Book Test Drive
                </Button>
              ) : (
                <div className="w-full p-4 bg-gray-100 rounded-lg text-center text-gray-600">
                  Test drive currently unavailable for this vehicle
                </div>
              )}
              
              <Button 
                onClick={handleCall}
                variant="outline"
                className="w-full"
                size="lg"
              >
                <Phone className="h-4 w-4 mr-2" />
                Call (519) 971-0000
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-black to-gray-800 text-white text-center py-10 px-5 mt-16">
        <div className="footer-content">
          <p className="mb-2 opacity-90">&copy; 2025 Breeze Motors. All rights reserved.</p>
          <p className="opacity-90">Designed and developed with Phoenix 🐦‍🔥 and by Jarousha and Co. ☕</p>
        </div>
      </footer>
      
      <TestDriveModal 
        isOpen={isTestDriveModalOpen}
        onClose={() => setIsTestDriveModalOpen(false)}
        car={car}
      />
    </div>
  );
};

export default CarDetails;
