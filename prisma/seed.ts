import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create admin user
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@shoppa.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'changeme123';

  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (existingAdmin) {
    console.log('⏭️  Admin user already exists, skipping...');
  } else {
    const passwordHash = await hash(adminPassword, 12);

    const admin = await prisma.user.create({
      data: {
        email: adminEmail,
        passwordHash,
        firstName: 'Admin',
        lastName: 'Shoppa',
        role: 'ADMIN',
      },
    });

    console.log('✅ Admin user created:');
    console.log(`   Email: ${admin.email}`);
    console.log(`   Password: ${adminPassword}`);
    console.log('   ⚠️  CHANGE THIS PASSWORD IN PRODUCTION!');
  }

  // Create demo buyer
  const buyerEmail = 'buyer@example.com';
  const existingBuyer = await prisma.user.findUnique({
    where: { email: buyerEmail },
  });

  if (!existingBuyer) {
    const passwordHash = await hash('demo123', 12);

    const buyer = await prisma.user.create({
      data: {
        email: buyerEmail,
        passwordHash,
        firstName: 'Juan',
        lastName: 'Comprador',
        role: 'BUYER',
        buyerProfile: {
          create: {},
        },
      },
    });

    console.log('✅ Demo buyer created:');
    console.log(`   Email: ${buyer.email}`);
    console.log(`   Password: demo123`);
  }

  // Create demo seller
  const sellerEmail = 'seller@example.com';
  const existingSeller = await prisma.user.findUnique({
    where: { email: sellerEmail },
  });

  if (!existingSeller) {
    const passwordHash = await hash('demo123', 12);

    const seller = await prisma.user.create({
      data: {
        email: sellerEmail,
        passwordHash,
        firstName: 'María',
        lastName: 'Vendedora',
        role: 'SELLER',
        sellerProfile: {
          create: {
            businessName: 'TechStore Demo',
            businessType: 'individual',
            taxId: '20123456789',
            businessAddress: 'Av. Corrientes 1234, CABA',
            businessPhone: '+54 11 1234-5678',
            businessEmail: 'info@techstoredemo.com',
            status: 'VERIFIED',
            tier: 'BASIC',
          },
        },
      },
    });

    console.log('✅ Demo seller created:');
    console.log(`   Email: ${seller.email}`);
    console.log(`   Password: demo123`);
  }

  console.log('🎉 Seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
