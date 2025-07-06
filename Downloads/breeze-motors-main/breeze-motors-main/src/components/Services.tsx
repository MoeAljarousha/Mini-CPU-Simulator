
import React from 'react';

const Services = () => {

  const services = [
    {
      title: 'Maintenance & Repairs',
      items: [
        'Oil Changes - Starting at $45',
        'Brake Pad Replacements - From $89', 
        'Tire Services - $25 per tire',
        'Battery Replacement - From $120',
        'Engine Diagnostics - $65',
        'Car Detailing - Interior & Exterior from $85',
        'Safety Inspections & Certifications',
        'General Light to Medium Repairs'
      ]
    },
    {
      title: 'Buy & Trade',
      description: "Whether you're looking to purchase your next car or trade in your current one, Breeze Motors offers fair appraisals starting at $500 and a transparent buying experience. We've helped over 2,500 customers find their perfect vehicle. We make the process simple and hassle-free with same-day approvals available."
    },
    {
      title: 'Painting & Safety Services', 
      description: "Restore your car's shine with our custom paint services starting at $299 or take care of rust before it spreads. We handle touch-ups, full-body repaints, and rust treatment to extend your vehicle's life and appearance. We also provide complete safety inspections and certifications to ensure your vehicle meets all provincial safety standards."
    }
  ];

  return (
    <div 
      id="services"
      className="bg-cover bg-center bg-fixed py-20 relative"
      style={{
        backgroundImage: 'url(https://media.istockphoto.com/id/612257332/photo/car-repair-garage.jpg?s=612x612&w=0&k=20&c=SHmKngKjlqApPOLo31p0obqq7yQ8-JtHB1jzV0_sVSA=)'
      }}
    >
      {/* Overlay */}
      <div className="absolute top-0 left-0 right-0 bottom-0 bg-black bg-opacity-60 z-10"></div>
      
      <section className="bg-white bg-opacity-96 backdrop-blur-sm py-20 px-5 text-center font-roboto-condensed relative z-20 rounded-3xl mx-5">
        <h2 className="text-4xl md:text-5xl lg:text-6xl mb-12 text-black font-bold">Our Services</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 max-w-6xl mx-auto">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-xl p-10 text-left transition-transform duration-300 hover:-translate-y-2 border-l-4 border-[#3cc421]"
            >
              <h3 className="text-2xl mb-5 text-[#3cc421] font-semibold">{service.title}</h3>
              
              {service.items ? (
                <ul className="pl-5">
                  {service.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="text-lg text-gray-700 mb-3 leading-relaxed font-medium">
                      {item}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-lg text-gray-700 leading-relaxed font-medium">{service.description}</p>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Services;
