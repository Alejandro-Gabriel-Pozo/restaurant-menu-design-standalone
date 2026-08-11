import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Genera CSS vars de acento para un tenant.
 * Usado en app/page.tsx y app/carta/[sucursal]/page.tsx.
 *
 * @example
 * <main style={buildCssVars(config.color_marca)}>
 */
export function buildCssVars(color_marca?: string): React.CSSProperties {
  if (!color_marca) return {}
  return {
    ["--primary" as string]: color_marca,
    ["--ring" as string]:    color_marca,
  }
}
