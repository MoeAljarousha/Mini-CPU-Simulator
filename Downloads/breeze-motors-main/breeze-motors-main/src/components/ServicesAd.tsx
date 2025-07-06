
import React, { useState } from 'react';
import mechanicHands from '../assets/mechanic-hands.jpg';
import ServiceBookingModal from './ServiceBookingModal';

const ServicesAd = () => {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  return (
    <div className="border-t-8 border-b-8 border-black">
      <section className="w-full min-h-[80vh] bg-gradient-to-br from-green-900 via-green-500 to-blue-100 flex items-center justify-center py-20 px-5 shadow-inner">
        <div className="grid grid-cols-1 lg:grid-cols-2 max-w-7xl items-center gap-16 w-full">
          <div className="text-white font-roboto-condensed p-5">
            <h2 className="text-4xl md:text-5xl lg:text-6xl mb-8 text-black font-bold">
              Drive Smooth. Drive Confident.
            </h2>
            
            <p className="text-lg md:text-xl mb-5 leading-relaxed">
              At <strong>Breeze Motors</strong>, your safety comes first. Our certified technicians are fully trained and provincially accredited to keep your vehicle running safely and smoothly.
            </p>
            
            <p className="text-lg md:text-xl mb-5 leading-relaxed">
              Whether it's a basic oil change, new brake pads, or that strange dashboard light — we've got your back. Many of our diagnostics are completely <strong>free of charge</strong>, so you never have to pay just to find out what's wrong.
            </p>
            
            <p className="text-lg md:text-xl mb-5 leading-relaxed">
              🛠 From tire rotations to engine checks, we treat every vehicle like it's our own. No appointment? No problem. We accept walk-ins!
            </p>
            
            <p className="text-lg md:text-xl font-bold text-black mt-8 mb-6">
              Drop by today and see why Windsor drivers trust Breeze Motors for honest, affordable car care.
            </p>
            
            <button 
              onClick={() => setIsBookingModalOpen(true)}
              className="bg-gradient-to-r from-green-400 to-green-600 text-white py-4 px-8 rounded-xl text-lg font-bold transition-all duration-300 inline-block mt-6 shadow-lg hover:bg-gradient-to-r hover:from-white hover:to-gray-100 hover:text-black hover:-translate-y-1 hover:shadow-xl border-none cursor-pointer"
            >
              📅 Book Your Service Now
            </button>
          </div>
          
          <div className="text-center justify-self-center">
            <img 
              src={mechanicHands}
              alt="Professional mechanic hands working on car"
              className="w-full max-w-md h-auto rounded-3xl shadow-2xl transform -rotate-2 transition-transform duration-300 hover:rotate-0 hover:scale-105"
            />
          </div>
        </div>
        
        <ServiceBookingModal 
          isOpen={isBookingModalOpen}
          onClose={() => setIsBookingModalOpen(false)}
        />
      </section>
    </div>
  );
};

export default ServicesAd;
