/**
 * Registro de sucursales.
 *
 * Cómo agregar una sucursal:
 * 1. Agregar las env vars en Vercel (o .env.local):
 *      SUCURSAL_<SLUG>_SHEET_ID=1abc...
 *      SUCURSAL_<SLUG>_SHEET_NAME=NombreHoja   (opcional, default = Menu)
 *      SUCURSAL_<SLUG>_CONFIG_SHEET=Config      (opcional, default = Config)
 * 2. Agregar la entrada al objeto SUCURSALES abajo.
 *
 * El slug se convierte en la URL: /carta/<slug>
 * Ej: slug "miches"  →  /carta/miches
 *     slug "sf"      →  /carta/sf
 */

export interface SucursalDef {
  /** ID del Google Spreadsheet de esta sucursal */
  sheetId: string
  /** Nombre de la hoja del menú (default "Menu") */
  sheetName: string
  /** Nombre de la hoja de configuración (default "Config") */
  configSheet: string
  /** Nombre legible para metadatos y logs */
  label?: string
}

function suc(
  slugEnv: string,
  label?: string,
): SucursalDef | null {
  const envPrefix = `SUCURSAL_${slugEnv.toUpperCase()}`
  const sheetId = process.env[`${envPrefix}_SHEET_ID`]
  if (!sheetId) return null
  return {
    sheetId,
    sheetName:   process.env[`${envPrefix}_SHEET_NAME`]   ?? "Menu",
    configSheet: process.env[`${envPrefix}_CONFIG_SHEET`] ?? "Config",
    label,
  }
}

/**
 * Agrega aquí una entrada por cada sucursal.
 * La clave es el slug que aparece en la URL.
 *
 * suc("miches", "Miches") busca:
 *   SUCURSAL_MICHES_SHEET_ID
 *   SUCURSAL_MICHES_SHEET_NAME  (opcional)
 *   SUCURSAL_MICHES_CONFIG_SHEET (opcional)
 */
const rawSucursales: Record<string, SucursalDef | null> = {
  // Agregar sucursales aquí:
  // miches:    suc("miches",    "Miches"),
  // sf:        suc("sf",        "San Francisco"),
  // neuquen:   suc("neuquen",   "Neuquén"),
}

/** Mapa filtrado: solo sucursales con env vars presentes */
export const SUCURSALES: Record<string, SucursalDef> = Object.fromEntries(
  Object.entries(rawSucursales).filter(
    (entry): entry is [string, SucursalDef] => entry[1] !== null,
  ),
)

export type SucursalSlug = keyof typeof SUCURSALES

/** Slugs válidos para generateStaticParams */
export function getSucursalSlugs(): string[] {
  return Object.keys(SUCURSALES)
}

/** Obtiene la definición de una sucursal por slug */
export function getSucursal(slug: string): SucursalDef | undefined {
  return SUCURSALES[slug]
}
