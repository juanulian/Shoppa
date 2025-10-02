import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const SimulateOrderSchema = z.object({
  // Product info
  productId: z.string(),
  productName: z.string(),
  productPrice: z.number(),
  productImage: z.string().optional(),

  // Buyer info
  buyerName: z.string().min(2),
  buyerEmail: z.string().email(),
  buyerPhone: z.string().min(10),
  buyerAddress: z.string().min(10),

  // Payment simulation
  cardNumber: z.string().regex(/^\d{16}$/),
  cardExpiry: z.string().regex(/^\d{2}\/\d{2}$/),
  cardCvv: z.string().regex(/^\d{3,4}$/),
  cardName: z.string().min(2),
});

/**
 * POST /api/orders/simulate
 * Simula una compra y envía email al vendedor
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = SimulateOrderSchema.parse(body);

    // Generar número de orden
    const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    // Calcular fees (5% comisión)
    const platformFee = validatedData.productPrice * 0.05;
    const sellerReceives = validatedData.productPrice - platformFee;

    // Construir email para el vendedor
    const emailSubject = `🎉 Nueva venta en Shoppa! - Orden ${orderNumber}`;
    const emailHTML = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; }
    .order-box { background: white; border: 2px solid #667eea; border-radius: 8px; padding: 20px; margin: 20px 0; }
    .product-info { background: #eff6ff; padding: 15px; border-radius: 6px; margin: 15px 0; }
    .buyer-info { background: #fef3c7; padding: 15px; border-radius: 6px; margin: 15px 0; }
    .money { background: #d1fae5; padding: 15px; border-radius: 6px; margin: 15px 0; }
    .price { font-size: 24px; font-weight: bold; color: #667eea; }
    .button { display: inline-block; background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 0; }
    .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 12px; }
    h2 { color: #667eea; margin-top: 0; }
    .warning { background: #fee2e2; border-left: 4px solid #ef4444; padding: 12px; margin: 15px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0;">🛍️ ¡Nueva Venta!</h1>
      <p style="margin: 10px 0 0 0;">Orden ${orderNumber}</p>
    </div>

    <div class="content">
      <p><strong>Hola Vendedor Demo!</strong></p>
      <p>Tenés una nueva venta en Shoppa! Estos son los detalles:</p>

      <div class="order-box">
        <h2>📦 Producto Vendido</h2>
        <div class="product-info">
          <p><strong>Producto:</strong> ${validatedData.productName}</p>
          <p class="price">$${validatedData.productPrice.toLocaleString('es-AR')}</p>
        </div>
      </div>

      <div class="order-box">
        <h2>👤 Datos del Comprador</h2>
        <div class="buyer-info">
          <p><strong>Nombre:</strong> ${validatedData.buyerName}</p>
          <p><strong>Email:</strong> <a href="mailto:${validatedData.buyerEmail}">${validatedData.buyerEmail}</a></p>
          <p><strong>Teléfono:</strong> <a href="tel:${validatedData.buyerPhone}">${validatedData.buyerPhone}</a></p>
          <p><strong>Dirección de Envío:</strong><br/>${validatedData.buyerAddress}</p>
        </div>
      </div>

      <div class="order-box">
        <h2>💰 Resumen Financiero</h2>
        <div class="money">
          <p><strong>Precio del Producto:</strong> $${validatedData.productPrice.toLocaleString('es-AR')}</p>
          <p><strong>Comisión Shoppa! (5%):</strong> -$${platformFee.toLocaleString('es-AR')}</p>
          <hr style="border: none; border-top: 2px dashed #10b981; margin: 10px 0;">
          <p style="font-size: 20px;"><strong>Recibirás:</strong> <span style="color: #10b981; font-weight: bold;">$${sellerReceives.toLocaleString('es-AR')}</span></p>
          <p style="font-size: 12px; color: #6b7280;">* Transferencia cada 15 días</p>
        </div>
      </div>

      <div class="warning">
        <p><strong>⚠️ ACCIÓN REQUERIDA:</strong></p>
        <ol style="margin: 10px 0;">
          <li>Contactá al comprador por WhatsApp/Email para confirmar</li>
          <li><strong>Emití la factura</strong> a nombre de: ${validatedData.buyerName}</li>
          <li>Coordiná entrega/envío</li>
          <li>Marcá como "Enviado" en tu panel de vendedor</li>
        </ol>
      </div>

      <p style="text-align: center;">
        <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:9002'}/seller/orders/${orderNumber}" class="button">
          Ver Orden Completa →
        </a>
      </p>

      <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">

      <p style="font-size: 14px; color: #6b7280;">
        <strong>Pago simulado con:</strong><br/>
        Tarjeta: **** **** **** ${validatedData.cardNumber.slice(-4)}<br/>
        Vencimiento: ${validatedData.cardExpiry}<br/>
        Nombre: ${validatedData.cardName}
      </p>

      <p style="font-size: 14px; color: #6b7280;">
        <strong>Nota:</strong> Este es un pago simulado para demo. En producción, el pago sería procesado por Stripe/MercadoPago.
      </p>
    </div>

    <div class="footer">
      <p>
        <strong>Shoppa!</strong> - El marketplace sin vueltas<br/>
        <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:9002'}">www.shoppa.com</a> |
        <a href="mailto:soporte@shoppa.com">soporte@shoppa.com</a>
      </p>
      <p style="margin-top: 10px;">
        Si tenés dudas, respondé este email o escribinos a WhatsApp.
      </p>
    </div>
  </div>
</body>
</html>
    `;

    // Enviar email usando Resend (si está configurado)
    let emailSent = false;
    let emailError = null;

    if (process.env.RESEND_API_KEY) {
      try {
        const Resend = (await import('resend')).Resend;
        const resend = new Resend(process.env.RESEND_API_KEY);

        await resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL || 'Shoppa! <noreply@shoppa.com>',
          to: 'juanulian@gmail.com',
          subject: emailSubject,
          html: emailHTML,
        });

        emailSent = true;
      } catch (error: any) {
        console.error('Error sending email:', error);
        emailError = error.message;
      }
    } else {
      console.log('⚠️ RESEND_API_KEY not configured. Email would have been sent to: juanulian@gmail.com');
      console.log('Subject:', emailSubject);
    }

    return NextResponse.json({
      success: true,
      data: {
        orderNumber,
        productName: validatedData.productName,
        totalPaid: validatedData.productPrice,
        platformFee,
        sellerReceives,
        buyerEmail: validatedData.buyerEmail,
        emailSent,
        emailError,
      },
      message: 'Orden simulada exitosamente. Email enviado al vendedor.',
    }, { status: 201 });

  } catch (error: any) {
    console.error('Simulate order error:', error);

    if (error.name === 'ZodError') {
      return NextResponse.json({
        success: false,
        error: 'Validation error',
        details: error.errors,
      }, { status: 400 });
    }

    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to simulate order',
    }, { status: 500 });
  }
}
