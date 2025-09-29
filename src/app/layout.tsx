import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';

export const metadata: Metadata = {
  title: 'Shoppa!',
  description: 'Tu asistente de compras inteligente.',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-slate-900 dark:via-purple-900 dark:to-blue-900 min-h-screen">
        <div className="fixed inset-0 bg-gradient-to-br from-blue-100/30 via-purple-100/20 to-pink-100/30 dark:from-blue-900/30 dark:via-purple-900/20 dark:to-pink-900/30 pointer-events-none"></div>
        <div className="relative z-10">
          {children}
        </div>
        <Toaster />
      </body>
    </html>
  );
}
