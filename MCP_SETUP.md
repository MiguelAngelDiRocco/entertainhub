# MCP_SETUP.md — Servidores MCP y Herramientas para Claude Code

Guía completa de MCPs, plugins y herramientas para usar con Claude Code
en el desarrollo de EntertainHub.

---

## ¿Qué es MCP?

Model Context Protocol (MCP) es el estándar que permite a Claude Code
conectarse con herramientas externas, bases de datos, y servicios de forma
nativa. Los MCPs que instales estarán disponibles directamente dentro de
tu sesión de Claude Code.

---

## MCPs Recomendados para EntertainHub

### 1. Supabase MCP ⭐ CRÍTICO
Permite a Claude Code leer el schema de tu base de datos, ejecutar queries,
ver tablas y registros directamente sin salir del IDE.

```json
{
  "mcpServers": {
    "supabase": {
      "command": "npx",
      "args": ["-y", "@supabase/mcp-server-supabase@latest"],
      "env": {
        "SUPABASE_URL": "tu-supabase-url",
        "SUPABASE_SERVICE_ROLE_KEY": "tu-service-role-key"
      }
    }
  }
}
```

**Qué hace por ti:**
- Claude puede ver el schema real de tu DB mientras genera código
- Puede verificar si una migración tiene sentido antes de ejecutarla
- Puede debuggear queries lentas directamente

**Instalar:**
```bash
npm install -g @supabase/mcp-server-supabase
```

---

### 2. Prisma MCP ⭐ CRÍTICO
Introspección del schema de Prisma y generación de queries optimizadas.

```json
{
  "mcpServers": {
    "prisma": {
      "command": "npx",
      "args": ["prisma-mcp"],
      "env": {
        "DATABASE_URL": "tu-database-url"
      }
    }
  }
}
```

**Qué hace por ti:**
- Claude lee tu schema.prisma en tiempo real
- Genera queries Prisma correctas basadas en tu schema actual
- Detecta relaciones y genera includes correctos

**Instalar:**
```bash
npm install -g prisma-mcp
```

---

### 3. Filesystem MCP ⭐ INCLUIDO EN CLAUDE CODE
Acceso al sistema de archivos del proyecto. Ya viene incluido en Claude Code
pero conviene configurar los permisos explícitamente.

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/ruta/a/tu/proyecto/entertainhub"
      ]
    }
  }
}
```

---

### 4. GitHub MCP ⭐ MUY RECOMENDADO
Para manejar el repositorio, crear PRs, revisar issues y branches.

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_..."
      }
    }
  }
}
```

**Qué hace por ti:**
- Crear branches y commits desde Claude Code
- Revisar y crear issues
- Ver el historial de cambios del proyecto
- Crear PRs automáticamente

**Obtener token:** github.com/settings/tokens (scopes: repo, workflow)

---

### 5. Brave Search MCP — Para investigación de APIs
Útil cuando Claude necesita buscar documentación actualizada de Steam API,
Riot Games API, etc.

```json
{
  "mcpServers": {
    "brave-search": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-brave-search"],
      "env": {
        "BRAVE_API_KEY": "tu-brave-api-key"
      }
    }
  }
}
```

**Obtener key:** brave.com/search/api (tier gratuito: 2000 queries/mes)

---

### 6. Fetch MCP — Para probar APIs externas
Permite a Claude hacer llamadas HTTP directamente para verificar respuestas
de Steam API, Riot API, TMDB, etc. sin escribir código de prueba.

```json
{
  "mcpServers": {
    "fetch": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-fetch"]
    }
  }
}
```

**Uso típico:** "Claude, prueba este endpoint de Steam API con mi key y dime qué devuelve"

---

### 7. Upstash MCP — Para Redis/Cache
Si usas Upstash Redis para el cache del leaderboard.

```json
{
  "mcpServers": {
    "upstash": {
      "command": "npx",
      "args": ["-y", "@upstash/mcp-server"],
      "env": {
        "UPSTASH_REDIS_REST_URL": "tu-url",
        "UPSTASH_REDIS_REST_TOKEN": "tu-token"
      }
    }
  }
}
```

---

## Configuración en Claude Code (claude_desktop_config.json)

Archivo final con todos los MCPs configurados:

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/Users/TU_USUARIO/projects/entertainhub"
      ]
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_TU_TOKEN"
      }
    },
    "supabase": {
      "command": "npx",
      "args": ["-y", "@supabase/mcp-server-supabase@latest"],
      "env": {
        "SUPABASE_URL": "https://TU_PROJECT.supabase.co",
        "SUPABASE_SERVICE_ROLE_KEY": "eyJ..."
      }
    },
    "fetch": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-fetch"]
    },
    "brave-search": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-brave-search"],
      "env": {
        "BRAVE_API_KEY": "BSA_TU_KEY"
      }
    }
  }
}
```

**Ubicación del archivo según OS:**
```
macOS:   ~/Library/Application Support/Claude/claude_desktop_config.json
Windows: %APPDATA%\Claude\claude_desktop_config.json
Linux:   ~/.config/claude/claude_desktop_config.json
```

---

## Extensiones VS Code / Cursor / Windsurf Recomendadas

### Para TypeScript/Next.js
```
dbaeumer.vscode-eslint              ESLint integration
esbenp.prettier-vscode              Prettier formatter
bradlc.vscode-tailwindcss           Tailwind CSS IntelliSense
ms-playwright.playwright            Playwright Test runner
Prisma.prisma                       Prisma schema highlighting + format
```

### Para productividad
```
eamodio.gitlens                     Git history y blame
christian-kohler.npm-intellisense   Autocompletar imports npm
formulahendry.auto-rename-tag       Rename JSX tags en par
```

### Configuración recomendada (.vscode/settings.json)
```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "tailwindCSS.experimental.classRegex": [
    ["cn\\(([^)]*)\\)", "'([^']*)'"]
  ],
  "typescript.preferences.importModuleSpecifier": "non-relative",
  "typescript.tsdk": "node_modules/typescript/lib"
}
```

---

## Herramientas CLI Necesarias

### Instalación global
```bash
# Package manager (usar bun para velocidad)
npm install -g bun

# Prisma CLI
npm install -g prisma

# Supabase CLI
npm install -g supabase

# Vercel CLI (para deploy)
npm install -g vercel

# Shadcn CLI (se usa con npx, no necesita global)
# npx shadcn@latest add [component]
```

### Setup inicial del proyecto
```bash
# 1. Crear proyecto Next.js
npx create-next-app@latest entertainhub \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir=false \
  --import-alias="@/*"

cd entertainhub

# 2. Instalar dependencias core
npm install \
  @prisma/client prisma \
  next-auth@beta \
  @auth/prisma-adapter \
  zod \
  zustand \
  @tanstack/react-query \
  @supabase/supabase-js \
  @upstash/redis \
  recharts \
  framer-motion \
  date-fns \
  lucide-react \
  clsx tailwind-merge

# 3. Instalar shadcn/ui
npx shadcn@latest init

# 4. Agregar componentes shadcn esenciales
npx shadcn@latest add \
  button card badge avatar \
  dialog sheet tabs \
  progress tooltip \
  dropdown-menu separator \
  input label form \
  skeleton toast

# 5. Inicializar Prisma
npx prisma init

# 6. Setup Supabase (requiere supabase CLI)
supabase login
supabase init
supabase start   # Para desarrollo local
```

---

## Primer Prompt para Claude Code

Una vez configurado todo, usar este prompt inicial:

```
Leé los archivos CLAUDE.md, PRD.md y CONTEXT.md en la raíz del proyecto.

Luego, implementá el scaffold inicial de EntertainHub con:

1. Configuración completa de Prisma con el schema del PRD (todas las tablas)
2. Configuración de NextAuth con providers: Credentials, Google, Discord  
3. Layout del dashboard con sidebar (íconos: Home, Gaming, Streaming, Social, Platforms, Profile)
4. Página de home del dashboard con:
   - Tarjeta de perfil con nivel y barra de XP (datos mock por ahora)
   - 4 stat cards: horas totales gaming, horas totales streaming, nivel global, amigos
   - Sección "Actividad reciente" (empty state con CTA para conectar plataformas)
5. El lib/xp.ts con las funciones del CLAUDE.md

Usá el stack definido en CLAUDE.md. Dark mode por defecto. 
Paleta de colores: indigo/violet como primary, fondo oscuro (#0f0f13).
```

---

## Orden de Implementación Recomendado

Seguir este orden para evitar dependencias circulares:

```
Semana 1:
├── Scaffold + configuración base
├── Schema Prisma + migraciones
├── NextAuth (email + OAuth)
└── Onboarding flow

Semana 2:
├── lib/xp.ts (sistema XP)
├── API: /api/sessions (registrar sesiones)
├── Integración Steam
└── Dashboard home básico

Semana 3:
├── Gaming stats page
├── Integración Riot Games
├── Sistema de logros base
└── Notificaciones básicas

Semana 4:
├── Importación CSV Netflix
├── Streaming stats page
├── TMDB integration para metadatos
└── Perfiles de usuario

Semana 5:
├── Sistema de amigos
├── Leaderboard (con Redis cache)
├── Supabase Realtime para actualizaciones
└── Actividad feed

Semana 6-7:
├── Polish UI/UX
├── Responsive mobile
├── Tests (unit + E2E)
└── Deploy en Vercel

Semana 8:
├── QA completo
├── Documentación usuario
└── Launch
```
