# Shoppa! - Marketplace Completo

**Bienvenido a Shoppa!** - El marketplace que resuelve la parálisis por análisis con recomendaciones inteligentes.

## 🚀 Quick Start

### 1. Instalar Dependencias

```bash
npm install
```

### 2. Setup Base de Datos

**Opción A: PostgreSQL Local**
```bash
# Instalar PostgreSQL
brew install postgresql@14  # Mac
# sudo apt install postgresql  # Linux

# Iniciar PostgreSQL
brew services start postgresql@14

# Crear database
createdb shoppa
```

**Opción B: PostgreSQL en la nube (RECOMENDADO)**

Usa uno de estos servicios (todos tienen free tier):

- **Neon** (https://neon.tech) - Recomendado, setup en 30 segundos
- **Railway** (https://railway.app)
- **Supabase** (https://supabase.com)

### 3. Configurar Variables de Entorno

```bash
cp .env.example .env
```

Edita `.env` y completa:

```bash
# OBLIGATORIO
DATABASE_URL="postgresql://user:password@host:5432/shoppa"
JWT_SECRET="tu-secret-key-super-seguro-aqui"

# Para testing inicial, estos son opcionales:
STRIPE_SECRET_KEY="sk_test_..." # Obtener en stripe.com
RESEND_API_KEY="re_..." # Obtener en resend.com
```

### 4. Inicializar Base de Datos

```bash
# Generar Prisma Client
npm run db:generate

# Crear tablas
npm run db:push

# Seed con usuarios demo
npm run db:seed
```

### 5. Iniciar Development Server

```bash
npm run dev
```

Abre http://localhost:9002

---

## 👥 Usuarios de Demo

Después del seed, puedes login con:

**Admin:**
- Email: `admin@shoppa.com`
- Password: `changeme123`

**Comprador:**
- Email: `buyer@example.com`
- Password: `demo123`

**Vendedor:**
- Email: `seller@example.com`
- Password: `demo123`

---

## 📚 Estructura del Proyecto

```
shoppa/
├── prisma/
│   ├── schema.prisma          # Database schema completo
│   └── seed.ts                # Seed script
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/          # Login, register, me
│   │   │   ├── seller/        # Onboarding, products
│   │   │   ├── products/      # CRUD de productos
│   │   │   └── orders/        # Gestión de órdenes (TODO)
│   │   ├── seller/
│   │   │   └── dashboard/     # Dashboard de vendedor (TODO)
│   │   ├── admin/
│   │   │   └── dashboard/     # Dashboard de admin (TODO)
│   │   └── page.tsx           # Landing page
│   ├── components/
│   │   ├── seller/            # Componentes de vendedor
│   │   ├── checkout/          # Checkout flow (TODO)
│   │   └── ui/                # shadcn/ui components
│   ├── lib/
│   │   ├── prisma.ts          # Prisma client
│   │   ├── auth.ts            # JWT auth helpers
│   │   ├── utils.ts           # Helpers (fees, format, etc)
│   │   ├── stripe.ts          # Stripe integration (TODO)
│   │   └── notifications.ts   # Email/SMS (TODO)
│   └── ai/
│       └── flows/             # Genkit AI flows
└── IMPLEMENTATION_GUIDE.md    # Guía completa de implementación
```

---

## ✅ Features Implementadas

### Core
- [x] Database schema completo (17 tablas)
- [x] Autenticación JWT con roles (Buyer/Seller/Admin)
- [x] Registro de usuarios
- [x] Onboarding de vendedor con KYC
- [x] Creación de productos con imágenes/videos
- [x] Sistema de tiers (Basic/Premium/Enterprise)
- [x] Cálculo automático de fees

### Frontend
- [x] Landing page con propuesta de valor
- [x] Onboarding flow conversacional
- [x] Formulario de registro de vendedor
- [x] Recomendaciones inteligentes con IA

---

## 🚧 En Desarrollo (ver IMPLEMENTATION_GUIDE.md)

### Semana 1-2: Core Marketplace
- [ ] Stripe Connect integration
- [ ] Checkout con split payments
- [ ] Sistema de órdenes completo
- [ ] Dashboard de vendedor con métricas
- [ ] Upload de archivos a S3/R2

### Semana 2-3: Comunicación
- [ ] Sistema de notificaciones (email/SMS)
- [ ] Templates de emails transaccionales
- [ ] Sistema de reviews y ratings
- [ ] Chat comprador-vendedor (opcional)

### Semana 3-4: Logística
- [ ] Integración Andreani API
- [ ] Tracking de envíos
- [ ] Facturación electrónica (AFIP o alternativa)

### Semana 4-5: Features Premium
- [ ] AI para mejorar descripciones
- [ ] Búsqueda semántica con embeddings
- [ ] Sistema de suscripciones Premium

### Semana 5-6: Admin & Analytics
- [ ] Panel de admin
- [ ] Métricas de negocio (GMV, conversión, etc)
- [ ] Sistema de moderación

---

## 📖 Guías de Desarrollo

### Crear una nueva API route

```typescript
// src/app/api/example/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const user = await authenticateRequest(authHeader);

    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized',
      }, { status: 401 });
    }

    // Tu lógica aquí
    const data = await prisma.product.findMany();

    return NextResponse.json({
      success: true,
      data,
    });

  } catch (error: any) {
    console.error('Error:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
    }, { status: 500 });
  }
}
```

### Hacer queries con Prisma

```typescript
// Buscar con relaciones
const product = await prisma.product.findUnique({
  where: { id: productId },
  include: {
    seller: true,
    images: true,
    reviews: true,
  },
});

// Crear con relaciones anidadas
const order = await prisma.order.create({
  data: {
    buyerProfileId: buyer.id,
    sellerProfileId: seller.id,
    total: 100000,
    items: {
      create: [
        { productId: '123', quantity: 1, unitPrice: 100000 },
      ],
    },
  },
  include: {
    items: true,
  },
});

// Actualizar
await prisma.order.update({
  where: { id: orderId },
  data: { status: 'PAID' },
});

// Transacciones
await prisma.$transaction(async (tx) => {
  await tx.product.update({
    where: { id: productId },
    data: { stock: { decrement: 1 } },
  });

  await tx.order.create({
    data: { ... },
  });
});
```

### Ver Base de Datos (Prisma Studio)

```bash
npm run db:studio
```

Abre en http://localhost:5555

---

## 🔑 Setup de Servicios Externos

### Stripe Connect

1. Crea cuenta en https://stripe.com
2. Activa Stripe Connect
3. Copia `Secret Key` a `.env`
4. Para testing: usa `sk_test_...`
5. Para producción: activa cuenta y usa `sk_live_...`

### Resend (Emails)

1. Crea cuenta en https://resend.com
2. Verifica tu dominio (o usa gratis con @resend.dev)
3. Copia API key a `.env`

### Twilio (SMS) - Opcional

1. Crea cuenta en https://twilio.com
2. Compra número argentino (+54)
3. Copia credentials a `.env`

### AWS S3 / Cloudflare R2 (Storage)

**Cloudflare R2 (Recomendado - más barato):**
1. Crea cuenta en Cloudflare
2. Ve a R2 Storage
3. Crea bucket `shoppa-uploads`
4. Genera API token
5. Copia credentials a `.env`

---

## 🧪 Testing

### Test de Auth

```bash
# Register
curl -X POST http://localhost:9002/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "firstName": "Test",
    "role": "BUYER"
  }'

# Login
curl -X POST http://localhost:9002/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'

# Get User
curl http://localhost:9002/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 🚀 Deployment

### Vercel (Recomendado)

```bash
npm install -g vercel
vercel login
vercel
```

Configura variables de entorno en Vercel Dashboard.

### Railway

1. Conecta repo a Railway
2. Agrega PostgreSQL addon
3. Configura env vars
4. Deploy automático

---

## 📞 Soporte

- **Docs completas:** `IMPLEMENTATION_GUIDE.md`
- **Issues:** Crea issue en GitHub
- **Email:** soporte@shoppa.com (cuando esté activo)

---

## 📄 Licencia

Propietario. Todos los derechos reservados. © 2025 Shoppa!

---

**Built with:**
- Next.js 15
- React 18
- Prisma ORM
- PostgreSQL
- Stripe
- Genkit AI
- shadcn/ui
- Tailwind CSS

---

**¡Ahora a construir el marketplace del futuro!** 🚀
