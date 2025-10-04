'use client';

import { useState, useEffect } from 'react';

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
    setTimeout(onDismiss, 300);
  };

  return (
    <div
      className={`absolute inset-0 z-10 flex transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={handleDismiss}
    >
      {/* Left half - Previous */}
      <div className="w-1/2 flex flex-col items-center justify-center gap-4 bg-black/40 backdrop-blur-sm border-r-2 border-dashed border-white/30">
        <div className="text-6xl animate-pulse">👈</div>
        <p className="text-white font-semibold text-lg uppercase tracking-wide">
          Anterior
        </p>
      </div>

      {/* Right half - Next */}
      <div className="w-1/2 flex flex-col items-center justify-center gap-4 bg-black/40 backdrop-blur-sm border-l-2 border-dashed border-white/30">
        <div className="text-6xl animate-pulse">👉</div>
        <p className="text-white font-semibold text-lg uppercase tracking-wide">
          Siguiente
        </p>
      </div>
    </div>
  );
};

export default SwipeInstructionOverlay;