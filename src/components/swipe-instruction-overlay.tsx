
'use client';

import { useState, useEffect } from 'react';
import { Hand } from 'lucide-react';

interface SwipeInstructionOverlayProps {
  onDismiss: () => void;
}

const SwipeInstructionOverlay: React.FC<SwipeInstructionOverlayProps> = ({ onDismiss }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Fade in after a short delay
    const fadeInTimer = setTimeout(() => {
      setIsVisible(true);
    }, 300);

    // Automatically dismiss after a few seconds
    const dismissTimer = setTimeout(() => {
      handleDismiss();
    }, 5000); // 5 seconds

    return () => {
      clearTimeout(fadeInTimer);
      clearTimeout(dismissTimer);
    };
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    // Allow animation to finish before calling parent dismiss
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
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1/2 flex flex-col items-center justify-center text-center p-4 animate-pulse-slow">
          <div className="relative">
            <Hand className="w-10 h-10 transform -scale-x-100" />
            <div className="absolute inset-0 animate-swipe-left">
              <Hand className="w-10 h-10 transform -scale-x-100" style={{ animationDelay: '0.1s' }}/>
            </div>
          </div>
          <span className="mt-2 font-semibold text-sm">Ver siguiente</span>
        </div>

        {/* Right Side Instruction */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1/2 flex flex-col items-center justify-center text-center p-4 animate-pulse-slow">
           <div className="relative">
             <Hand className="w-10 h-10" />
            <div className="absolute inset-0 animate-swipe-right">
              <Hand className="w-10 h-10" style={{ animationDelay: '0.1s' }}/>
            </div>
          </div>
          <span className="mt-2 font-semibold text-sm">Ver anterior</span>
        </div>
      </div>
      <style jsx>{`
        @keyframes swipe-left {
          0% { transform: translateX(0); opacity: 1; }
          50% { transform: translateX(-20px); opacity: 0; }
          100% { transform: translateX(0); opacity: 0; }
        }
        .animate-swipe-left {
          animation: swipe-left 1.5s ease-in-out infinite;
        }
        @keyframes swipe-right {
          0% { transform: translateX(0); opacity: 1; }
          50% { transform: translateX(20px); opacity: 0; }
          100% { transform: translateX(0); opacity: 0; }
        }
        .animate-swipe-right {
          animation: swipe-right 1.5s ease-in-out infinite;
        }
        .animate-pulse-slow {
            animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        @keyframes pulse {
          50% {
            opacity: .7;
          }
        }
      `}</style>
    </div>
  );
};

export default SwipeInstructionOverlay;
