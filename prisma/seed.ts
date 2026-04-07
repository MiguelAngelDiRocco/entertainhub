// prisma/seed.ts
// Datos de prueba para desarrollo local
// Ejecutar con: npx prisma db seed

import { PrismaClient, Platform, ContentType, AchievementCategory } from '@prisma/client'
import { calculateLevel } from '../lib/xp'

const db = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // ============================================================
  // LOGROS BASE
  // ============================================================
  const achievements = await Promise.all([
    // Gaming
    db.achievement.upsert({
      where: { key: 'first_game_session' },
      update: {},
      create: {
        key: 'first_game_session',
        name: 'Primera Partida',
        description: 'Registra tu primera sesión de juego',
        category: AchievementCategory.GAMING,
        xpReward: 100,
        conditionType: 'game_sessions_count',
        conditionValue: 1,
        sortOrder: 1,
      },
    }),
    db.achievement.upsert({
      where: { key: 'gaming_10_hours' },
      update: {},
      create: {
        key: 'gaming_10_hours',
        name: 'Calentando Motores',
        description: 'Acumula 10 horas de gaming',
        category: AchievementCategory.GAMING,
        xpReward: 200,
        conditionType: 'gaming_minutes',
        conditionValue: 600,
        sortOrder: 2,
      },
    }),
    db.achievement.upsert({
      where: { key: 'gaming_100_hours' },
      update: {},
      create: {
        key: 'gaming_100_hours',
        name: 'Centenario Gamer',
        description: 'Acumula 100 horas de gaming',
        category: AchievementCategory.GAMING,
        xpReward: 1000,
        conditionType: 'gaming_minutes',
        conditionValue: 6000,
        sortOrder: 3,
      },
    }),
    db.achievement.upsert({
      where: { key: 'gaming_platforms_2' },
      update: {},
      create: {
        key: 'gaming_platforms_2',
        name: 'Multiplataforma',
        description: 'Conecta 2 plataformas de gaming',
        category: AchievementCategory.GAMING,
        xpReward: 300,
        conditionType: 'gaming_platforms_count',
        conditionValue: 2,
        sortOrder: 4,
      },
    }),
    // Streaming
    db.achievement.upsert({
      where: { key: 'first_watch_session' },
      update: {},
      create: {
        key: 'first_watch_session',
        name: 'Primera Función',
        description: 'Registra tu primera sesión de streaming',
        category: AchievementCategory.STREAMING,
        xpReward: 100,
        conditionType: 'watch_sessions_count',
        conditionValue: 1,
        sortOrder: 10,
      },
    }),
    db.achievement.upsert({
      where: { key: 'streaming_10_hours' },
      update: {},
      create: {
        key: 'streaming_10_hours',
        name: 'Maratonista',
        description: 'Acumula 10 horas de streaming',
        category: AchievementCategory.STREAMING,
        xpReward: 200,
        conditionType: 'streaming_minutes',
        conditionValue: 600,
        sortOrder: 11,
      },
    }),
    db.achievement.upsert({
      where: { key: 'streaming_50_hours' },
      update: {},
      create: {
        key: 'streaming_50_hours',
        name: 'Cinéfilo Dedicado',
        description: 'Acumula 50 horas de streaming',
        category: AchievementCategory.STREAMING,
        xpReward: 500,
        conditionType: 'streaming_minutes',
        conditionValue: 3000,
        sortOrder: 12,
      },
    }),
    // Social
    db.achievement.upsert({
      where: { key: 'first_friend' },
      update: {},
      create: {
        key: 'first_friend',
        name: 'No Estás Solo',
        description: 'Agrega tu primer amigo',
        category: AchievementCategory.SOCIAL,
        xpReward: 200,
        conditionType: 'friends_count',
        conditionValue: 1,
        sortOrder: 20,
      },
    }),
    db.achievement.upsert({
      where: { key: 'friends_5' },
      update: {},
      create: {
        key: 'friends_5',
        name: 'Social Gamer',
        description: 'Ten 5 amigos en la plataforma',
        category: AchievementCategory.SOCIAL,
        xpReward: 500,
        conditionType: 'friends_count',
        conditionValue: 5,
        sortOrder: 21,
      },
    }),
    // Niveles
    db.achievement.upsert({
      where: { key: 'reach_level_5' },
      update: {},
      create: {
        key: 'reach_level_5',
        name: 'Ascendiendo',
        description: 'Alcanza el nivel 5',
        category: AchievementCategory.LEVEL,
        xpReward: 1000,
        conditionType: 'level',
        conditionValue: 5,
        sortOrder: 30,
      },
    }),
    // Streaks
    db.achievement.upsert({
      where: { key: 'streak_7_days' },
      update: {},
      create: {
        key: 'streak_7_days',
        name: 'Semana Perfecta',
        description: 'Mantén una racha de 7 días seguidos',
        category: AchievementCategory.STREAK,
        xpReward: 700,
        conditionType: 'streak_days',
        conditionValue: 7,
        sortOrder: 40,
      },
    }),
  ])

  console.log(`✅ ${achievements.length} logros creados`)

  // ============================================================
  // USUARIOS DE PRUEBA
  // ============================================================
  const testXP = 12500
  const testLevel = calculateLevel(testXP)

  const alice = await db.user.upsert({
    where: { email: 'alice@test.com' },
    update: {},
    create: {
      email: 'alice@test.com',
      username: 'alice_gamer',
      displayName: 'Alice',
      bio: 'Jugadora de RPGs y amante de las series de ciencia ficción',
      totalXP: testXP,
      gamingXP: 8000,
      streamingXP: 4500,
      currentLevel: testLevel,
      gamingLevel: calculateLevel(8000),
      streamingLevel: calculateLevel(4500),
      currentStreak: 5,
      lastActiveAt: new Date(),
    },
  })

  const bob = await db.user.upsert({
    where: { email: 'bob@test.com' },
    update: {},
    create: {
      email: 'bob@test.com',
      username: 'bob_plays',
      displayName: 'Bob',
      bio: 'FPS player, Netflix addict',
      totalXP: 8200,
      gamingXP: 6000,
      streamingXP: 2200,
      currentLevel: calculateLevel(8200),
      gamingLevel: calculateLevel(6000),
      streamingLevel: calculateLevel(2200),
      currentStreak: 2,
      lastActiveAt: new Date(Date.now() - 86400000),
    },
  })

  const carol = await db.user.upsert({
    where: { email: 'carol@test.com' },
    update: {},
    create: {
      email: 'carol@test.com',
      username: 'carol_streams',
      displayName: 'Carol',
      bio: 'Más series que horas de sueño',
      totalXP: 22000,
      gamingXP: 3000,
      streamingXP: 19000,
      currentLevel: calculateLevel(22000),
      gamingLevel: calculateLevel(3000),
      streamingLevel: calculateLevel(19000),
      currentStreak: 12,
      lastActiveAt: new Date(),
    },
  })

  console.log('✅ Usuarios de prueba creados')

  // Amistades de prueba
  await db.friendship.upsert({
    where: { userAId_userBId: { userAId: alice.id, userBId: bob.id } },
    update: {},
    create: { userAId: alice.id, userBId: bob.id },
  })

  await db.friendship.upsert({
    where: { userAId_userBId: { userAId: alice.id, userBId: carol.id } },
    update: {},
    create: { userAId: alice.id, userBId: carol.id },
  })

  console.log('✅ Amistades de prueba creadas')

  // ============================================================
  // JUEGOS DE PRUEBA
  // ============================================================
  const games = await Promise.all([
    db.game.upsert({
      where: { externalId_platform: { externalId: '570', platform: Platform.STEAM } },
      update: {},
      create: {
        externalId: '570',
        platform: Platform.STEAM,
        name: 'Dota 2',
        coverUrl: 'https://cdn.akamai.steamstatic.com/steam/apps/570/header.jpg',
        genre: ['MOBA', 'Strategy'],
        developer: 'Valve',
      },
    }),
    db.game.upsert({
      where: { externalId_platform: { externalId: '730', platform: Platform.STEAM } },
      update: {},
      create: {
        externalId: '730',
        platform: Platform.STEAM,
        name: 'Counter-Strike 2',
        coverUrl: 'https://cdn.akamai.steamstatic.com/steam/apps/730/header.jpg',
        genre: ['FPS', 'Tactical'],
        developer: 'Valve',
      },
    }),
    db.game.upsert({
      where: { externalId_platform: { externalId: '21938', platform: Platform.RIOT_LOL } },
      update: {},
      create: {
        externalId: '21938',
        platform: Platform.RIOT_LOL,
        name: 'League of Legends',
        coverUrl: 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Ahri_0.jpg',
        genre: ['MOBA'],
        developer: 'Riot Games',
      },
    }),
  ])

  console.log(`✅ ${games.length} juegos de prueba creados`)

  console.log('\n🎉 Seed completado exitosamente!')
  console.log('\nUsuarios de prueba:')
  console.log('  alice@test.com — Nivel', calculateLevel(testXP), '— 12,500 XP')
  console.log('  bob@test.com   — Nivel', calculateLevel(8200), '— 8,200 XP')
  console.log('  carol@test.com — Nivel', calculateLevel(22000), '— 22,000 XP')
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })
