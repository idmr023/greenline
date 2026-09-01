import dotenv from 'dotenv';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '..', '.env') });

import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import argon2 from 'argon2';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Iniciando seed...');

  // ============================================================
  // Crear tiendas/almacenes de ejemplo
  // ============================================================
  const tiendas = await Promise.all([
    prisma.tienda.upsert({
      where: { id: '00000000-0000-0000-0000-000000000001' },
      update: {},
      create: {
        id: '00000000-0000-0000-0000-000000000001',
        nombre: 'GreenLine Almacén Central',
        direccion: 'Av. Industrial 123',
        ciudad: 'Lima',
        tipo: 'almacen',
      },
    }),
    prisma.tienda.upsert({
      where: { id: '00000000-0000-0000-0000-000000000002' },
      update: {},
      create: {
        id: '00000000-0000-0000-0000-000000000002',
        nombre: 'GreenLine Tienda Lince',
        direccion: 'Av. José Leal 507',
        ciudad: 'Lima',
        tipo: 'tienda',
      },
    }),
    prisma.tienda.upsert({
      where: { id: '00000000-0000-0000-0000-000000000003' },
      update: {},
      create: {
        id: '00000000-0000-0000-0000-000000000003',
        nombre: 'GreenLine Tienda Surco',
        direccion: 'Av. Surco 790',
        ciudad: 'Lima',
        tipo: 'tienda',
      },
    }),
    prisma.tienda.upsert({
      where: { id: '00000000-0000-0000-0000-000000000004' },
      update: {},
      create: {
        id: '00000000-0000-0000-0000-000000000004',
        nombre: 'GreenLine Tienda Huancayo',
        direccion: 'Av. Huancavelica 290',
        ciudad: 'Huancayo',
        tipo: 'tienda',
      },
    }),
  ]);

  console.log(`   ✅ ${tiendas.length} tiendas creadas`);

  // ============================================================
  // Crear usuario admin
  // ============================================================
  const adminPasswordHash = await argon2.hash('GreenLine@2026', {
    type: argon2.argon2id,
    memoryCost: 65536,
    timeCost: 4,
    parallelism: 4,
  });

  const admin = await prisma.user.upsert({
    where: { email: 'admin@greenline.com' },
    update: {},
    create: {
      email: 'admin@greenline.com',
      passwordHash: adminPasswordHash,
      nombre: 'Admin',
      apellido: 'GreenLine',
      rol: 'ADMIN',
      nivelAcceso: 'SUPER',
      emailVerificado: true,
      activo: true,
    },
  });

  console.log(`   ✅ Admin creado: ${admin.email}`);

  // ============================================================
  // Crear usuario de prueba (gerente de tienda)
  // ============================================================
  const gerenteHash = await argon2.hash('Gerente@2026', {
    type: argon2.argon2id,
    memoryCost: 65536,
    timeCost: 4,
    parallelism: 4,
  });

  const gerente = await prisma.user.upsert({
    where: { email: 'gerente.lince@greenline.com' },
    update: {},
    create: {
      email: 'gerente.lince@greenline.com',
      passwordHash: gerenteHash,
      nombre: 'Carlos',
      apellido: 'Mendoza',
      rol: 'GERENTE_TIENDA',
      nivelAcceso: 'TIENDA',
      tiendaId: tiendas[1].id,
      emailVerificado: true,
      activo: true,
    },
  });

  console.log(`   ✅ Gerente creado: ${gerente.email}`);

  // ============================================================
  // Crear colaborador de prueba
  // ============================================================
  const colaboradorHash = await argon2.hash('Colab@2026', {
    type: argon2.argon2id,
    memoryCost: 65536,
    timeCost: 4,
    parallelism: 4,
  });

  const colaborador = await prisma.user.upsert({
    where: { email: 'colaborador.lince@greenline.com' },
    update: {},
    create: {
      email: 'colaborador.lince@greenline.com',
      passwordHash: colaboradorHash,
      nombre: 'María',
      apellido: 'García',
      rol: 'COLABORADOR_TIENDA',
      nivelAcceso: 'TIENDA',
      tiendaId: tiendas[1].id,
      gerenteId: gerente.id,
      emailVerificado: true,
      activo: true,
    },
  });

  console.log(`   ✅ Colaborador creado: ${colaborador.email}`);

  // ============================================================
  // Crear clientes de prueba (1 principal + 10 para el load test)
  // ============================================================
  const clienteHash = await argon2.hash('Cliente@2026', {
    type: argon2.argon2id,
    memoryCost: 65536,
    timeCost: 4,
    parallelism: 4,
  });

  const cliente = await prisma.user.upsert({
    where: { email: 'cliente@test.com' },
    update: {},
    create: {
      email: 'cliente@test.com',
      passwordHash: clienteHash,
      nombre: 'Juan',
      apellido: 'Pérez',
      rol: 'CLIENTE',
      nivelAcceso: 'CLIENTE_N',
      emailVerificado: true,
      activo: true,
      clienteProfile: {
        create: {
          documento: '12345678',
          direccion: 'Av. Primavera 123',
          ciudad: 'Lima',
          departamento: 'Lima',
        },
      },
    },
  });

  console.log(`   ✅ Cliente creado: ${cliente.email}`);

  // Clientes de prueba para scripts/load/load-test.js.
  // Misma contraseña que el cliente principal; email único por índice.
  // Al correr el seed en cualquier entorno (local o staging/prod) siempre se
  // crean los MISMOS usuarios y credenciales.
  const LOAD_TEST_CLIENTS = 10;
  const clientesTest = [];
  for (let i = 1; i <= LOAD_TEST_CLIENTS; i++) {
    const email = `cliente${i}@test.com`;
    const test = await prisma.user.upsert({
      where: { email },
      update: {},
      create: {
        email,
        passwordHash: clienteHash,
        nombre: `Cliente ${i}`,
        apellido: 'Prueba',
        rol: 'CLIENTE',
        nivelAcceso: 'CLIENTE_N',
        emailVerificado: true,
        activo: true,
        clienteProfile: {
          create: {
            documento: String(10000000 + i),
            direccion: 'Av. Prueba 123',
            ciudad: 'Lima',
            departamento: 'Lima',
          },
        },
      },
    });
    clientesTest.push(test);
  }

  console.log(`   ✅ ${clientesTest.length} clientes de prueba creados (cliente1@test.com ... cliente${LOAD_TEST_CLIENTS}@test.com)`);

  console.log('\n🎉 Seed completado exitosamente!');
  console.log('\n📋 Usuarios creados:');
  console.log('   admin@greenline.com        / GreenLine@2026  (ADMIN)');
  console.log('   gerente.lince@greenline.com / Gerente@2026   (GERENTE_TIENDA)');
  console.log('   colaborador.lince@greenline.com / Colab@2026 (COLABORADOR_TIENDA)');
  console.log('   cliente@test.com           / Cliente@2026    (CLIENTE)');
  for (let i = 1; i <= LOAD_TEST_CLIENTS; i++) {
    console.log(`   cliente${i}@test.com          / Cliente@2026    (CLIENTE)`);
  }
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
