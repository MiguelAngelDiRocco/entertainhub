# CONTEXT.md — EntertainHub

Contexto completo del proyecto para agentes de IA (Claude Code, Cursor, Windsurf, etc.)

---

## ¿Qué es EntertainHub?

Una aplicación web full-stack que actúa como **hub central de entretenimiento gamificado**. El usuario conecta sus cuentas de gaming (Steam, Riot, Epic, EA) y streaming (Netflix, Disney+, Prime Video, HBO Max), y la plataforma:

1. **Rastrea** automáticamente horas de juego y visualización
2. **Convierte** ese tiempo en XP (puntos de experiencia) y niveles
3. **Gamifica** la experiencia con logros (achievements) desbloqueables
4. **Conecta** socialmente con amigos mediante rankings y actividad en tiempo real

---

## Estado Actual del Proyecto

🔴 **Fase:** Inicio — aún no hay código escrito  
📋 **Prioridad:** Implementar MVP completo  
🎯 **Objetivo inmediato:** Scaffold inicial + Auth + Integración Steam  

### Checklist de MVP
- [ ] Scaffold Next.js 14 + TypeScript + Tailwind + shadcn/ui
- [ ] Configurar Prisma + Supabase
- [ ] Auth con NextAuth (email + Google + Discord)
- [ ] Onboarding de usuario
- [ ] Integración Steam API
- [ ] Integración Riot Games API
- [ ] Sistema XP + Niveles
- [ ] Dashboard home
- [ ] Gaming stats page
- [ ] Streaming import (Netflix CSV)
- [ ] Sistema de amigos
- [ ] Leaderboard
- [ ] 10 logros base

---

## Decisiones de Diseño Importantes

### ¿Por qué Next.js App Router?
- Server Components reducen JavaScript del cliente
- Route Groups para separar auth/dashboard limpiamente
- API Routes colocadas junto a la UI que las consume
- Mejor SEO para perfiles públicos

### ¿Por qué Supabase sobre PlanetScale/Neon?
- Incluye Realtime out-of-the-box (crítico para el leaderboard en vivo)
- Auth integrada (usaremos NextAuth sobre ella, pero Supabase Storage para avatares)
- Row Level Security para aislar datos de usuarios fácilmente
- Plan gratuito generoso para MVP

### ¿Por qué no hay API pública para streaming?
Netflix, Disney+, Prime Video y HBO Max no tienen APIs públicas para developers.
La estrategia es:
- **Corto plazo (MVP):** Importación manual de CSV/JSON que el usuario puede descargar desde su cuenta
- **Mediano plazo:** Extensión de Chrome que detecta reproducción
- **Documentar claramente** en onboarding por qué se necesita importación manual

### ¿Por qué Zustand + TanStack Query en lugar de solo Context?
- Zustand para estado de UI (sidebar abierto/cerrado, modal activo, etc.)
- TanStack Query para estado del servidor (datos de API, cache, refetch)
- Esta separación evita re-renders innecesarios

---

## Flujos Críticos de Usuario

### 1. Conectar Steam
```
Usuario va a /platforms
→ Click "Conectar Steam"
→ Input: Steam API Key + SteamID64 (o buscar por vanity URL)
→ Backend valida con Steam API
→ Primer sync: trae todos los juegos y horas
→ Guarda en UserPlatform + GameSessions históricas
→ Calcula y asigna XP por historial
→ Muestra: "Conectado! Importamos X juegos y Y horas"
```

### 2. Importar Netflix
```
Usuario va a /platforms → "Importar Netflix"
→ Instrucciones: cómo descargar historial de Netflix
→ Upload del archivo ViewingActivity.csv
→ Backend parsea CSV: Title, Date
→ Por cada título: busca duración en TMDB
→ Crea WatchSessions
→ Calcula XP
→ Muestra resumen: "X series, Y películas, Z horas importadas"
```

### 3. Agregar Amigo
```
Usuario busca por username en /social
→ Encuentra perfil
→ Click "Agregar amigo"
→ Se crea FriendRequest (status: PENDING)
→ El otro usuario recibe notificación
→ Acepta → se crea Friendship bidireccional
→ Ahora aparece en el leaderboard de amigos del otro
```

### 4. Subir de Nivel
```
Usuario gana XP (por sesión de juego o import)
→ Backend recalcula nivel actual
→ Si nuevo nivel > nivel anterior:
  → Actualizar User.currentLevel en DB
  → Emitir evento de Supabase Realtime
  → Frontend muestra animación "¡Subiste al nivel X!"
  → Verificar si desbloqueó algún logro por nivel
  → Notificar a amigos (opcional, configurable)
```

---

## APIs Externas — Referencias

### Steam Web API
```
Base URL: https://api.steampowered.com
Docs: https://steamcommunity.com/dev

Endpoints clave:
GET /ISteamUser/GetPlayerSummaries/v2/
  ?key={STEAM_API_KEY}&steamids={STEAMID64}
  → Devuelve: nombre, avatar, profileurl

GET /IPlayerService/GetOwnedGames/v1/
  ?key={STEAM_API_KEY}&steamid={STEAMID64}&include_appinfo=1&include_played_free_games=1
  → Devuelve: array de juegos con playtime_forever (minutos)

GET /IPlayerService/GetRecentlyPlayedGames/v1/
  ?key={STEAM_API_KEY}&steamid={STEAMID64}&count=10
  → Devuelve: juegos jugados en las últimas 2 semanas

Límites: 100,000 requests/día por API key
```

### Riot Games API
```
Base URL: https://{region}.api.riotgames.com
Docs: https://developer.riotgames.com/apis

Endpoints clave:
GET /riot/account/v1/accounts/by-riot-id/{gameName}/{tagLine}
  Header: X-Riot-Token: {API_KEY}
  → Devuelve: puuid, gameName, tagLine

GET /lol/match/v5/matches/by-puuid/{puuid}/ids
  ?start=0&count=20
  → IDs de partidas recientes de LoL

GET /lol/match/v5/matches/{matchId}
  → Detalles de partida (duración, campeón, resultado)

Límites: 20 req/s, 100 req/2min (Development key)
Nota: Producción requiere solicitar Production API Key
```

### RAWG API (metadatos de juegos)
```
Base URL: https://api.rawg.io/api
Docs: https://rawg.io/apidocs

GET /games?key={KEY}&search={nombre_juego}
  → Metadatos: imagen, géneros, plataformas, rating

GET /games/{id}?key={KEY}
  → Detalle de juego
```

### TMDB API (metadatos de series/películas)
```
Base URL: https://api.themoviedb.org/3
Docs: https://developer.themoviedb.org

GET /search/multi?query={titulo}&api_key={KEY}
  → Busca en movies + TV shows

GET /movie/{id}?api_key={KEY}
  → runtime (duración en minutos)

GET /tv/{id}?api_key={KEY}
  → episode_run_time[]

GET /tv/{series_id}/season/{season_number}/episode/{episode_number}?api_key={KEY}
  → runtime del episodio específico
```

---

## Paleta de Colores del Proyecto

```css
/* EntertainHub Brand Colors */
--color-brand-primary:   #6366f1;  /* Indigo - principal */
--color-brand-secondary: #8b5cf6;  /* Violet */
--color-brand-accent:    #06b6d4;  /* Cyan */
--color-xp-gold:         #f59e0b;  /* XP bars y niveles */
--color-level-bronze:    #92400e;
--color-level-silver:    #6b7280;
--color-level-gold:      #d97706;
--color-level-platinum:  #6366f1;
--color-gaming:          #22c55e;  /* Verde para gaming stats */
--color-streaming:       #ef4444;  /* Rojo para streaming stats */

/* Dark mode first */
--bg-base:      #0f0f13;
--bg-surface:   #1a1a24;
--bg-elevated:  #242436;
--text-primary: #f0f0f5;
--text-muted:   #8888aa;
```

---

## Convenciones de Naming en DB

```
Tablas:           PascalCase (User, GameSession, WatchSession)
Columnas:         camelCase (userId, totalXP, createdAt)
Enums:            SCREAMING_SNAKE_CASE (STEAM, DISNEY_PLUS)
Índices:          idx_{tabla}_{columna} (idx_game_session_user_id)
```

---

## Guía de Contribución para Claude Code

Cuando generes código para este proyecto:

1. **Lee CLAUDE.md primero** — contiene todas las convenciones
2. **Verifica el schema de Prisma** antes de escribir queries
3. **No hardcodear** API keys, URLs o configuración — usar env vars
4. **Server-first** — pensar si un componente necesita ser client antes de agregar `"use client"`
5. **Manejo de errores** — siempre manejar casos de error, especialmente en integraciones externas
6. **Comentarios en español** — este es un proyecto hispanohablante
7. **Commits semánticos** — `feat:`, `fix:`, `refactor:`, `docs:`, `chore:`

---

## Recursos Útiles

- [Next.js 14 App Router Docs](https://nextjs.org/docs)
- [Prisma ORM Docs](https://www.prisma.io/docs)
- [Supabase Docs](https://supabase.com/docs)
- [TanStack Query Docs](https://tanstack.com/query/latest)
- [shadcn/ui Components](https://ui.shadcn.com)
- [Steam API Docs](https://steamcommunity.com/dev)
- [Riot Developer Portal](https://developer.riotgames.com)
- [TMDB API Docs](https://developer.themoviedb.org)
