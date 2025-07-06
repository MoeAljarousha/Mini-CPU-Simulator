
import React, { useState } from 'react';

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const menuItems = [
    { name: 'Our Cars', href: '#inventory' },
    { name: 'Services', href: '#services' },
    { name: 'My Appointments', href: '/customer-portal' },
    { name: 'Contact Us', href: '#contact' },
    { name: 'Location', href: '#location' },
    { name: 'About Us', href: '#about' }
  ];

  return (
    <>
      <div className="bg-black w-full m-0 p-0 relative">
        <div className="flex justify-between items-center px-5 py-5 max-w-6xl mx-auto">
          <h1 className="m-0 font-bold text-4xl md:text-6xl lg:text-8xl text-blue-100 flex-1 text-center font-roboto-condensed"
              style={{
                textShadow: `1px 1px 0 #3cc421, 2px 2px 0 #3cc421, 3px 3px 0 #3cc421, 
                           4px 4px 0 #3cc421, 5px 5px 0 #3cc421, 6px 6px 0 #3cc421, 7px 7px 0 #3cc421`
              }}>
            BREEZE&nbsp;&nbsp;&nbsp;MOTORS
          </h1>
          
          <button
            onClick={toggleMenu}
            className="bg-transparent border-none text-blue-100 text-4xl md:text-5xl lg:text-6xl cursor-pointer p-2 transition-colors duration-300 hover:text-[#3cc421] min-w-[60px]"
          >
            &#9776;
          </button>
        </div>
      </div>

      {/* Dropdown Menu */}
      <div className={`fixed top-0 left-0 w-full h-screen bg-black bg-opacity-95 backdrop-blur-sm text-white flex flex-col justify-center items-center z-50 transition-all duration-400 ${
        isMenuOpen ? 'opacity-100 pointer-events-auto transform-none' : 'opacity-0 pointer-events-none -translate-y-full'
      }`}>
        <button
          onClick={toggleMenu}
          className="absolute top-8 right-8 bg-transparent border-none text-blue-100 text-4xl md:text-5xl lg:text-6xl cursor-pointer p-2 transition-colors duration-300 hover:text-[#3cc421]"
        >
          ✕
        </button>
        
        {menuItems.map((item, index) => (
          <a
            key={index}
            href={item.href}
            onClick={toggleMenu}
            className="py-5 text-white text-2xl md:text-3xl lg:text-4xl no-underline transition-all duration-300 font-roboto-condensed border-b border-white border-opacity-10 w-full max-w-md text-center hover:bg-[#3cc421] hover:text-black hover:scale-105"
          >
            {item.name}
          </a>
        ))}
      </div>
    </>
  );
};

export default Navigation;
