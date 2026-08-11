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
}

/**
 * Lee la tab "Tenants" de la sheet maestra (MASTER_SHEET_ID).
 * Devuelve solo los tenants activos. ISR 1h.
 */
export async function getTenants(): Promise<Tenant[]> {
  const masterId = process.env.MASTER_SHEET_ID
  if (!masterId) {
    console.warn("tenants: MASTER_SHEET_ID no está definido")
    return []
  }

  try {
    const table = await fetchGviz(masterId, "Tenants")
    const get   = colGetter(table)

    return table.rows
      .map((row) => {
        if (!row.c) return null
        const tenantId = String(get(row, "tenant_id") ?? "").trim()
        const sheetId  = String(get(row, "sheet_id")  ?? "").trim()
        if (!tenantId || !sheetId) return null

        const activoRaw  = get(row, "activo")
        const activo =
          typeof activoRaw === "boolean"
            ? activoRaw
            : String(activoRaw).toLowerCase() === "true"

        const notasRaw = get(row, "notas")

        return {
          tenant_id:  tenantId,
          label:      String(get(row, "label") ?? tenantId).trim() || tenantId,
          dominio:    String(get(row, "dominio") ?? "").trim(),
          sheet_id:   sheetId,
          sheet_name: String(get(row, "sheet_name") ?? "Menu").trim() || "Menu",
          activo,
          notas: notasRaw ? String(notasRaw).trim() : undefined,
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
