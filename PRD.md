# PRD — EntertainHub
## Gamified Entertainment Hub

**Versión:** 1.0  
**Fecha:** 2026-04-07  
**Stack objetivo:** Next.js 14 · TypeScript · Supabase · Prisma · Tailwind CSS  

---

## 1. Visión del Producto

**EntertainHub** es una plataforma centralizada que rastrea el consumo de entretenimiento digital del usuario (gaming + streaming), lo convierte en puntos de experiencia (XP) y niveles, y añade una capa social competitiva para interactuar con amigos.

### Propuesta de valor
- Un solo lugar para ver **todas tus horas** de entretenimiento
- Tu tiempo de ocio se convierte en **progresión gamificada** (XP, niveles, logros)
- Competencia amigable con amigos mediante **leaderboards en tiempo real**

---

## 2. Usuarios Objetivo

| Segmento | Descripción |
|---|---|
| Gamer casual | Juega 2-4 horas/día, usa Steam o consola |
| Gamer + Streamer | Combina gaming y series, quiere ver su balance total |
| Usuario social | Le importa la competencia con amigos, los rankings |
| Power user | Quiere estadísticas detalladas, gráficos y exportación |

---

## 3. Plataformas a Integrar

### 3.1 Gaming
| Plataforma | API | Estado | Notas |
|---|---|---|---|
| Steam | Steam Web API (pública) | ✅ Implementable | Requiere Steam API Key + SteamID64 |
| Riot Games | Riot Games API (pública) | ✅ Implementable | Requiere API Key por título |
| Epic Games | No tiene API pública | ⚠️ Workaround | Importación manual CSV o scraping autenticado |
| EA / Origin | API privada limitada | ⚠️ Workaround | Importación manual de historial |

### 3.2 Streaming
| Plataforma | API | Estado | Notas |
|---|---|---|---|
| Netflix | No tiene API pública | ⚠️ Workaround | Export de datos de cuenta (GDPR) + parsing |
| Disney+ | No tiene API pública | ⚠️ Workaround | Importación manual / extensión browser |
| Prime Video | No tiene API pública | ⚠️ Workaround | Importación manual |
| HBO Max / Max | No tiene API pública | ⚠️ Workaround | Importación manual |

### 3.3 Estrategia de integración de streaming
Dado que ninguna plataforma de streaming tiene API pública viable, se implementarán tres métodos:
1. **Importación CSV/JSON** — el usuario descarga su historial de la plataforma (Netflix permite esto vía Configuración > Descargar tus datos) y lo sube a EntertainHub
2. **Registro manual** — el usuario marca qué vio y cuánto tiempo
3. **Extensión de Chrome (v2)** — detecta reproducción activa y sincroniza automáticamente (fuera de MVP)

---

## 4. Sistema de XP y Niveles

### 4.1 Fórmula de XP
```
XP por minuto de gaming:   1.0 XP/min  (base)
XP por minuto de streaming: 0.8 XP/min (base)

Multiplicadores:
- Primera sesión del día:     x1.5
- Racha de 7 días seguidos:   x2.0
- Completar una serie:        +500 XP bonus
- Conseguir un logro en juego: +200 XP bonus
- Invitar un amigo:           +1000 XP bonus
```

### 4.2 Tabla de Niveles
```
Nivel 1:   0 – 1,000 XP       "Espectador Casual"
Nivel 2:   1,001 – 3,000 XP   "Jugador Regular"
Nivel 3:   3,001 – 7,000 XP   "Entusiasta"
Nivel 4:   7,001 – 15,000 XP  "Adicto al Entretenimiento"
Nivel 5:   15,001 – 30,000 XP "Maestro del Ocio"
Nivel 6:   30,001 – 60,000 XP "Leyenda Digital"
Nivel 7+:  60,001+ XP         "Inmortal del Entretenimiento"

Fórmula: XP requerido = 1000 * (nivel ^ 1.8)
```

### 4.3 Categorías de XP (separadas)
Cada usuario tiene XP y nivel **globales** pero también niveles por categoría:
- 🎮 **Gaming Level** — solo horas de juego
- 📺 **Streaming Level** — solo horas de contenido
- 🏆 **Total Level** — combinado (mostrado en perfil público)

---

## 5. Sistema Social

### 5.1 Perfil de Usuario
- Avatar (subida propia o generado)
- Username único + display name
- Nivel global + barra de XP
- Estadísticas públicas: horas totales, juego favorito, serie favorita
- Bio personalizable
- Fecha de miembro + racha actual

### 5.2 Sistema de Amigos
- Búsqueda por username
- Solicitud de amistad (enviar/aceptar/rechazar)
- Feed de actividad de amigos (qué están jugando/viendo ahora)
- Notificaciones: "TuAmigo subió al nivel 5", "TuAmigo te superó en el ranking"

### 5.3 Leaderboard
- **Global** — top 100 usuarios de toda la plataforma
- **Amigos** — ranking entre tus amigos (el más importante)
- **Semanal / Mensual / All-time**
- **Por categoría** — top gamers, top streamers
- Actualización en tiempo real (Supabase Realtime)

### 5.4 Logros (Achievements)
```
Logros de Gaming:
- "Primer Nivel" — Alcanzar nivel 2 en gaming
- "100 Horas" — Acumular 100h de gaming
- "Maratonista" — 8 horas seguidas de juego
- "Explorador" — Conectar 3 plataformas de gaming

Logros de Streaming:
- "Bingewatcher" — Ver 5 episodios seguidos
- "Cinéfilo" — 50 horas de películas
- "Adicto a las Series" — Completar 3 series completas

Logros Sociales:
- "Conectado" — Agregar primer amigo
- "Influencer" — 10 amigos en la plataforma
- "Top 10" — Entrar al top 10 de amigos
```

---

## 6. Features del Dashboard

### 6.1 Vista Principal (Home)
- **Tarjeta de perfil** — nivel actual, XP, barra de progreso al siguiente nivel
- **Resumen semanal** — horas gaming vs streaming en gráfico
- **Actividad reciente** — últimas sesiones registradas
- **Feed de amigos** — actividad en tiempo real
- **Logro más reciente** — último achievement desbloqueado

### 6.2 Mis Plataformas
- Lista de plataformas conectadas con estado de sync
- Botón "Sincronizar" por plataforma
- Última sync timestamp
- Horas totales por plataforma

### 6.3 Gaming Stats
- Top juegos por horas (bar chart)
- Horas por semana/mes (line chart)
- Por plataforma (Steam, Riot, etc.)
- Sesiones recientes con duración
- Logros de juegos sincronizados

### 6.4 Streaming Stats
- Top series/películas por tiempo
- Horas por plataforma (Netflix, Disney+, etc.)
- Géneros favoritos (pie chart)
- Historial de visualización

### 6.5 Social / Leaderboard
- Ranking de amigos con avatars y niveles
- Diferencia de XP respecto al usuario anterior/siguiente
- Top logros de amigos esta semana
- Botón "Retar a amigo" (notificación push)

### 6.6 Perfil Público
- URL pública: `entertainhub.app/u/username`
- Muestra stats públicos configurables
- Tarjeta compartible (imagen generada para redes)

---

## 7. Flujo de Autenticación

```
Registro:
1. Email + Password (NextAuth credentials)
2. OAuth: Google, Discord, Steam (Steam OpenID)
3. Onboarding: username, avatar, conectar primera plataforma

Login:
- Email/password
- OAuth providers
- "Recuérdame" (30 días)
```

---

## 8. Arquitectura Técnica

### Frontend
```
Next.js 14 (App Router)
TypeScript strict
Tailwind CSS + shadcn/ui
Zustand (estado global)
React Query / TanStack Query (data fetching + cache)
Recharts (gráficos)
Framer Motion (animaciones)
next-themes (dark mode)
```

### Backend
```
Next.js API Routes + Route Handlers
Prisma ORM
Supabase (PostgreSQL + Auth + Realtime + Storage)
Redis/Upstash (cache de leaderboard, rate limiting)
BullMQ + Redis (cola de jobs de sincronización)
```

### Infraestructura
```
Vercel (deploy frontend + serverless functions)
Supabase (database + auth + realtime)
Upstash Redis (cache)
Vercel Cron Jobs (sync automático cada 6h)
```

### Servicios externos
```
Steam Web API — horas de juego
Riot Games API — estadísticas de partidas
RAWG API — metadatos de juegos (imágenes, géneros)
TMDB API — metadatos de series/películas
Resend — emails transaccionales
Uploadthing — subida de avatares
```

---

## 9. Modelo de Datos (Prisma Schema)

```prisma
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  username      String    @unique
  displayName   String
  avatar        String?
  bio           String?
  totalXP       Int       @default(0)
  gamingXP      Int       @default(0)
  streamingXP   Int       @default(0)
  currentLevel  Int       @default(1)
  currentStreak Int       @default(0)
  lastActiveAt  DateTime?
  createdAt     DateTime  @default(now())
  
  platforms     UserPlatform[]
  gameSessions  GameSession[]
  watchSessions WatchSession[]
  achievements  UserAchievement[]
  sentRequests  FriendRequest[]   @relation("sender")
  receivedRequests FriendRequest[] @relation("receiver")
  friends       Friendship[]      @relation("userA")
  friendOf      Friendship[]      @relation("userB")
}

model UserPlatform {
  id           String   @id @default(cuid())
  userId       String
  platform     Platform
  platformUserId String
  accessToken  String?
  refreshToken String?
  lastSyncAt   DateTime?
  isActive     Boolean  @default(true)
  
  user         User     @relation(fields: [userId], references: [id])
  
  @@unique([userId, platform])
}

enum Platform {
  STEAM
  RIOT
  EPIC
  EA
  NETFLIX
  DISNEY_PLUS
  PRIME_VIDEO
  HBO_MAX
  MANUAL
}

model GameSession {
  id          String   @id @default(cuid())
  userId      String
  gameId      String
  platform    Platform
  startedAt   DateTime
  endedAt     DateTime
  durationMin Int
  xpEarned    Int
  
  user        User     @relation(fields: [userId], references: [id])
  game        Game     @relation(fields: [gameId], references: [id])
}

model Game {
  id          String   @id @default(cuid())
  externalId  String
  platform    Platform
  name        String
  coverUrl    String?
  genre       String?
  
  sessions    GameSession[]
  
  @@unique([externalId, platform])
}

model WatchSession {
  id          String      @id @default(cuid())
  userId      String
  contentId   String
  platform    Platform
  startedAt   DateTime
  endedAt     DateTime
  durationMin Int
  xpEarned    Int
  
  user        User        @relation(fields: [userId], references: [id])
  content     Content     @relation(fields: [contentId], references: [id])
}

model Content {
  id          String      @id @default(cuid())
  externalId  String
  platform    Platform
  title       String
  type        ContentType
  posterUrl   String?
  genre       String?
  
  sessions    WatchSession[]
  
  @@unique([externalId, platform])
}

enum ContentType {
  MOVIE
  SERIES
  EPISODE
  SHORT
}

model Achievement {
  id          String  @id @default(cuid())
  key         String  @unique
  name        String
  description String
  iconUrl     String?
  xpReward    Int
  
  unlocks     UserAchievement[]
}

model UserAchievement {
  id            String      @id @default(cuid())
  userId        String
  achievementId String
  unlockedAt    DateTime    @default(now())
  
  user          User        @relation(fields: [userId], references: [id])
  achievement   Achievement @relation(fields: [achievementId], references: [id])
  
  @@unique([userId, achievementId])
}

model Friendship {
  id        String   @id @default(cuid())
  userAId   String
  userBId   String
  createdAt DateTime @default(now())
  
  userA     User     @relation("userA", fields: [userAId], references: [id])
  userB     User     @relation("userB", fields: [userBId], references: [id])
  
  @@unique([userAId, userBId])
}

model FriendRequest {
  id         String              @id @default(cuid())
  senderId   String
  receiverId String
  status     FriendRequestStatus @default(PENDING)
  createdAt  DateTime            @default(now())
  
  sender     User @relation("sender", fields: [senderId], references: [id])
  receiver   User @relation("receiver", fields: [receiverId], references: [id])
}

enum FriendRequestStatus {
  PENDING
  ACCEPTED
  REJECTED
}
```

---

## 10. Roadmap

### MVP (v1.0) — 8 semanas
- [ ] Auth completo (email + Google + Discord)
- [ ] Perfil de usuario y onboarding
- [ ] Integración Steam (API oficial)
- [ ] Integración Riot Games (LoL, Valorant)
- [ ] Importación manual para streaming (CSV Netflix)
- [ ] Sistema XP + niveles
- [ ] Dashboard con stats básicos
- [ ] Sistema de amigos básico
- [ ] Leaderboard de amigos
- [ ] 10 logros básicos

### v1.1 — 4 semanas post-MVP
- [ ] Integración Epic Games (import manual)
- [ ] Import Disney+, Prime Video, HBO
- [ ] Logros avanzados (50 total)
- [ ] Notificaciones en tiempo real
- [ ] Perfil público compartible
- [ ] Tarjeta de stats para redes sociales

### v2.0 — Futuro
- [ ] Extensión de Chrome para tracking automático de streaming
- [ ] App móvil (React Native)
- [ ] Desafíos entre amigos
- [ ] Temporadas / resets estacionales
- [ ] Integración PlayStation Network
- [ ] Integración Xbox / Game Pass

---

## 11. Métricas de Éxito

| Métrica | Objetivo MVP |
|---|---|
| Usuarios registrados | 500 en primer mes |
| Plataformas conectadas por usuario | ≥ 2 |
| DAU/MAU | > 20% |
| Tiempo en plataforma | > 5 min/día |
| Amigos promedio por usuario | ≥ 3 |
| Retención 30 días | > 40% |

---

## 12. Consideraciones de Seguridad

- **OAuth tokens** — guardados encriptados en DB (AES-256)
- **Rate limiting** — por IP en endpoints de auth y sync
- **GDPR** — opción de exportar y borrar datos de cuenta
- **API Keys** — nunca expuestas en cliente, siempre server-side
- **Validación** — Zod en todos los endpoints de API
- **RLS** — Row Level Security en Supabase para aislar datos de usuarios
