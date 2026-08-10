import "server-only"

export type Tenant = {
  tenant_id:  string
  /** Nombre legible para el portal (ej. "Miches"). Si vacío, se usa tenant_id. */
  label:      string
  dominio:    string
  sheet_id:   string
  sheet_name: string
  activo:     boolean
  /** Campo libre: dirección, estado, notas internas */
  notas?:     string
}

type GvizCell     = { v: string | number | boolean | null }
type GvizRow      = { c: (GvizCell | null)[] }
type GvizTable    = { cols: { label: string }[]; rows: GvizRow[] }
type GvizResponse = { table: GvizTable }

function parseGviz(text: string): GvizTable {
  const cleaned = text
    .replace("/*O_o*/", "")
    .replace("google.visualization.Query.setResponse(", "")
    .slice(0, -2)
  const json: GvizResponse = JSON.parse(cleaned)
  return json.table
}

/**
 * Lee la tab "Tenants" de la sheet maestra (MASTER_SHEET_ID)
 * y devuelve todos los tenants activos. Cacheado 1 hora (ISR).
 *
 * Columnas esperadas en la sheet:
 *   tenant_id | label | dominio | sheet_id | sheet_name | activo | notas
 */
export async function getTenants(): Promise<Tenant[]> {
  const masterId = process.env.MASTER_SHEET_ID
  if (!masterId) {
    console.warn("tenants: MASTER_SHEET_ID no está definido")
    return []
  }

  try {
    const url = `https://docs.google.com/spreadsheets/d/${masterId}/gviz/tq?tqx=out:json&sheet=Tenants&headers=1`
    const res = await fetch(url, { next: { revalidate: 3600 } })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const table = parseGviz(await res.text())
    const cols  = table.cols.map((c) => c.label.toLowerCase().trim())

    return table.rows
      .map((row) => {
        if (!row.c) return null
        const get = (label: string) => {
          const idx = cols.indexOf(label)
          return idx !== -1 ? row.c[idx]?.v ?? null : null
        }
        const tenantId = String(get("tenant_id") ?? "").trim()
        const sheetId  = String(get("sheet_id")  ?? "").trim()
        if (!tenantId || !sheetId) return null

        const activo = get("activo")
        const activo_bool =
          typeof activo === "boolean"
            ? activo
            : String(activo).toLowerCase() === "true"

        const notasRaw = get("notas")

        return {
          tenant_id:  tenantId,
          label:      String(get("label") ?? tenantId).trim() || tenantId,
          dominio:    String(get("dominio") ?? "").trim(),
          sheet_id:   sheetId,
          sheet_name: String(get("sheet_name") ?? "Menu").trim() || "Menu",
          activo:     activo_bool,
          notas:      notasRaw ? String(notasRaw).trim() : undefined,
        } satisfies Tenant
      })
      .filter((t): t is Tenant => t !== null && t.activo)
  } catch (err) {
    console.error("getTenants() falló", err)
    return []
  }
}

/** Devuelve un tenant por su slug (tenant_id). null si no existe o inactivo. */
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
