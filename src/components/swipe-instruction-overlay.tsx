'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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
    }, 4000);

    return () => {
      clearTimeout(fadeInTimer);
      clearTimeout(dismissTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(onDismiss, 300);
  };

  return (
    <div
      className={`absolute inset-0 z-10 transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={handleDismiss}
    >
      {/* Left indicator */}
      <div className="absolute left-8 top-1/2 -translate-y-1/2 animate-pulse">
        <div className="glassmorphism-strong rounded-full p-4 soft-border">
          <ChevronLeft className="w-12 h-12 text-primary" strokeWidth={1.5} />
        </div>
      </div>

      {/* Right indicator */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2 animate-pulse">
        <div className="glassmorphism-strong rounded-full p-4 soft-border">
          <ChevronRight className="w-12 h-12 text-primary" strokeWidth={1.5} />
        </div>
      </div>

      {/* Centered instruction text */}
      <div className="absolute bottom-32 left-0 right-0 flex justify-center px-4">
        <div className="glassmorphism-strong rounded-full px-8 py-3 soft-border">
          <p className="text-lg font-light text-slate-900 dark:text-white">
            Deslizá para navegar
          </p>
        </div>
      </div>
    </div>
  );
};

export default SwipeInstructionOverlay;