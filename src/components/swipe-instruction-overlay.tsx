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
      <div className="w-1/2 flex flex-col items-center justify-center gap-6 bg-black/50 backdrop-blur-sm border-r border-dashed border-white/40">
        <svg className="w-16 h-16 text-white animate-[swipe-left_1.5s_ease-in-out_infinite]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M13 7l-5 5 5 5M19 12H8" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <p className="text-white font-light text-base uppercase tracking-wider">
          Anterior
        </p>
      </div>

      {/* Right half - Next */}
      <div className="w-1/2 flex flex-col items-center justify-center gap-6 bg-black/50 backdrop-blur-sm border-l border-dashed border-white/40">
        <svg className="w-16 h-16 text-white animate-[swipe-right_1.5s_ease-in-out_infinite]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M11 17l5-5-5-5M5 12h11" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <p className="text-white font-light text-base uppercase tracking-wider">
          Siguiente
        </p>
      </div>
    </div>
  );
};

export default SwipeInstructionOverlay;