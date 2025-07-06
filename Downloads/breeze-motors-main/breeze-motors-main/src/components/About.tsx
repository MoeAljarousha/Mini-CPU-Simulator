
import React from 'react';

const About = () => {
  return (
    <section id="about" className="bg-gradient-to-br from-white to-gray-100 py-20 px-5 text-center font-roboto-condensed text-black">
      <h2 className="text-4xl md:text-5xl lg:text-6xl mb-10 font-bold">About Us</h2>
      
      <div className="max-w-4xl mx-auto text-xl leading-relaxed bg-white p-12 rounded-2xl shadow-xl">
        <p className="mb-6">
          At Breeze Motors, we're proud to serve our local community with quality vehicles, trusted service, and straightforward values. Our team brings years of experience in the automotive industry, and we believe in making every interaction honest, easy, and pressure-free.
        </p>
        
        <p className="mb-6">
          Whether you're buying, trading, or just getting your vehicle serviced, we aim to make the process as smooth as the ride home. We value integrity, attention to detail, and above all, satisfied drivers.
        </p>
        
        <p>
          Breeze Motors isn't just a name — it's a promise to keep things simple, reliable, and built to last.
        </p>
      </div>
    </section>
  );
};

export default About;
