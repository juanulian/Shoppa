'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RefreshCw, TrendingUp, Users, ShoppingCart, Eye, MousePointerClick, Package, LogOut } from 'lucide-react';
import Link from 'next/link';
import Logo from '@/components/icons/logo';
import { auth, signOut } from '@/auth';

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

interface ProductAnalytics {
  topClicked: Array<{
    productId: string;
    productName: string;
    price: string;
    clicks: number;
    checkouts: number;
    conversionRate: string;
  }>;
  topViewed: Array<{
    productId: string;
    productName: string;
    price: string;
    matchPercentage?: number;
    views: number;
  }>;
  topCheckout: Array<{
    productId: string;
    productName: string;
    price: string;
    checkouts: number;
  }>;
  topRecommended: Array<{
    productId: string;
    productName: string;
    position?: number;
    generationTime?: number;
    timesRecommended: number;
  }>;
}

interface Vendor {
  id: string;
  name: string;
  eventCount: number;
}

function AnalyticsContent({ userEmail }: { userEmail: string }) {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [productData, setProductData] = useState<ProductAnalytics | null>(null);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(7);
  const [customDateMode, setCustomDateMode] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedVendor, setSelectedVendor] = useState<string>('');

  const handleSignOut = async () => {
    await signOut({ redirectTo: '/' });
  };

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      let funnelUrl = '';
      let productsUrl = '';

      // Construir parámetros base
      const params = new URLSearchParams();

      if (customDateMode && startDate && endDate) {
        params.append('startDate', startDate);
        params.append('endDate', endDate);
      } else {
        params.append('days', days.toString());
      }

      if (selectedVendor) {
        params.append('sellerId', selectedVendor);
      }

      funnelUrl = `/api/analytics/funnel?${params.toString()}`;
      productsUrl = `/api/analytics/products?${params.toString()}`;

      const [funnelResponse, productsResponse] = await Promise.all([
        fetch(funnelUrl),
        fetch(productsUrl),
      ]);

      const [funnelResult, productsResult] = await Promise.all([
        funnelResponse.json(),
        productsResponse.json(),
      ]);

      if (funnelResult.success) {
        setData(funnelResult.data);
      }
      if (productsResult.success) {
        setProductData(productsResult.data);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchVendors = async () => {
    try {
      const response = await fetch('/api/analytics/vendors');
      const result = await response.json();
      if (result.success) {
        setVendors(result.data.vendors);
      }
    } catch (error) {
      console.error('Error fetching vendors:', error);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  useEffect(() => {
    fetchAnalytics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [days, customDateMode, startDate, endDate, selectedVendor]);

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
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <Link href="/" className="flex items-center gap-2">
              <Logo />
            </Link>
            <div className="flex items-center gap-4">
              <div className="text-sm text-muted-foreground hidden sm:block">
                {userEmail}
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={fetchAnalytics}
                disabled={loading}
                title="Refrescar datos"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
                className="gap-2"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Salir</span>
              </Button>
            </div>
          </div>

          {/* Date Filters */}
          <div className="flex flex-wrap items-end gap-4">
            <div className="flex gap-2">
              <Button
                variant={!customDateMode && days === 1 ? 'default' : 'outline'}
                size="sm"
                onClick={() => {
                  setCustomDateMode(false);
                  setDays(1);
                }}
              >
                24h
              </Button>
              <Button
                variant={!customDateMode && days === 7 ? 'default' : 'outline'}
                size="sm"
                onClick={() => {
                  setCustomDateMode(false);
                  setDays(7);
                }}
              >
                7d
              </Button>
              <Button
                variant={!customDateMode && days === 30 ? 'default' : 'outline'}
                size="sm"
                onClick={() => {
                  setCustomDateMode(false);
                  setDays(30);
                }}
              >
                30d
              </Button>
              <Button
                variant={!customDateMode && days === 90 ? 'default' : 'outline'}
                size="sm"
                onClick={() => {
                  setCustomDateMode(false);
                  setDays(90);
                }}
              >
                90d
              </Button>
            </div>

            <div className="flex-1 min-w-[300px]">
              <div className="flex items-end gap-2">
                <div className="flex-1">
                  <Label htmlFor="startDate" className="text-xs mb-1 block">Desde</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={startDate}
                    onChange={(e) => {
                      setStartDate(e.target.value);
                      if (e.target.value && endDate) setCustomDateMode(true);
                    }}
                    className="h-9"
                  />
                </div>
                <div className="flex-1">
                  <Label htmlFor="endDate" className="text-xs mb-1 block">Hasta</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={endDate}
                    onChange={(e) => {
                      setEndDate(e.target.value);
                      if (startDate && e.target.value) setCustomDateMode(true);
                    }}
                    className="h-9"
                  />
                </div>
                {customDateMode && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setCustomDateMode(false);
                      setStartDate('');
                      setEndDate('');
                    }}
                  >
                    Limpiar
                  </Button>
                )}
              </div>
            </div>

            {/* Vendor Filter */}
            {vendors.length > 0 && (
              <div className="min-w-[200px]">
                <Label htmlFor="vendor" className="text-xs mb-1 block">Vendedor</Label>
                <select
                  id="vendor"
                  value={selectedVendor}
                  onChange={(e) => setSelectedVendor(e.target.value)}
                  className="h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  <option value="">Todos los vendedores</option>
                  {vendors.map((vendor) => (
                    <option key={vendor.id} value={vendor.id}>
                      {vendor.name} ({vendor.eventCount})
                    </option>
                  ))}
                </select>
              </div>
            )}
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

        {/* Product Analytics */}
        {productData && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Top Clicked Products */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MousePointerClick className="h-5 w-5" />
                  Productos Más Clickeados
                </CardTitle>
                <CardDescription>
                  Con tasa de conversión a checkout
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {productData.topClicked.slice(0, 10).map((product, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{product.productName}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-muted-foreground">{product.price}</span>
                          <span className="text-xs text-muted-foreground">•</span>
                          <span className="text-xs font-medium text-primary">{product.clicks} clicks</span>
                        </div>
                      </div>
                      <div className="text-right ml-4">
                        <p className="text-sm font-bold text-green-600 dark:text-green-400">
                          {product.conversionRate}%
                        </p>
                        <p className="text-xs text-muted-foreground">{product.checkouts} checkouts</p>
                      </div>
                    </div>
                  ))}
                  {productData.topClicked.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-8">
                      No hay datos de productos clickeados
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Top Viewed Products */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Detalles Más Vistos
                </CardTitle>
                <CardDescription>
                  Productos con más vistas de detalles
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {productData.topViewed.slice(0, 10).map((product, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{product.productName}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-muted-foreground">{product.price}</span>
                          {product.matchPercentage && (
                            <>
                              <span className="text-xs text-muted-foreground">•</span>
                              <span className="text-xs text-purple-600 dark:text-purple-400">
                                {product.matchPercentage}% match
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="text-right ml-4">
                        <p className="text-sm font-bold">{product.views}</p>
                        <p className="text-xs text-muted-foreground">vistas</p>
                      </div>
                    </div>
                  ))}
                  {productData.topViewed.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-8">
                      No hay datos de detalles vistos
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Top Checkout Products */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  Más Llegados a Checkout
                </CardTitle>
                <CardDescription>
                  Productos con más intención de compra
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {productData.topCheckout.slice(0, 10).map((product, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{product.productName}</p>
                        <span className="text-xs text-muted-foreground">{product.price}</span>
                      </div>
                      <div className="text-right ml-4">
                        <p className="text-sm font-bold text-orange-600 dark:text-orange-400">
                          {product.checkouts}
                        </p>
                        <p className="text-xs text-muted-foreground">checkouts</p>
                      </div>
                    </div>
                  ))}
                  {productData.topCheckout.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-8">
                      No hay datos de checkouts
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Top Recommended Products */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Más Recomendados por IA
                </CardTitle>
                <CardDescription>
                  Productos que el AI recomienda más frecuentemente
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {productData.topRecommended.slice(0, 10).map((product, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{product.productName}</p>
                        {product.generationTime && (
                          <span className="text-xs text-muted-foreground">
                            ~{product.generationTime}s generación
                          </span>
                        )}
                      </div>
                      <div className="text-right ml-4">
                        <p className="text-sm font-bold text-blue-600 dark:text-blue-400">
                          {product.timesRecommended}
                        </p>
                        <p className="text-xs text-muted-foreground">veces</p>
                      </div>
                    </div>
                  ))}
                  {productData.topRecommended.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-8">
                      No hay datos de recomendaciones
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

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

export default async function AnalyticsPage() {
  const session = await auth();
  const userEmail = session?.user?.email || 'Admin';

  return <AnalyticsContent userEmail={userEmail} />;
}
