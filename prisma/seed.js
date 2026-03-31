const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Creación de usuarios de demostración
/* 
  const users = [
    { name: 'Usuario 1', email: 'usuario1@ejemplo.com' },
    { name: 'Usuario 2', email: 'usuario2@ejemplo.com' },
    { name: 'Usuario 3', email: 'usuario3@ejemplo.com' }
  ];

  for (const user of users) {
    await prisma.user.create({
      data: user
    });
  }
    console.log('Usuarios de demostración creados con éxito');  
 

  await prisma.user.deleteMany(); */
console.log('Generando datos de prueba...')

  // 1. Crear Bloques de Tiempo (TimeBlocks)
  const block1 = await prisma.timeBlock.create({
    data: {
      startTime: new Date('2026-04-01T09:00:00Z'),
      endTime: new Date('2026-04-01T10:00:00Z'),
    },
  })

  const block2 = await prisma.timeBlock.create({
    data: {
      startTime: new Date('2026-04-01T10:00:00Z'),
      endTime: new Date('2026-04-01T11:00:00Z'),
    },
  })

  // 2. Crear Citas (Appointments)
  // Nota: Asegúrate de que el userId 1 y 2 existan en tu tabla User
  await prisma.appointment.createMany({
    data: [
      {
        date: new Date(),
        userId: 1, 
        timeBlockId: block1.id,
      },
      {
        date: new Date(),
        userId: 2,
        timeBlockId: block2.id,
      },
    ],
  })

  console.log('✅ Datos generados con éxito')


}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());