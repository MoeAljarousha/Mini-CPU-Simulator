
import React from 'react';

const Location = () => {
  return (
    <section id="location" className="bg-gradient-to-br from-gray-200 to-gray-400 py-20 px-5 text-center font-roboto-condensed text-black">
      <h2 className="text-4xl md:text-5xl lg:text-6xl mb-12 font-bold">Our Location</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
        {/* Map Container */}
        <div className="h-96 rounded-2xl overflow-hidden shadow-2xl">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2892.1342884739735!2d-83.03044708451064!3d42.30725387918926!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x883b2d8b4eeb6b29%3A0xbb826d43f1e59d68!2s986%20Tecumseh%20Rd%20W%2C%20Windsor%2C%20ON%20N8X%202A9!5e0!3m2!1sen!2sca!4v1681234567890!5m2!1sen!2sca"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
        
        {/* Location Description */}
        <div className="text-left text-lg leading-loose bg-white p-10 rounded-2xl shadow-xl self-center">
          <p className="mb-4"><strong>Address:</strong> 986 Tecumseh Rd W, Windsor, ON N8X 2A9</p>
          <p>We're located on the corner of Tecumseh Rd W and Crawford Ave — look for the big black and green sign in front of our spacious parking lot. Come visit us!</p>
        </div>
      </div>
    </section>
  );
};

export default Location;
