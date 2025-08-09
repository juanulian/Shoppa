'use client';

import { useState } from 'react';
import Onboarding from '@/components/onboarding';
import MainApp from '@/components/main-app';
import Logo from '@/components/icons/logo';

export type AppState = 'onboarding' | 'search';

export default function Home() {
  const [appState, setAppState] = useState<AppState>('onboarding');
  const [userProfile, setUserProfile] = useState<string | null>(null);

  const handleOnboardingComplete = (profileData: string) => {
    setUserProfile(profileData);
    setAppState('search');
  };

  return (
    <div className="relative min-h-screen w-full bg-background overflow-hidden">
      <main className="flex flex-col items-center justify-center p-4 md:p-8 min-h-screen">
        <div className="absolute top-8 left-8 z-10 animate-in fade-in duration-1000">
          <Logo />
        </div>

        <div className="w-full max-w-2xl mx-auto z-10">
          {appState === 'onboarding' && (
            <div className="animate-in fade-in-0 zoom-in-95 duration-500">
              <Onboarding onComplete={handleOnboardingComplete} />
            </div>
          )}
          {appState === 'search' && userProfile !== null && (
            <div className="animate-in fade-in-0 zoom-in-95 duration-500 w-full">
              <MainApp userProfileData={userProfile} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
