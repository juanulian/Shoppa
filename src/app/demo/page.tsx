
'use client';

import { useState, Suspense } from 'react';
import Onboarding from '@/components/onboarding';
import MainApp from '@/components/main-app';
import Logo from '@/components/icons/logo';

export type AppState = 'onboarding' | 'search';

export default function DemoPage() {
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
    <div className="relative min-h-screen w-full overflow-hidden bg-[url('/background/botones.jpg')] bg-cover bg-center">
       <div className="absolute inset-0 bg-white/50 dark:bg-slate-950/80"></div>
      <main className="flex flex-col items-center justify-center p-4 md:p-8 min-h-screen">
        <div className="absolute top-4 left-4 md:top-8 md:left-8 z-10 animate-in fade-in duration-1000">
          <Logo />
        </div>

        <div className={`w-full max-w-2xl mx-auto z-10 ${appState === 'search' ? 'pt-16 md:pt-0' : ''}`}>
          {appState === 'onboarding' && (
            <div className="animate-in fade-in-0 zoom-in-95 duration-500">
              <Suspense fallback={<div className="text-center p-8">Cargando...</div>}>
                <Onboarding onComplete={handleOnboardingComplete} />
              </Suspense>
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
