import { auth, signOut } from '@/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, Package, Tag, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

async function SignOutButton() {
  async function handleSignOut() {
    'use server';
    await signOut({ redirectTo: '/' });
  }

  return (
    <form action={handleSignOut}>
      <Button
        type="submit"
        variant="ghost"
        size="sm"
        className="w-full justify-start gap-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100"
      >
        <LogOut className="h-4 w-4" />
        Cerrar sesión
      </Button>
    </form>
  );
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect('/login?callbackUrl=/admin');
  }

  if (session.user.role !== 'ADMIN') {
    redirect('/');
  }

  const userEmail = session.user.email || 'Admin';

  return (
    <div className="min-h-screen bg-[url('/background/cards.png')] bg-cover bg-center">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-white/95 backdrop-blur-sm border-r border-slate-200 p-6 z-50">
        <div className="mb-8">
          <Link href="/" className="block">
            <h1 className="text-2xl font-bold text-primary">Shoppa!</h1>
            <p className="text-sm text-slate-600 mt-1">Panel Admin</p>
          </Link>
        </div>

        <nav className="space-y-2">
          <Link
            href="/admin/analytics"
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
          >
            <LayoutDashboard className="h-4 w-4" />
            Analytics
          </Link>
          <Link
            href="/admin/products"
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
          >
            <Package className="h-4 w-4" />
            Productos
          </Link>
          <Link
            href="/admin/categories"
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
          >
            <Tag className="h-4 w-4" />
            Categorías
          </Link>
        </nav>

        <div className="absolute bottom-6 left-6 right-6">
          <div className="border-t border-slate-200 pt-4">
            <p className="text-xs text-slate-600 mb-3 truncate" title={userEmail}>
              {userEmail}
            </p>
            <SignOutButton />
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="ml-64">
        {children}
      </main>
    </div>
  );
}
