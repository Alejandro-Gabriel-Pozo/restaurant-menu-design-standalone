/**
 * Valida que un string sea un color CSS seguro antes de inyectarlo en un <style>.
 * Acepta: hex (#rgb, #rrggbb, #rrggbbaa), rgb(), rgba(), hsl(), hsla(),
 *         oklch(), oklab(), nombres CSS (solo letras), y los alias 'claro'/'oscuro'.
 * Rechaza cualquier valor con ; { } < > comillas u otros caracteres peligrosos.
 * Devuelve el valor limpio o null si no es válido.
 */
export function sanitizeCssColor(value: string): string | null {
  if (!value) return null
  const v = value.trim()

  // Bloquear caracteres peligrosos para CSS injection
  if (/[;{}"'<>\\]/.test(v)) return null

  // Alias locales
  const lower = v.toLowerCase()
  if (lower === "claro" || lower === "oscuro") return v

  // Hex: #rgb, #rgba, #rrggbb, #rrggbbaa
  if (/^#[0-9a-fA-F]{3,8}$/.test(v)) return v

  // Funciones de color CSS: rgb(), rgba(), hsl(), hsla(), oklch(), oklab(), color()
  // Permite dígitos, letras, espacios, comas, puntos, porcentajes, barras, guiones
  if (/^(rgb|rgba|hsl|hsla|oklch|oklab|color)\([\d\s,./a-zA-Z%+-]+\)$/i.test(v)) return v

  // Nombres CSS: solo letras (ej: "red", "transparent", "currentColor")
  if (/^[a-zA-Z]+$/.test(v)) return v

  return null
}

/** Acepta 'claro', 'oscuro' o cualquier color CSS válido */
export function resolveHeroInk(value: string): string | null {
  if (!value) return null
  const v = value.trim().toLowerCase()
  if (v === "claro")  return "oklch(0.96 0.005 80)"
  if (v === "oscuro") return "oklch(0.18 0.02 40)"
  return sanitizeCssColor(value)
}

/**
 * Dado un color de marca (hex o rgb()), devuelve el color de texto
 * que garantiza contraste WCAG AA sobre ese fondo.
 * Soporta: #rrggbb, #rgb, rgb(r,g,b).
 * Para formatos no parseables (oklch, hsl, nombres CSS) devuelve null
 * y se deja el valor hardcodeado de globals.css.
 */
export function resolvePrimaryForeground(color: string): string | null {
  if (!color) return null
  const v = color.trim().toLowerCase()

  let r: number, g: number, b: number

  // #rrggbb
  const hex6 = v.match(/^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/)
  if (hex6) {
    r = parseInt(hex6[1], 16)
    g = parseInt(hex6[2], 16)
    b = parseInt(hex6[3], 16)
  } else {
    // #rgb
    const hex3 = v.match(/^#([0-9a-f])([0-9a-f])([0-9a-f])$/)
    if (hex3) {
      r = parseInt(hex3[1] + hex3[1], 16)
      g = parseInt(hex3[2] + hex3[2], 16)
      b = parseInt(hex3[3] + hex3[3], 16)
    } else {
      // rgb(r, g, b)
      const rgbMatch = v.match(/^rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/)
      if (rgbMatch) {
        r = parseInt(rgbMatch[1])
        g = parseInt(rgbMatch[2])
        b = parseInt(rgbMatch[3])
      } else {
        // formato no soportado (oklch, hsl, nombre CSS) — no inyectar
        return null
      }
    }
  }

  // Luminancia relativa WCAG 2.1
  const toLinear = (c: number) => {
    const s = c / 255
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4)
  }
  const L = 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b)

  // Contraste contra blanco vs oscuro — elegir el mayor
  const contrastLight = (L + 0.05) / (0.05)
  const contrastDark  = (1.05)     / (L + 0.05)

  return contrastDark >= contrastLight
    ? "oklch(0.96 0.005 80)"
    : "oklch(0.18 0.02 40)"
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
