
import React from 'react';
import heroCivic from '../assets/hero-civic.jpg';

const Hero = () => {
  const handlePhoneCall = () => {
    const phoneNumber = '5199710000';
    
    console.log('Phone button clicked');
    console.log('User agent:', navigator.userAgent);
    
    // Try multiple approaches for mobile calling
    try {
      // Method 1: Direct tel link
      console.log('Trying tel: link');
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

  const scrollToInventory = () => {
    const inventorySection = document.getElementById('inventory');
    if (inventorySection) {
      inventorySection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative w-full h-[70vh] min-h-[400px] bg-cover bg-center bg-fixed flex items-center justify-center"
         style={{
           backgroundImage: `url(${heroCivic})`
         }}>
      
      {/* Overlay */}
      <div className="absolute top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 z-10"></div>
      
      {/* Caption */}
      <div className="absolute top-12 left-12 text-white text-2xl md:text-3xl lg:text-4xl italic z-20"
           style={{ 
             fontFamily: 'Cormorant Garamond, serif',
             textShadow: '2px 2px 8px rgba(0, 0, 0, 0.8)'
           }}>
        Windsor's drive starts here.
      </div>
      
      {/* Phone Button - Desktop (absolute positioned) */}
      <button 
        onClick={handlePhoneCall}
        className="hidden md:block absolute top-12 right-12 text-white text-lg md:text-xl lg:text-2xl font-roboto-condensed font-semibold bg-black bg-opacity-70 px-5 py-3 rounded-lg border-none cursor-pointer transition-all duration-300 z-20 hover:bg-[#3cc421] hover:text-black hover:-translate-y-1"
        style={{ textShadow: '2px 2px 8px rgba(0, 0, 0, 0.8)' }}
      >
        (519) 971-0000
      </button>
      
      {/* Center Advertisement */}
      <div className="text-center z-20 text-white max-w-2xl px-6">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 font-roboto-condensed"
            style={{ textShadow: '3px 3px 10px rgba(0, 0, 0, 0.8)' }}>
          QUALITY CARS
        </h1>
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold mb-8"
            style={{ textShadow: '2px 2px 8px rgba(0, 0, 0, 0.8)' }}>
          Starting from $5,000
        </h2>
        
        {/* Mobile Phone Button - Below content */}
        <button 
          onClick={handlePhoneCall}
          className="md:hidden bg-black bg-opacity-70 text-white text-lg font-roboto-condensed font-semibold px-6 py-3 rounded-lg mb-4 transition-all duration-300 hover:bg-[#3cc421] hover:text-black"
          style={{ textShadow: '2px 2px 8px rgba(0, 0, 0, 0.8)' }}
        >
          📞 Call (519) 971-0000
        </button>
        
        <button
          onClick={scrollToInventory}
          className="bg-gradient-to-r from-[#3cc421] to-[#2ea01c] text-black py-4 px-8 text-xl font-bold rounded-lg transition-all duration-300 font-roboto-condensed hover:from-white hover:to-gray-100 hover:-translate-y-1 hover:shadow-2xl"
        >
          VIEW INVENTORY
        </button>
      </div>
    </div>
  );
};

export default Hero;
