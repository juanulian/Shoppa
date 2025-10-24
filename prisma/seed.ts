import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create admin user (juan.ulian@shoppa.ar)
  const adminEmail = 'juan.ulian@shoppa.ar';
  const adminPassword = 'shoppa123';  // TODO: Change in production

  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (existingAdmin) {
    console.log('⏭️  Admin user already exists, skipping...');
  } else {
    const passwordHash = await bcrypt.hash(adminPassword, 12);

    const admin = await prisma.user.create({
      data: {
        email: adminEmail,
        username: 'juanulian',
        passwordHash,
        firstName: 'Juan',
        lastName: 'Ulian',
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
    const passwordHash = await bcrypt.hash('demo123', 12);

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

  // Create Shoppa! Test seller
  const sellerEmail = 'test@shoppa.ar';
  const existingSeller = await prisma.user.findUnique({
    where: { email: sellerEmail },
  });

  if (!existingSeller) {
    const passwordHash = await bcrypt.hash('test123', 12);

    const seller = await prisma.user.create({
      data: {
        email: sellerEmail,
        username: 'shoppa_test',
        passwordHash,
        firstName: 'Shoppa',
        lastName: 'Test',
        role: 'SELLER',
        sellerProfile: {
          create: {
            businessName: 'Shoppa! Test',
            businessType: 'individual',
            taxId: '20999999999',
            businessAddress: 'Av. Corrientes 1234, CABA',
            businessPhone: '+54 11 1234-5678',
            businessEmail: 'test@shoppa.ar',
            status: 'VERIFIED',
            tier: 'BASIC',
            verifiedAt: new Date(),
          },
        },
      },
    });

    console.log('✅ Shoppa! Test seller created:');
    console.log(`   Email: ${seller.email}`);
    console.log(`   Password: test123`);
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
