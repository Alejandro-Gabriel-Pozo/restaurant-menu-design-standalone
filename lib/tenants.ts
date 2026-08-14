import "server-only"
import { fetchGviz, colGetter } from "./gviz"

export type Tenant = {
  tenant_id:  string
  label:      string
  dominio:    string
  sheet_id:   string
  sheet_name: string
  activo:     boolean
  notas?:     string
  /** Posición sobre el mapa: centro % (0-100). Los 4 juntos habilitan el overlay exacto. */
  pos_x?: number
  pos_y?: number
  pos_w?: number
  pos_h?: number
}

/**
 * Lee la tab "tenant" de la sheet maestra (MASTER_SHEET_ID).
 * Devuelve solo los tenants activos. ISR 1h.
 */
export async function getTenants(): Promise<Tenant[]> {
  const masterId = process.env.MASTER_SHEET_ID
  if (!masterId) {
    console.warn("tenants: MASTER_SHEET_ID no está definido")
    return []
  }

  try {
    const table = await fetchGviz(masterId, "tenant")
    const get   = colGetter(table)

    return table.rows
      .map((row) => {
        if (!row.c) return null
        const tenantId = String(get(row, "tenant_id") ?? "").trim()
        const sheetId  = String(get(row, "sheet_id")  ?? "").trim()
        if (!tenantId || !sheetId) return null

        const activoRaw = get(row, "activo")
        const activo =
          typeof activoRaw === "boolean"
            ? activoRaw
            : String(activoRaw).toLowerCase() === "true"

        const notasRaw = get(row, "notas")

        const parsePos = (key: string) => {
          const v = get(row, key)
          if (v === null || v === undefined || v === "") return undefined
          const n = parseFloat(String(v))
          return isNaN(n) ? undefined : n
        }

        return {
          tenant_id:  tenantId,
          label:      String(get(row, "label") ?? tenantId).trim() || tenantId,
          dominio:    String(get(row, "dominio") ?? "").trim(),
          sheet_id:   sheetId,
          sheet_name: String(get(row, "sheet_name") ?? "Menu").trim() || "Menu",
          activo,
          notas: notasRaw ? String(notasRaw).trim() : undefined,
          pos_x: parsePos("pos_x"),
          pos_y: parsePos("pos_y"),
          pos_w: parsePos("pos_w"),
          pos_h: parsePos("pos_h"),
        } satisfies Tenant
      })
      .filter((t): t is Tenant => t !== null && t.activo)
  } catch (err) {
    console.error("getTenants() falló", err)
    return []
  }
}

/** Devuelve un tenant por slug (tenant_id). null si no existe o inactivo. */
export async function getTenantBySlug(slug: string): Promise<Tenant | null> {
  const tenants = await getTenants()
  return tenants.find((t) => t.tenant_id === slug) ?? null
}

/** Devuelve un tenant por dominio exacto (host sin puerto). */
export async function getTenantByDomain(host: string): Promise<Tenant | null> {
  const bare = host.replace(/:\d+$/, "")
  const tenants = await getTenants()
  return tenants.find((t) => t.dominio === bare) ?? null
}
