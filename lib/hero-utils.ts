/** Acepta 'claro', 'oscuro' o cualquier color CSS válido */
export function resolveHeroInk(value: string): string | null {
  if (!value) return null
  const v = value.trim().toLowerCase()
  if (v === "claro")  return "oklch(0.96 0.005 80)"
  if (v === "oscuro") return "oklch(0.18 0.02 40)"
  return value.trim()
}

/**
 * Convierte 'top-left' | 'top-center' | ... en clases Tailwind para flex absoluto.
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

/**
 * Interpreta como verdadero: true, "true", "TRUE", "True", "si", "sí", "yes", "1"
 * Cubre todos los formatos posibles que Google Sheets puede devolver.
 */
export function isTruthy(value: string): boolean {
  const v = value.trim().toLowerCase()
  return v === "true" || v === "si" || v === "sí" || v === "yes" || v === "1"
}
