'use client';

import { useState } from 'react';
import Onboarding from '@/components/onboarding';
import MainApp from '@/components/main-app';
import Logo from '@/components/icons/logo';

export type AppState = 'onboarding' | 'search';

export default function Home() {
  const [appState, setAppState] = useState<AppState>('onboarding');
  const [userProfile, setUserProfile] = useState<string | null>(null);
  const [initialSearch, setInitialSearch] = useState<string | undefined>(undefined);

  const handleOnboardingComplete = (profileData: string, initialSearchQuery?: string) => {
    setUserProfile(profileData);
    if(initialSearchQuery) {
        setInitialSearch(initialSearchQuery);
    }
    setAppState('search');
  };
  
  const handleNewSearch = () => {
    setAppState('onboarding');
    setUserProfile(null);
    setInitialSearch(undefined);
  }

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-br from-purple-200 via-blue-200 to-teal-200 dark:from-purple-900 dark:via-blue-950 dark:to-teal-950 overflow-hidden">
       <div className="absolute inset-0 bg-grid-slate-900/[0.04] bg-[bottom_1px_center] dark:bg-grid-slate-400/[0.05] dark:bg-bottom mask-image-gradient"></div>
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
              <MainApp userProfileData={userProfile} onNewSearch={handleNewSearch} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
