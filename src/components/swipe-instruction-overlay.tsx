'use client';

import { useState, useEffect } from 'react';
import { Hand } from 'lucide-react';

interface SwipeInstructionOverlayProps {
  onDismiss: () => void;
}

const SwipeInstructionOverlay: React.FC<SwipeInstructionOverlayProps> = ({ onDismiss }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const fadeInTimer = setTimeout(() => {
      setIsVisible(true);
    }, 300);

    const dismissTimer = setTimeout(() => {
      handleDismiss();
    }, 5000);

    return () => {
      clearTimeout(fadeInTimer);
      clearTimeout(dismissTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(onDismiss, 500);
  };

  return (
    <div
      className={`absolute inset-0 z-10 bg-black/60 backdrop-blur-sm transition-opacity duration-500 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={handleDismiss}
    >
      <div className="relative w-full h-full flex items-center justify-center text-white">
        {/* Left Side Instruction */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1/2 flex flex-col items-center justify-center text-center p-4 animate-pulse">
          <div className="relative">
            <Hand className="w-10 h-10 transform -scale-x-100 animate-swipe-left" />
          </div>
          <span className="mt-2 font-semibold text-sm">Ver siguiente</span>
        </div>

        {/* Right Side Instruction */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1/2 flex flex-col items-center justify-center text-center p-4 animate-pulse">
          <div className="relative">
            <Hand className="w-10 h-10 animate-swipe-right" />
          </div>
          <span className="mt-2 font-semibold text-sm">Ver anterior</span>
        </div>
      </div>
    </div>
  );
};

export default SwipeInstructionOverlay;