
import React, { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Facebook } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateEmail(formData.email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address",
        variant: "destructive"
      });
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke('send-email', {
        body: {
          type: 'contact',
          formData: formData
        }
      });

      if (error) throw error;

      toast({
        title: "Message Sent!",
        description: "We'll get back to you within 24 hours",
      });
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        message: ''
      });
    } catch (error: any) {
      console.error('Email sending error:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <section id="contact" className="bg-gradient-to-br from-gray-100 to-gray-300 py-20 px-5 font-roboto-condensed text-center text-black">
      <h2 className="text-4xl md:text-5xl lg:text-6xl mb-12 font-bold">Contact Us</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 max-w-6xl mx-auto text-left">
        {/* Contact Info */}
        <div className="text-lg leading-loose bg-white p-10 rounded-2xl shadow-xl border-l-4 border-[#3cc421]">
          <h3 className="text-2xl font-bold mb-6 text-[#3cc421]">Get in Touch</h3>
          <p className="mb-4"><strong>Address:</strong> 986 Tecumseh Rd W, Windsor, ON N8X 2A9</p>
          <p className="mb-4"><strong>Phone:</strong> (519) 971-0000</p>
          <p className="mb-4"><strong>Email:</strong> Hazem@breezemotors.ca</p>
          <p className="mb-4"><strong>Hours:</strong> Monday-Saturday 9:00 AM to 5:00 PM</p>
        </div>
        
        {/* Contact Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 bg-white p-10 rounded-2xl shadow-xl border-l-4 border-[#3cc421]">
          <h3 className="text-2xl font-bold mb-2 text-[#3cc421]">Send us a Message</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Your Name"
              required
              className="p-4 text-base border-2 border-gray-300 rounded-lg font-roboto-condensed transition-colors duration-300 focus:outline-none focus:border-[#3cc421]"
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Your Email"
              required
              className="p-4 text-base border-2 border-gray-300 rounded-lg font-roboto-condensed transition-colors duration-300 focus:outline-none focus:border-[#3cc421]"
            />
          </div>
          
          <textarea
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            rows={5}
            placeholder="Your Message"
            required
            className="p-4 text-base border-2 border-gray-300 rounded-lg font-roboto-condensed transition-colors duration-300 focus:outline-none focus:border-[#3cc421] resize-none"
          ></textarea>
          
          <button
            type="submit"
            className="self-start bg-gradient-to-r from-black to-gray-800 text-white border-none py-4 px-8 text-lg rounded-lg cursor-pointer transition-all duration-300 font-roboto-condensed font-semibold hover:bg-gradient-to-r hover:from-[#3cc421] hover:to-[#2ea01c] hover:text-black hover:-translate-y-1"
          >
            Send Message
          </button>
        </form>
      </div>
      
      {/* Facebook Button */}
      <div className="text-center mt-12">
        <a 
          href="https://www.facebook.com/profile.php?id=100047441623442"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-[#1877f2] hover:bg-[#166fe5] text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:-translate-y-1 shadow-lg"
        >
          <Facebook className="h-5 w-5" />
          Follow us on Facebook
        </a>
      </div>
    </section>
  );
};

export default Contact;
