
'use client';

import { useEffect, useState } from 'react';
import { Progress } from '@/components/ui/progress';

interface RecommendationsLoadingProps {
  userProfileData?: string;
}

const RecommendationsLoading: React.FC<RecommendationsLoadingProps> = ({
  userProfileData,
}) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Reset progress when user data changes (new search)
    setProgress(0);

    const totalDuration = 8000; // Simulate an 8-second loading process
    let startTime: number;

    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

    const animate = (time: number) => {
      if (!startTime) startTime = time;
      const elapsedTime = time - startTime;
      const progressFraction = Math.min(elapsedTime / totalDuration, 1);
      
      // Apply easing and ensure it doesn't quite hit 100% until the end
      const easedProgress = easeOutCubic(progressFraction);
      const displayProgress = Math.min(Math.floor(easedProgress * 100), 99);

      setProgress(displayProgress);

      if (progressFraction < 1) {
        requestAnimationFrame(animate);
      }
    };

    const animationFrameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrameId);
  }, [userProfileData]);

  return (
    <div className="w-full flex items-center justify-center px-4 py-8">
      <div className="glassmorphism-card rounded-3xl soft-border shadow-2xl p-10 md:p-12 max-w-md w-full text-center">
        {/* Giant S! logo with pulse */}
        <div className="mb-10">
          <h1 className="font-headline text-8xl md:text-9xl font-extrabold text-slate-900 dark:text-white animate-pulse">
            S<span className="text-primary">!</span>
          </h1>
        </div>

        {/* Loading text and percentage */}
        <div className="mb-8 h-12 flex flex-col items-center justify-center">
          <p className="text-xl md:text-2xl font-light text-slate-700 dark:text-slate-300 mb-2">
            Preparando tus 3 opciones...
          </p>
          <p className="text-lg font-mono font-bold text-primary">
            {progress}%
          </p>
        </div>

        {/* Progress bar */}
        <Progress value={progress} className="w-full h-2" />
      </div>
    </div>
  );
};

export default RecommendationsLoading;
