
import React, { useState } from 'react';
import { ChevronsLeftRight } from './Icons';

interface ImageComparatorProps {
  before: string;
  after: string;
}

export const ImageComparator: React.FC<ImageComparatorProps> = ({ before, after }) => {
  const [sliderPosition, setSliderPosition] = useState(50);

  const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSliderPosition(Number(event.target.value));
  };

  const clipPathStyle = {
    clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)`,
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto aspect-[4/3] rounded-xl overflow-hidden shadow-2xl select-none group">
      <img
        src={before}
        alt="Before"
        className="absolute inset-0 w-full h-full object-contain pointer-events-none bg-gray-100"
      />
      <div
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={clipPathStyle}
      >
        <img
          src={after}
          alt="After"
          className="absolute inset-0 w-full h-full object-contain pointer-events-none bg-gray-100"
        />
      </div>

      <div
        className="absolute top-0 bottom-0 w-1.5 bg-white/80 cursor-ew-resize pointer-events-none transition-opacity duration-300 opacity-0 group-hover:opacity-100 backdrop-blur-sm"
        style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-2 bg-white rounded-full shadow-lg">
          <ChevronsLeftRight className="w-6 h-6 text-gray-700" />
        </div>
      </div>

      <input
        type="range"
        min="0"
        max="100"
        value={sliderPosition}
        onChange={handleSliderChange}
        className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize"
        aria-label="Image comparison slider"
      />

       <div className="absolute top-4 left-4 bg-black/50 text-white text-xs font-semibold px-2 py-1 rounded-full pointer-events-none">BEFORE</div>
       <div className="absolute top-4 right-4 bg-black/50 text-white text-xs font-semibold px-2 py-1 rounded-full pointer-events-none">AFTER</div>
    </div>
  );
};
