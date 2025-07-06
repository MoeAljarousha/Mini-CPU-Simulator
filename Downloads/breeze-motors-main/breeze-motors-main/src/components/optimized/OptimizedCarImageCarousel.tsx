import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../ui/button';

interface OptimizedCarImageCarouselProps {
  images: string[];
  alt: string;
  className?: string;
  aspectRatio?: string;
}

const OptimizedCarImageCarousel = ({ 
  images, 
  alt, 
  className = "", 
  aspectRatio = "aspect-video"
}: OptimizedCarImageCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

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
    <div className={`relative ${aspectRatio} bg-gray-200 rounded-lg overflow-hidden group ${className}`}>
      <img
        src={images[currentIndex]}
        alt={`${alt} ${currentIndex + 1}`}
        className="w-full h-full object-cover"
        loading="lazy"
        decoding="async"
      />

      {images.length > 1 && (
        <>
          <Button
            variant="outline"
            size="icon"
            className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 bg-white/80 hover:bg-white border-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 md:block hidden"
            onClick={prevImage}
            type="button"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 bg-white/80 hover:bg-white border-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 md:block hidden"
            onClick={nextImage}
            type="button"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>

          <div className="absolute top-2 right-2 bg-black/75 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 md:block hidden">
            {currentIndex + 1} / {images.length}
          </div>

          {images.length <= 5 && (
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 md:flex hidden">
              {images.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                    index === currentIndex ? 'bg-white' : 'bg-white/50'
                  }`}
                  onClick={(e) => goToImage(index, e)}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default OptimizedCarImageCarousel;