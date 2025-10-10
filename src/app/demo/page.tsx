
'use client';

import { useState, Suspense, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import OnboardingNew from '@/components/onboarding-new';
import MainApp from '@/components/main-app';
import Logo from '@/components/icons/logo';
import Link from 'next/link';
import { analyzeQuery, type QueryAnalysisOutput } from '@/ai/flows/query-analysis';
import { Loader2 } from 'lucide-react';

export type AppState = 'analyzing' | 'onboarding' | 'search';

function DemoPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get('q') || '';

  const [appState, setAppState] = useState<AppState>(query ? 'analyzing' : 'onboarding');
  const [userProfile, setUserProfile] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<QueryAnalysisOutput | undefined>(undefined);

  useEffect(() => {
    if (query && appState === 'analyzing') {
      analyzeQuery({ query })
        .then((result) => {
          setAnalysis(result);
          if (result.isComplete) {
            let profileData = `Búsqueda inicial: ${query}\n\n`;
            const { brand, model, useCase, priority, budget, special } = result.detected;
            if (brand) profileData += `Marca: ${brand}\n`;
            if (model) profileData += `Modelo: ${model}\n`;
            if (useCase.length > 0) profileData += `Uso: ${useCase.join(', ')}\n`;
            if (priority.length > 0) profileData += `Prioridades: ${priority.join(', ')}\n`;
            if (budget) profileData += `Presupuesto: ${budget}\n`;
            if (special) profileData += `Especial: ${special}\n`;

            setUserProfile(profileData);
            setAppState('search');
          } else {
            setAppState('onboarding');
          }
        })
        .catch((error) => {
          console.error('Error analyzing query:', error);
          setAppState('onboarding');
        });
    } else if (!query) {
        setAppState('onboarding');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const handleOnboardingComplete = (profileData: string) => {
    setUserProfile(profileData);
    setAppState('search');
  };

  const handleNewSearch = () => {
    // Navigate to home to allow for a new search from the input
    router.push('/');
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[url('/background/botones.jpg')] bg-cover bg-center">
       <div className="absolute inset-0 bg-white/50 dark:bg-slate-950/80"></div>
      <main className="flex flex-col items-center justify-center p-4 md:p-8 min-h-screen">
        <div className="absolute top-4 left-4 md:top-8 md:left-8 z-10 animate-in fade-in duration-1000">
          <Link href="/" aria-label="Shoppa! - Volver al inicio">
            <Logo />
          </Link>
        </div>

        <div className={`w-full max-w-2xl mx-auto z-10 ${appState === 'search' ? 'pt-16 md:pt-0' : ''}`}>
          {appState === 'analyzing' && (
            <div className="text-center p-8 glassmorphism-card rounded-3xl">
                <Loader2 className="h-12 w-12 mx-auto animate-spin text-primary mb-4" />
                <p className="text-xl text-foreground font-semibold">Analizando tu búsqueda...</p>
                <p className="text-muted-foreground mt-2">"{query}"</p>
            </div>
          )}
          {appState === 'onboarding' && (
            <div className="animate-in fade-in-0 zoom-in-95 duration-500">
                <OnboardingNew
                  onComplete={handleOnboardingComplete}
                  initialQuery={query}
                  analysis={analysis}
                />
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


export default function DemoPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        }>
            <DemoPageContent />
        </Suspense>
    )
}
