// lib/xp.ts
// Sistema de XP y Niveles de EntertainHub
// Este archivo es el núcleo del sistema de gamificación

// ============================================================
// CONSTANTES
// ============================================================

export const XP_RATES = {
  GAMING_PER_MINUTE: 1.0,
  STREAMING_PER_MINUTE: 0.8,
} as const

export const XP_MULTIPLIERS = {
  FIRST_SESSION_OF_DAY: 1.5,
  STREAK_7_DAYS: 2.0,
  STREAK_30_DAYS: 3.0,
} as const

export const XP_BONUSES = {
  COMPLETE_SERIES: 500,
  COMPLETE_GAME: 300,
  ACHIEVEMENT_UNLOCK: 200,
  INVITE_FRIEND: 1000,
  FRIEND_JOINS: 500,
  DAILY_LOGIN: 50,
} as const

export const LEVEL_NAMES: Record<number, string> = {
  1: 'Espectador Casual',
  2: 'Jugador Regular',
  3: 'Entusiasta',
  4: 'Adicto al Entretenimiento',
  5: 'Maestro del Ocio',
  6: 'Leyenda Digital',
  7: 'Inmortal del Entretenimiento',
  8: 'Semidiós del Ocio',
  9: 'Dios del Entretenimiento',
  10: 'El Elegido',
}

// ============================================================
// FUNCIONES DE NIVELES
// ============================================================

/**
 * Calcula cuánto XP se necesita para alcanzar un nivel específico
 * Usa curva exponencial: 1000 * nivel^1.8
 */
export function xpRequiredForLevel(level: number): number {
  if (level <= 1) return 0
  return Math.floor(1000 * Math.pow(level, 1.8))
}

/**
 * Calcula el nivel actual basado en XP total
 */
export function calculateLevel(totalXP: number): number {
  if (totalXP <= 0) return 1
  let level = 1
  while (xpRequiredForLevel(level + 1) <= totalXP) {
    level++
    if (level >= 100) break // Cap máximo de nivel
  }
  return level
}

/**
 * Calcula el progreso dentro del nivel actual
 * Retorna: XP actual en el nivel, XP necesario para el siguiente, porcentaje
 */
export function xpProgressInLevel(totalXP: number): {
  current: number
  required: number
  percentage: number
  level: number
  nextLevel: number
} {
  const level = calculateLevel(totalXP)
  const xpForCurrentLevel = xpRequiredForLevel(level)
  const xpForNextLevel = xpRequiredForLevel(level + 1)

  const current = totalXP - xpForCurrentLevel
  const required = xpForNextLevel - xpForCurrentLevel
  const percentage = Math.min(Math.floor((current / required) * 100), 100)

  return {
    current,
    required,
    percentage,
    level,
    nextLevel: level + 1,
  }
}

/**
 * Obtiene el nombre del nivel
 */
export function getLevelName(level: number): string {
  return LEVEL_NAMES[Math.min(level, 10)] ?? `Nivel ${level}`
}

/**
 * Obtiene el color asociado al nivel (para UI)
 */
export function getLevelColor(level: number): string {
  if (level >= 8) return '#a855f7' // Morado - Divino
  if (level >= 6) return '#6366f1' // Indigo - Platino
  if (level >= 4) return '#d97706' // Amber - Oro
  if (level >= 2) return '#6b7280' // Gris - Plata
  return '#92400e'                  // Marrón - Bronce
}

// ============================================================
// CÁLCULO DE XP POR SESIÓN
// ============================================================

type SessionMultipliers = {
  isFirstOfDay: boolean
  hasStreak7: boolean
  hasStreak30: boolean
}

/**
 * Calcula el XP ganado por una sesión de gaming
 */
export function calculateGamingXP(
  durationMinutes: number,
  multipliers: SessionMultipliers = { isFirstOfDay: false, hasStreak7: false, hasStreak30: false }
): number {
  if (durationMinutes <= 0) return 0

  let xp = durationMinutes * XP_RATES.GAMING_PER_MINUTE

  if (multipliers.isFirstOfDay) {
    xp *= XP_MULTIPLIERS.FIRST_SESSION_OF_DAY
  }

  // Los multiplicadores de streak se aplican uno a la vez (el mayor gana)
  if (multipliers.hasStreak30) {
    xp *= XP_MULTIPLIERS.STREAK_30_DAYS
  } else if (multipliers.hasStreak7) {
    xp *= XP_MULTIPLIERS.STREAK_7_DAYS
  }

  return Math.floor(xp)
}

/**
 * Calcula el XP ganado por una sesión de streaming
 */
export function calculateStreamingXP(
  durationMinutes: number,
  multipliers: SessionMultipliers = { isFirstOfDay: false, hasStreak7: false, hasStreak30: false }
): number {
  if (durationMinutes <= 0) return 0

  let xp = durationMinutes * XP_RATES.STREAMING_PER_MINUTE

  if (multipliers.isFirstOfDay) {
    xp *= XP_MULTIPLIERS.FIRST_SESSION_OF_DAY
  }

  if (multipliers.hasStreak30) {
    xp *= XP_MULTIPLIERS.STREAK_30_DAYS
  } else if (multipliers.hasStreak7) {
    xp *= XP_MULTIPLIERS.STREAK_7_DAYS
  }

  return Math.floor(xp)
}

// ============================================================
// UTILIDADES DE DISPLAY
// ============================================================

/**
 * Formatea XP para mostrar en UI
 * 1500 → "1,500 XP"
 * 1500000 → "1.5M XP"
 */
export function formatXP(xp: number): string {
  if (xp >= 1_000_000) {
    return `${(xp / 1_000_000).toFixed(1)}M XP`
  }
  if (xp >= 1_000) {
    return `${xp.toLocaleString()} XP`
  }
  return `${xp} XP`
}

/**
 * Formatea minutos a display legible
 * 90 → "1h 30m"
 * 45 → "45m"
 * 3000 → "50h"
 */
export function formatMinutes(minutes: number): string {
  if (minutes < 60) return `${minutes}m`
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  if (mins === 0) return `${hours}h`
  return `${hours}h ${mins}m`
}

/**
 * Calcula XP necesario para el próximo nivel desde XP actual
 */
export function xpToNextLevel(totalXP: number): number {
  const level = calculateLevel(totalXP)
  const xpForNextLevel = xpRequiredForLevel(level + 1)
  return xpForNextLevel - totalXP
}

// ============================================================
// VALIDACIONES
// ============================================================

/**
 * Tabla de niveles completa para mostrar en UI
 */
export function getLevelTable(upToLevel: number = 10) {
  return Array.from({ length: upToLevel }, (_, i) => {
    const level = i + 1
    return {
      level,
      name: getLevelName(level),
      xpRequired: xpRequiredForLevel(level),
      color: getLevelColor(level),
    }
  })
}
