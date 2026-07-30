/** Acepta 'claro', 'oscuro' o cualquier color CSS válido */
export function resolveHeroInk(value: string): string | null {
  if (!value) return null
  const v = value.trim().toLowerCase()
  if (v === "claro")  return "oklch(0.96 0.005 80)"
  if (v === "oscuro") return "oklch(0.18 0.02 40)"
  return value.trim()
}

/**
 * Convierte 'top-left' | 'top-center' | 'top-right'
 *           'center-left' | 'center' | 'center-right'
 *           'bottom-left' | 'bottom-center' | 'bottom-right'
 * en clases Tailwind para un contenedor flex absoluto.
 */
export function resolvePosClasses(pos: string): string {
  const map: Record<string, string> = {
    "top-left":      "items-start justify-start  text-left",
    "top-center":    "items-start justify-center text-center",
    "top-right":     "items-start justify-end    text-right",
    "center-left":   "items-center justify-start  text-left",
    "center":        "items-center justify-center text-center",
    "center-right":  "items-center justify-end    text-right",
    "bottom-left":   "items-end justify-start  text-left",
    "bottom-center": "items-end justify-center text-center",
    "bottom-right":  "items-end justify-end    text-right",
  }
  return map[pos.trim().toLowerCase()] ?? map["center"]
}
