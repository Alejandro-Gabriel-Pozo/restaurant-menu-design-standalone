/**
 * lib/format-utils.ts
 *
 * Utilidades de formato puras — sin server-only.
 * Seguras para importar desde Client Components y Server Components.
 *
 * normFuente y formatPrecio vivían en get-config.ts, que tiene
 * `import "server-only"`. Turbopack rechaza importar ese módulo desde
 * la cadena: CartaControls (use client) → CartaTopbar → normFuente.
 */
import type { SiteConfig } from "./get-config"

/**
 * Normaliza un valor de fuente: si es sólo número (ej. "14") le agrega
 * "px"; si ya tiene unidades ("0.9rem", "clamp(...)") lo deja igual.
 */
export function normFuente(val: string): string {
  if (!val) return ""
  return /^\d+(\.\d+)?$/.test(val.trim()) ? `${val.trim()}px` : val.trim()
}

/**
 * Formatea un precio según la configuración del restaurante.
 * Usa precio_locale, precio_simbolo y precio_posicion.
 */
export function formatPrecio(
  raw: string | number,
  config: Pick<SiteConfig, "precio_simbolo" | "precio_locale" | "precio_posicion">,
): string {
  const str = String(raw ?? "").trim()
  if (!str) return ""
  const num = Number(str.replace(/[^0-9.,-]/g, "").replace(",", "."))
  if (isNaN(num)) return str
  const formatted = num.toLocaleString(config.precio_locale || "es-AR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })
  const simbolo = config.precio_simbolo || "$"
  return config.precio_posicion === "derecha"
    ? `${formatted}${simbolo}`
    : `${simbolo}${formatted}`
}
