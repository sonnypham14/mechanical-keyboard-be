import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding database...');

  // ==================== CATEGORIES ====================
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'mechanical-keyboards' },
      update: {},
      create: {
        name: 'Mechanical Keyboards',
        slug: 'mechanical-keyboards',
        image: 'https://placehold.co/400x300?text=Keyboards',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'switches' },
      update: {},
      create: {
        name: 'Switches',
        slug: 'switches',
        image: 'https://placehold.co/400x300?text=Switches',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'keycaps' },
      update: {},
      create: {
        name: 'Keycaps',
        slug: 'keycaps',
        image: 'https://placehold.co/400x300?text=Keycaps',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'accessories' },
      update: {},
      create: {
        name: 'Accessories',
        slug: 'accessories',
        image: 'https://placehold.co/400x300?text=Accessories',
      },
    }),
  ]);

  console.log(`Created ${categories.length} categories`);

  // ==================== BRANDS ====================
  const brands = await Promise.all([
    prisma.brand.upsert({
      where: { slug: 'keychron' },
      update: {},
      create: {
        name: 'Keychron',
        slug: 'keychron',
        country: 'Hong Kong',
        website: 'https://www.keychron.com',
      },
    }),
    prisma.brand.upsert({
      where: { slug: 'glorious' },
      update: {},
      create: {
        name: 'Glorious',
        slug: 'glorious',
        country: 'USA',
        website: 'https://www.gloriousgaming.com',
      },
    }),
    prisma.brand.upsert({
      where: { slug: 'gateron' },
      update: {},
      create: {
        name: 'Gateron',
        slug: 'gateron',
        country: 'China',
        website: 'https://www.gateron.com',
      },
    }),
    prisma.brand.upsert({
      where: { slug: 'gmk' },
      update: {},
      create: {
        name: 'GMK',
        slug: 'gmk',
        country: 'Germany',
      },
    }),
  ]);

  console.log(`Created ${brands.length} brands`);

  // ==================== PRODUCTS ====================
  const products = await Promise.all([
    prisma.product.upsert({
      where: { slug: 'keychron-k2-v2' },
      update: {},
      create: {
        name: 'Keychron K2 V2',
        slug: 'keychron-k2-v2',
        sku: 'KEY-K2-V2-001',
        description:
          'A compact 75% wireless mechanical keyboard with RGB backlight.',
        price: 89.99,
        thumbnail: 'https://placehold.co/600x400?text=Keychron+K2',
        brandId: brands[0].id,
        categoryId: categories[0].id,
        switchType: 'LINEAR',
        layout: 'SEVENTY_FIVE',
        connectivity: 'WIRELESS',
        colors: ['Gray', 'Black'],
        material: 'Aluminum',
        stock: 50,
        featured: true,
        tags: ['wireless', '75%', 'rgb'],
        images: {
          create: [
            {
              url: 'https://placehold.co/600x400?text=K2+Front',
              alt: 'Keychron K2 Front View',
              order: 0,
            },
            {
              url: 'https://placehold.co/600x400?text=K2+Side',
              alt: 'Keychron K2 Side View',
              order: 1,
            },
          ],
        },
        specs: {
          create: [
            { key: 'Battery', value: '4000mAh' },
            { key: 'Connection', value: 'Bluetooth 5.1 / USB-C' },
            { key: 'Keys', value: '84 keys' },
          ],
        },
      },
    }),
    prisma.product.upsert({
      where: { slug: 'glorious-gmmk-pro' },
      update: {},
      create: {
        name: 'Glorious GMMK Pro',
        slug: 'glorious-gmmk-pro',
        sku: 'GLO-GMMK-PRO-001',
        description: 'A premium 75% gasket-mount keyboard for enthusiasts.',
        price: 169.99,
        compareAtPrice: 199.99,
        thumbnail: 'https://placehold.co/600x400?text=GMMK+Pro',
        brandId: brands[1].id,
        categoryId: categories[0].id,
        switchType: 'TACTILE',
        layout: 'SEVENTY_FIVE',
        connectivity: 'WIRED',
        colors: ['Black', 'White'],
        material: 'Aluminum',
        stock: 30,
        featured: true,
        tags: ['gasket', '75%', 'premium'],
        images: {
          create: [
            {
              url: 'https://placehold.co/600x400?text=GMMK+Pro',
              alt: 'GMMK Pro',
              order: 0,
            },
          ],
        },
        specs: {
          create: [
            { key: 'Mount', value: 'Gasket Mount' },
            { key: 'Connection', value: 'USB-C' },
            { key: 'Keys', value: '83 keys' },
          ],
        },
      },
    }),
  ]);

  console.log(`Created ${products.length} products`);

  // ==================== BUILDER PARTS ====================
  await Promise.all([
    prisma.builderPart.upsert({
      where: { id: 'case-tofu65' },
      update: {},
      create: {
        id: 'case-tofu65',
        type: 'CASE',
        name: 'Tofu65 Aluminum Case',
        brand: 'KBDfans',
        price: 79.99,
        image: 'https://placehold.co/400x300?text=Tofu65',
        specs: { layout: '65%', material: 'Aluminum', color: 'Black' },
      },
    }),
    prisma.builderPart.upsert({
      where: { id: 'pcb-dz65rgb' },
      update: {},
      create: {
        id: 'pcb-dz65rgb',
        type: 'PCB',
        name: 'DZ65RGB V3',
        brand: 'KBDfans',
        price: 39.99,
        image: 'https://placehold.co/400x300?text=DZ65RGB',
        specs: { layout: '65%', hotswap: true, wireless: false },
      },
    }),
    prisma.builderPart.upsert({
      where: { id: 'switch-gateron-yellow' },
      update: {},
      create: {
        id: 'switch-gateron-yellow',
        type: 'SWITCH',
        name: 'Gateron Yellow (x90)',
        brand: 'Gateron',
        price: 18.99,
        image: 'https://placehold.co/400x300?text=Gateron+Yellow',
        specs: { type: 'LINEAR', actuation: '35g', travel: '4mm' },
      },
    }),
    prisma.builderPart.upsert({
      where: { id: 'keycaps-gmk-red-samurai' },
      update: {},
      create: {
        id: 'keycaps-gmk-red-samurai',
        type: 'KEYCAPS',
        name: 'GMK Red Samurai',
        brand: 'GMK',
        price: 149.99,
        image: 'https://placehold.co/400x300?text=GMK+Red+Samurai',
        specs: { material: 'ABS', profile: 'Cherry', legends: 'Doubleshot' },
      },
    }),
  ]);

  console.log('Created builder parts');
  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    void prisma.$disconnect();
  });
