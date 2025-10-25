'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Logo from '@/components/icons/logo';
import Link from 'next/link';
import { Loader2, AlertCircle } from 'lucide-react';
import { Suspense } from 'react';

function LoginForm() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      console.log('[LOGIN] Starting login process...');
      console.log('[LOGIN] Email:', email);

      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      console.log('[LOGIN] signIn result:', result);

      if (result?.error) {
        console.error('[LOGIN] Error from signIn:', result.error);
        setError('Email o contraseña incorrectos');
        setIsLoading(false);
        return;
      }

      if (!result?.ok) {
        console.error('[LOGIN] signIn not ok');
        setError('Ocurrió un error al iniciar sesión');
        setIsLoading(false);
        return;
      }

      console.log('[LOGIN] Sign in successful, verifying session...');

      // Wait and verify session cookie is set
      let sessionVerified = false;
      for (let i = 0; i < 10; i++) {
        await new Promise(resolve => setTimeout(resolve, 100));

        // Check if session cookie exists
        const hasSessionCookie = document.cookie.includes('authjs.session-token') ||
                                  document.cookie.includes('next-auth.session-token');

        console.log(`[LOGIN] Attempt ${i + 1}: Session cookie present:`, hasSessionCookie);
        console.log(`[LOGIN] Cookies:`, document.cookie);

        if (hasSessionCookie) {
          sessionVerified = true;
          console.log('[LOGIN] Session cookie verified!');
          break;
        }
      }

      if (!sessionVerified) {
        console.warn('[LOGIN] Session cookie not found after 1 second, proceeding anyway...');
      }

      // Get callback URL
      const callbackUrl = searchParams.get('callbackUrl');
      let redirectUrl = callbackUrl || (email === 'juan.ulian@shoppa.ar' ? '/admin/analytics' : '/');

      console.log('[LOGIN] Redirecting to:', redirectUrl);

      // Full page reload to ensure session is loaded
      window.location.href = redirectUrl;
    } catch (error) {
      console.error('[LOGIN] Exception during login:', error);
      setError('Ocurrió un error al iniciar sesión');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[url('/background/header_footer.png')] bg-cover bg-center flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-white/50 dark:bg-slate-950/80"></div>

      <Card className="w-full max-w-md relative z-10">
        <CardHeader className="space-y-4">
          <div className="flex justify-center">
            <Link href="/">
              <Logo />
            </Link>
          </div>
          <div className="text-center">
            <CardTitle className="text-2xl">Iniciar Sesión</CardTitle>
            <CardDescription>
              Ingresá con tu cuenta de Shoppa!
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg p-3 flex items-center gap-2 text-red-800 dark:text-red-200">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <p className="text-sm">{error}</p>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="juan@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Iniciando sesión...
                </>
              ) : (
                'Iniciar Sesión'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
