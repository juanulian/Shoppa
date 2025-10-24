'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, TrendingUp, Users, ShoppingCart, Eye, MousePointerClick } from 'lucide-react';
import Link from 'next/link';
import Logo from '@/components/icons/logo';

interface FunnelData {
  totalPageViews: number;
  searchStarted: number;
  onboardingStarted: number;
  onboardingCompleted: number;
  recommendationsViewed: number;
  productClicked: number;
  productDetailsViewed: number;
  startCheckout: number;
  purchaseComplete: number;
}

interface ConversionRates {
  searchConversionRate: string;
  onboardingCompletionRate: string;
  productClickRate: string;
  checkoutRate: string;
  purchaseRate: string;
  overallConversionRate: string;
}

interface Metrics {
  uniqueSessions: number;
  avgSessionTime: number;
  avgSessionTimeFormatted: string;
}

interface AnalyticsData {
  period: {
    days: number;
    since: string;
  };
  funnel: FunnelData;
  conversionRates: ConversionRates;
  metrics: Metrics;
  timeline: Array<{
    date: string;
    count: number;
  }>;
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(7);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/analytics/funnel?days=${days}`);
      const result = await response.json();
      if (result.success) {
        setData(result.data);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [days]);

  if (loading && !data) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Cargando analytics...</p>
        </div>
      </div>
    );
  }

  const funnel = data?.funnel;
  const rates = data?.conversionRates;
  const metrics = data?.metrics;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Logo />
          </Link>
          <div className="flex items-center gap-4">
            <div className="flex gap-2">
              <Button
                variant={days === 1 ? 'default' : 'outline'}
                size="sm"
                onClick={() => setDays(1)}
              >
                24h
              </Button>
              <Button
                variant={days === 7 ? 'default' : 'outline'}
                size="sm"
                onClick={() => setDays(7)}
              >
                7d
              </Button>
              <Button
                variant={days === 30 ? 'default' : 'outline'}
                size="sm"
                onClick={() => setDays(30)}
              >
                30d
              </Button>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={fetchAnalytics}
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold font-headline mb-2">Analytics Dashboard</h1>
          <p className="text-muted-foreground">
            Métricas de los últimos {days} días
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Visitas Totales</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{funnel?.totalPageViews || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Page views únicos
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sesiones Únicas</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics?.uniqueSessions || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Tiempo promedio: {metrics?.avgSessionTimeFormatted || '0m 0s'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Clicks en Productos</CardTitle>
              <MousePointerClick className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{funnel?.productClicked || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {rates?.productClickRate || 0}% de recomendaciones vistas
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Checkouts Iniciados</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{funnel?.startCheckout || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {rates?.checkoutRate || 0}% de clicks
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Funnel Visualization */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Funnel de Conversión</CardTitle>
            <CardDescription>
              Flujo completo desde visita hasta compra
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <FunnelStep
                label="Visitas a la Landing"
                count={funnel?.totalPageViews || 0}
                percentage={100}
                color="bg-blue-500"
              />
              <FunnelStep
                label="Búsquedas Iniciadas"
                count={funnel?.searchStarted || 0}
                percentage={parseFloat(rates?.searchConversionRate || '0')}
                color="bg-blue-400"
              />
              <FunnelStep
                label="Onboarding Iniciado"
                count={funnel?.onboardingStarted || 0}
                percentage={funnel?.totalPageViews ? (funnel.onboardingStarted / funnel.totalPageViews) * 100 : 0}
                color="bg-indigo-500"
              />
              <FunnelStep
                label="Onboarding Completado"
                count={funnel?.onboardingCompleted || 0}
                percentage={parseFloat(rates?.onboardingCompletionRate || '0')}
                color="bg-indigo-400"
              />
              <FunnelStep
                label="Recomendaciones Vistas"
                count={funnel?.recommendationsViewed || 0}
                percentage={funnel?.onboardingCompleted ? (funnel.recommendationsViewed / funnel.onboardingCompleted) * 100 : 0}
                color="bg-purple-500"
              />
              <FunnelStep
                label="Productos Clickeados"
                count={funnel?.productClicked || 0}
                percentage={parseFloat(rates?.productClickRate || '0')}
                color="bg-purple-400"
              />
              <FunnelStep
                label="Detalles Vistos"
                count={funnel?.productDetailsViewed || 0}
                percentage={funnel?.productClicked ? (funnel.productDetailsViewed / funnel.productClicked) * 100 : 0}
                color="bg-pink-500"
              />
              <FunnelStep
                label="Checkout Iniciado"
                count={funnel?.startCheckout || 0}
                percentage={parseFloat(rates?.checkoutRate || '0')}
                color="bg-pink-400"
              />
              <FunnelStep
                label="Compra Completada"
                count={funnel?.purchaseComplete || 0}
                percentage={parseFloat(rates?.purchaseRate || '0')}
                color="bg-green-500"
              />
            </div>

            <div className="mt-6 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Conversión General</p>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {rates?.overallConversionRate || 0}%
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                De cada 100 visitantes, {Math.round(parseFloat(rates?.overallConversionRate || '0'))} completan una compra
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Timeline */}
        {data?.timeline && data.timeline.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Actividad Diaria</CardTitle>
              <CardDescription>
                Eventos totales por día
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {data.timeline.map((day, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground w-24">
                      {new Date(day.date).toLocaleDateString('es-AR', { month: 'short', day: 'numeric' })}
                    </span>
                    <div className="flex-1 bg-slate-200 dark:bg-slate-800 rounded-full h-6 overflow-hidden">
                      <div
                        className="bg-primary h-full flex items-center justify-end pr-2"
                        style={{ width: `${Math.min((day.count / Math.max(...data.timeline.map(d => d.count))) * 100, 100)}%` }}
                      >
                        <span className="text-xs font-medium text-white">{day.count}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}

function FunnelStep({ label, count, percentage, color }: { label: string; count: number; percentage: number; color: string }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium">{label}</span>
        <span className="text-muted-foreground">
          {count} ({percentage.toFixed(1)}%)
        </span>
      </div>
      <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-3 overflow-hidden">
        <div
          className={`${color} h-full transition-all duration-500`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
    </div>
  );
}
