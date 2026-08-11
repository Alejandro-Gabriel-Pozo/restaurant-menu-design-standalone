import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { resolvePrimaryForeground } from "./hero-utils"
import type React from "react"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Genera CSS vars de acento para un tenant.
 * Usado en app/page.tsx, app/carta-demo/page.tsx y app/carta/[sucursal]/page.tsx.
 *
 * Setea --primary, --ring y --primary-foreground (calculado por contraste WCAG).
 *
 * @example
 * <main style={buildCssVars(config.color_marca)}>
 */
export function buildCssVars(color_marca?: string): React.CSSProperties {
  if (!color_marca) return {}
  const fg = resolvePrimaryForeground(color_marca)
  return {
    ["--primary" as string]: color_marca,
    ["--ring"    as string]: color_marca,
    ...(fg && { ["--primary-foreground" as string]: fg }),
  }
}
