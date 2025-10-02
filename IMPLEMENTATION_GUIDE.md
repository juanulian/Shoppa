# Shoppa! Marketplace - Implementation Guide

Este documento contiene la guía completa de implementación de Shoppa! como marketplace propio.

## 📦 Lo que ya está implementado

### ✅ Base de Datos
- **Schema completo en Prisma** (`prisma/schema.prisma`)
  - Users & Authentication (Buyer/Seller/Admin roles)
  - Seller profiles con KYC y tiers (Basic/Premium/Enterprise)
  - Products con imágenes, videos, specs
  - Orders con estados completos
  - Reviews y sistema de reputación
  - Invoicing (AFIP ready)
  - Payouts a vendedores
  - Notifications multi-canal
  - Analytics events

### ✅ Autenticación
- Sistema completo JWT (`src/lib/auth.ts`)
- Register/Login endpoints
- Role-based access control
- Password hashing con bcrypt

### ✅ Onboarding de Vendedor
- API endpoint con validación KYC
- Formulario frontend completo
- Verificación de CUIT
- Banking info collection

### ✅ Productos - Creación
- API endpoint para crear productos
- Validación completa de datos
- Upload de imágenes/videos
- Specs flexibles en JSON
- Sistema de slugs únicos

### ✅ Utils & Helpers
- Cálculo de comisiones (5% Basic, 2.5% Premium, 1.5% Enterprise)
- Payment processing fees (3.99%)
- Validación de CUIT argentino
- Formateo de moneda ARS
- Generación de order numbers

---

## 🚧 Lo que falta implementar

### PRIORIDAD 1: CORE MARKETPLACE (Semana 1-2)

#### 1. Stripe Connect Integration
**Archivo:** `src/lib/stripe.ts`

```typescript
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

// Create Connect Account for seller
export async function createConnectAccount(sellerProfile: SellerProfile) {
  const account = await stripe.accounts.create({
    type: 'express',
    country: 'AR',
    email: sellerProfile.businessEmail,
    capabilities: {
      card_payments: { requested: true },
      transfers: { requested: true },
    },
    business_type: 'individual', // or 'company'
    business_profile: {
      name: sellerProfile.businessName,
      support_email: sellerProfile.businessEmail,
    },
  });

  return account;
}

// Generate onboarding link
export async function createAccountLink(accountId: string) {
  const accountLink = await stripe.accountLinks.create({
    account: accountId,
    refresh_url: `${process.env.NEXT_PUBLIC_APP_URL}/seller/onboarding/refresh`,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/seller/dashboard`,
    type: 'account_onboarding',
  });

  return accountLink.url;
}

// Create payment with destination charge (split payment)
export async function createPaymentIntent(
  amount: number,
  sellerAccountId: string,
  platformFee: number,
  metadata: Record<string, string>
) {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(amount * 100), // Convert to cents
    currency: 'ars',
    payment_method_types: ['card'],
    application_fee_amount: Math.round(platformFee * 100),
    transfer_data: {
      destination: sellerAccountId,
    },
    metadata,
  });

  return paymentIntent;
}
```

**Endpoint:** `src/app/api/seller/stripe/connect/route.ts`
- POST: Crear cuenta de Stripe Connect
- GET: Obtener link de onboarding
- Webhook handler para account updates

#### 2. Checkout & Payment
**Endpoint:** `src/app/api/checkout/create/route.ts`

```typescript
// Lógica:
// 1. Validar stock del producto
// 2. Calcular fees (platform + payment processing)
// 3. Crear Order en estado PENDING_PAYMENT
// 4. Crear Stripe Payment Intent con destination charge
// 5. Retornar clientSecret para frontend
```

**Endpoint:** `src/app/api/checkout/confirm/route.ts`
```typescript
// Webhook de Stripe:
// 1. Verificar payment_intent.succeeded
// 2. Actualizar Order a PAID
// 3. Reducir stock
// 4. Trigger notificaciones
```

**Frontend:** `src/components/checkout/checkout-form.tsx`
- Integración con Stripe Elements
- Selector de método de pago
- Selector de cuotas
- Opción de retiro vs envío

#### 3. Sistema de Órdenes
**Endpoints necesarios:**

`/api/orders/[orderId]/route.ts` - GET (ver orden)
`/api/orders/[orderId]/status/route.ts` - PATCH (actualizar estado)
`/api/orders/seller/route.ts` - GET (órdenes del vendedor)
`/api/orders/buyer/route.ts` - GET (órdenes del comprador)

**Estados del workflow:**
```
PENDING_PAYMENT → PAID → PREPARING → READY_FOR_PICKUP/IN_TRANSIT → DELIVERED
                                   ↓
                              CANCELLED/REFUNDED
```

**Frontend:** `src/components/orders/order-card.tsx`
- Card con info de orden
- Botones de acción según rol y estado
- Timeline de estados
- Tracking integration

#### 4. Dashboard de Vendedor
**Página:** `src/app/seller/dashboard/page.tsx`

**Métricas a mostrar:**
```typescript
interface SellerDashboardMetrics {
  // Revenue
  totalRevenue: number;
  revenueThisMonth: number;
  revenueGrowth: number; // % vs last month

  // Orders
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;

  // Products
  totalProducts: number;
  activeProducts: number;
  outOfStockProducts: number;

  // Performance
  averageRating: number;
  totalReviews: number;
  onTimeDeliveryRate: number; // %
  responseTime: number; // hours

  // Alerts
  ordersNeedingAttention: Order[]; // >48hs sin preparar
  lowStockProducts: Product[]; // stock < 5
}
```

**Components necesarios:**
- `src/components/seller/metrics-cards.tsx`
- `src/components/seller/orders-table.tsx`
- `src/components/seller/products-grid.tsx`
- `src/components/seller/alerts-panel.tsx`

#### 5. Upload de Archivos (S3/Cloudflare R2)
**Lib:** `src/lib/storage.ts`

```typescript
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const s3Client = new S3Client({
  region: process.env.S3_REGION!,
  endpoint: process.env.S3_ENDPOINT, // For Cloudflare R2
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID!,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
  },
});

export async function generatePresignedUploadUrl(
  fileName: string,
  fileType: string
): Promise<string> {
  const key = `uploads/${Date.now()}-${fileName}`;

  const command = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME!,
    Key: key,
    ContentType: fileType,
  });

  const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
  return signedUrl;
}
```

**Endpoint:** `src/app/api/upload/presigned-url/route.ts`
- Generar URL firmada para upload directo desde frontend
- Validar tipo de archivo y tamaño

**Component:** `src/components/upload/image-upload.tsx`
- Drag & drop
- Preview de imágenes
- Progress bar
- Multiple files

---

### PRIORIDAD 2: NOTIFICACIONES & COMUNICACIÓN (Semana 2-3)

#### 6. Sistema de Notificaciones
**Lib:** `src/lib/notifications.ts`

```typescript
import Resend from 'resend';
import { Twilio } from 'twilio';

const resend = new Resend(process.env.RESEND_API_KEY);
const twilio = new Twilio(
  process.env.TWILIO_ACCOUNT_SID!,
  process.env.TWILIO_AUTH_TOKEN!
);

export async function sendEmail(options: EmailOptions) {
  return resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL!,
    to: options.to,
    subject: options.subject,
    html: options.html,
  });
}

export async function sendSMS(to: string, message: string) {
  return twilio.messages.create({
    body: message,
    from: process.env.TWILIO_PHONE_NUMBER!,
    to,
  });
}

// Templates de notificaciones
export const emailTemplates = {
  orderConfirmed: (order: Order) => ({
    subject: `Pedido confirmado #${order.orderNumber}`,
    html: `
      <h2>¡Tu pedido está confirmado!</h2>
      <p>Pedido: ${order.orderNumber}</p>
      <p>Total: ${formatCurrency(order.total)}</p>
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/orders/${order.id}">Ver detalle</a>
    `,
  }),
  newSale: (order: Order) => ({
    subject: `Nueva venta - ${order.orderNumber}`,
    html: `
      <h2>¡Tienes una nueva venta!</h2>
      <p>Pedido: ${order.orderNumber}</p>
      <p>Prepara el producto en las próximas 48hs.</p>
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/seller/orders/${order.id}">Ver pedido</a>
    `,
  }),
};
```

**Workflow de notificaciones:**
1. **Al crear orden:** Email + SMS al comprador y vendedor
2. **Al preparar:** Email al comprador con tracking
3. **Al entregar:** Email pidiendo review
4. **Alertas:** SMS si orden >48hs sin preparar

#### 7. Sistema de Reviews
**Endpoints:**
- `POST /api/reviews/create` - Crear review (solo compradores con orden DELIVERED)
- `GET /api/reviews/product/[productId]` - Reviews de un producto
- `GET /api/reviews/seller/[sellerId]` - Reviews de un vendedor
- `PATCH /api/reviews/[reviewId]/respond` - Vendedor responde review

**Component:** `src/components/reviews/review-form.tsx`
- Rating stars
- Upload de fotos
- Text input

---

### PRIORIDAD 3: LOGÍSTICA & FACTURACIÓN (Semana 3-4)

#### 8. Integración Andreani (Courier)
**Lib:** `src/lib/andreani.ts`

```typescript
interface ShippingQuote {
  service: string;
  price: number;
  estimatedDays: number;
}

export async function getShippingQuote(
  originZipCode: string,
  destinationZipCode: string,
  weight: number // kg
): Promise<ShippingQuote[]> {
  const response = await fetch(`${process.env.ANDREANI_API_URL}/cotizar`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.ANDREANI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      cpOrigen: originZipCode,
      cpDestino: destinationZipCode,
      peso: weight,
    }),
  });

  const data = await response.json();
  return data.tarifas;
}

export async function createShipment(order: Order): Promise<{
  trackingNumber: string;
  labelUrl: string;
}> {
  // Create shipment in Andreani
  // Return tracking number and label PDF
}
```

**Endpoint:** `POST /api/orders/[orderId]/shipping` - Crear envío

#### 9. Facturación Electrónica AFIP
**Lib:** `src/lib/afip.ts`

```typescript
// Integración con AFIP Web Services
// Requiere certificado digital

export async function generateInvoice(order: Order) {
  // 1. Solicitar CAE (Código de Autorización Electrónico)
  // 2. Generar PDF con datos fiscales
  // 3. Guardar en DB
  // 4. Enviar por email al comprador
}
```

**Nota:** AFIP integration es compleja. Para MVP, usar servicio third-party como:
- Xubio API
- Siigo API
- Bejerman API

**Alternativa MVP:**
```typescript
// Generar factura interna (no fiscal)
// Vendedor se encarga de su propia facturación
```

---

### PRIORIDAD 4: AI & FEATURES PREMIUM (Semana 4-5)

#### 10. AI para Descripciones (Premium Sellers)
**Endpoint:** `POST /api/ai/enhance-description`

```typescript
import { ai } from '@/ai/genkit';

const enhanceDescriptionFlow = ai.defineFlow({
  name: 'enhanceProductDescription',
  inputSchema: z.object({
    productName: z.string(),
    category: z.string(),
    specifications: z.record(z.any()),
    basicDescription: z.string(),
  }),
  outputSchema: z.object({
    enhancedDescription: z.string(),
    highlights: z.array(z.string()),
    seoKeywords: z.array(z.string()),
  }),
});

// Prompt: transformar descripción básica en compelling copy
// - Enfatizar beneficios sobre features
// - Lenguaje persuasivo
// - SEO-optimizado
// - Adaptado al mercado LATAM
```

**Component:** `src/components/seller/ai-description-enhancer.tsx`
- Input: descripción básica
- Button: "Mejorar con IA" (solo Premium)
- Output: descripción enhanced con edición manual

#### 11. Búsqueda Inteligente
**Actualizar:** `src/ai/flows/intelligent-search-agent.ts`

Cambiar de:
- Buscar en JSON hardcoded
A:
- Buscar en DB con filtros
- Embeddings para semantic search (opcional pero recommended)

```typescript
// Install: npm install @pinecone-database/pinecone

import { Pinecone } from '@pinecone-database/pinecone';
import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai';

const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! });
const embeddings = new GoogleGenerativeAIEmbeddings();

// Indexar productos
export async function indexProduct(product: Product) {
  const embedding = await embeddings.embedQuery(
    `${product.name} ${product.description} ${product.brand}`
  );

  await pinecone.index('shoppa-products').upsert([
    {
      id: product.id,
      values: embedding,
      metadata: {
        name: product.name,
        category: product.category,
        price: product.price,
        sellerId: product.sellerProfileId,
      },
    },
  ]);
}

// Buscar por similarity
export async function semanticSearch(query: string, topK: number = 10) {
  const queryEmbedding = await embeddings.embedQuery(query);

  const results = await pinecone.index('shoppa-products').query({
    vector: queryEmbedding,
    topK,
    includeMetadata: true,
  });

  return results.matches;
}
```

---

### PRIORIDAD 5: ADMIN & ANALYTICS (Semana 5-6)

#### 12. Panel de Admin
**Página:** `src/app/admin/dashboard/page.tsx`

**Métricas globales:**
- GMV (Gross Merchandise Value) total y por mes
- Número de vendedores activos/pendientes/suspendidos
- Número de transacciones
- Revenue de la plataforma (comisiones)
- Top sellers
- Top products
- Conversion rate

**Acciones:**
- Aprobar/rechazar sellers
- Moderar productos
- Ver órdenes con problemas
- Gestionar disputes

#### 13. Analytics Events
**Helper:** `src/lib/analytics.ts`

```typescript
export async function trackEvent(
  eventType: string,
  data: {
    userId?: string;
    productId?: string;
    orderId?: string;
    metadata?: Record<string, any>;
  }
) {
  await prisma.analyticsEvent.create({
    data: {
      eventType,
      userId: data.userId,
      productId: data.productId,
      orderId: data.orderId,
      metadata: data.metadata,
    },
  });
}

// Usage:
await trackEvent('product_view', { productId: '123', userId: user.id });
await trackEvent('add_to_cart', { productId: '123' });
await trackEvent('purchase', { orderId: '456', userId: user.id });
```

**Integrar en:**
- Vistas de productos
- Agregar al carrito
- Checkout iniciado
- Compra completada

---

## 📋 CHECKLIST DE DEPLOYMENT

### Pre-Production

- [ ] Setup PostgreSQL database (Railway, Neon, Supabase)
- [ ] Setup Stripe Connect (activate en producción)
- [ ] Setup Resend para emails
- [ ] Setup Twilio para SMS
- [ ] Setup S3/Cloudflare R2 para storage
- [ ] Variables de entorno en producción
- [ ] Prisma migrate en producción
- [ ] Seed admin user

### Production

- [ ] Deploy en Vercel/Railway
- [ ] Custom domain
- [ ] SSL certificates
- [ ] Rate limiting (Upstash Redis)
- [ ] Monitoring (Sentry)
- [ ] Backups automáticos de DB
- [ ] CDN para imágenes (Cloudflare)

### Legal & Compliance

- [ ] Términos y condiciones
- [ ] Política de privacidad
- [ ] Política de devoluciones
- [ ] Alta de AFIP como intermediario
- [ ] Contrato con vendedores

---

## 🎯 MVP MÍNIMO (2 semanas)

Si necesitas lanzar RÁPIDO, este es el scope mínimo:

**Week 1:**
1. ✅ Database + Auth (HECHO)
2. ✅ Seller onboarding (HECHO)
3. ✅ Create products (HECHO)
4. 🔨 Stripe Connect básico
5. 🔨 Checkout simple (sin cuotas, solo débito)
6. 🔨 Email notifications (solo Resend)

**Week 2:**
7. 🔨 Order management básico
8. �� Seller dashboard con órdenes
9. 🔨 Reviews básico
10. 🔨 Actualizar landing page

**Postpone para v2:**
- SMS/WhatsApp notifications
- Logistics integration
- AFIP invoicing (usar factura interna)
- AI descriptions
- Advanced analytics
- Semantic search

---

## 🛠 COMANDOS PARA EMPEZAR

```bash
# 1. Instalar dependencias adicionales
npm install @prisma/client bcryptjs jsonwebtoken stripe @aws-sdk/client-s3 resend twilio

npm install -D @types/bcryptjs @types/jsonwebtoken prisma

# 2. Setup Prisma
npx prisma generate
npx prisma db push  # Para development
# O para production:
npx prisma migrate dev --name init

# 3. Crear admin user (seed)
npx prisma db seed

# 4. Iniciar dev server
npm run dev
```

**Crear seed script:** `prisma/seed.ts`

```typescript
import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../src/lib/auth';

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const admin = await prisma.user.create({
    data: {
      email: 'admin@shoppa.com',
      passwordHash: await hashPassword('changeme123'),
      firstName: 'Admin',
      lastName: 'Shoppa',
      role: 'ADMIN',
    },
  });

  console.log('Admin user created:', admin.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

Agregar a `package.json`:
```json
{
  "prisma": {
    "seed": "tsx prisma/seed.ts"
  }
}
```

---

## 🚀 PRÓXIMOS PASOS

1. **Instalar dependencias** (ver comandos arriba)
2. **Setup database** en Neon/Railway
3. **Implementar Stripe Connect** (Prioridad 1, Item 1)
4. **Implementar Checkout** (Prioridad 1, Item 2)
5. **Testing con vendedores reales** (5-10 sellers seed)

**¿Dudas? Siguiente archivo a crear:**
- `src/lib/stripe.ts` - Integración completa de Stripe Connect

---

**Creado por:** Claude (Sonnet 4.5)
**Para:** Shoppa! Marketplace MVP
**Fecha:** Enero 2025
