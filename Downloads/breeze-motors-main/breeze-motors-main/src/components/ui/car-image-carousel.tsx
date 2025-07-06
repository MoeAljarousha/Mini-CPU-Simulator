import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Image } from 'lucide-react';
import { Button } from './button';

interface CarImageCarouselProps {
  images: string[];
  alt: string;
  className?: string;
  autoScrollOnHover?: boolean;
  autoScrollInterval?: number;
  showControls?: boolean;
  aspectRatio?: string;
}

const CarImageCarousel = ({ 
  images, 
  alt, 
  className = "", 
  autoScrollOnHover = false,
  autoScrollInterval = 10000,
  showControls = true,
  aspectRatio = "aspect-video"
}: CarImageCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-scroll functionality (desktop only)
  useEffect(() => {
    if (autoScrollOnHover && isHovered && images.length > 1) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
      }, autoScrollInterval);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isHovered, autoScrollOnHover, images.length, autoScrollInterval]);

  const nextImage = (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevImage = (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  const goToImage = (index: number, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    setCurrentIndex(index);
  };

  if (images.length === 0) {
    return (
      <div className={`${aspectRatio} bg-gray-200 rounded-lg ${className}`}>
        <div className="w-full h-full flex items-center justify-center text-gray-500">
          No image available
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`relative ${aspectRatio} bg-gray-200 rounded-lg overflow-hidden group ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img
        src={images[currentIndex]}
        alt={`${alt} ${currentIndex + 1}`}
        className="w-full h-full object-cover transition-opacity duration-300"
        loading="lazy"
        onError={(e) => {
          console.error('Car image failed to load:', images[currentIndex]);
          // Don't replace with placeholder, just log the error
        }}
      />

      {showControls && images.length > 1 && (
        <>
          <Button
            variant="outline"
            size="icon"
            className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 bg-white/80 hover:bg-white border-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 md:block hidden"
            onClick={prevImage}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 bg-white/80 hover:bg-white border-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 md:block hidden"
            onClick={nextImage}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </>
      )}

      {showControls && images.length > 1 && (
        <div className="absolute top-2 right-2 bg-black/75 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 md:block hidden">
          {currentIndex + 1} / {images.length}
        </div>
      )}

      {showControls && images.length > 1 && images.length <= 5 && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 md:flex hidden">
          {images.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                index === currentIndex ? 'bg-white' : 'bg-white/50'
              }`}
              onClick={(e) => goToImage(index, e)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CarImageCarousel;