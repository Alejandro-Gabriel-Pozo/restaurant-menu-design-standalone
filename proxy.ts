import { NextRequest, NextResponse } from "next/server"

/**
 * Proxy multitenant (Next.js 16+).
 *
 * Lee la tab Tenants de la sheet maestra y resuelve el tenant
 * por dominio. Si hay match, inyecta x-tenant-id en los headers
 * para que layout.tsx / page.tsx lo consuma sin prop drilling.
 *
 * Si no hay match (dominio no registrado), pasa sin modificar.
 *
 * NOTA: el fetch a gviz se hace con cache de 1 h — Next.js
 * reutiliza la respuesta entre requests mientras dure el cache.
 */
export async function middleware(req: NextRequest) {
  const masterId = process.env.MASTER_SHEET_ID
  if (!masterId) return NextResponse.next()

  const host = req.headers.get("host") ?? ""
  const bare = host.replace(/:\d+$/, "")

  try {
    const url = `https://docs.google.com/spreadsheets/d/${masterId}/gviz/tq?tqx=out:json&sheet=Tenants&headers=1`
    const res = await fetch(url, {
      next: { revalidate: 3600 },
    })
    if (!res.ok) return NextResponse.next()

    const text    = await res.text()
    const cleaned = text
      .replace("/*O_o*/", "")
      .replace("google.visualization.Query.setResponse(", "")
      .slice(0, -2)
    const data  = JSON.parse(cleaned)
    const table = data.table
    const cols: string[] = table.cols.map((c: { label: string }) =>
      c.label.toLowerCase().trim()
    )
    const domIdx    = cols.indexOf("dominio")
    const idIdx     = cols.indexOf("tenant_id")
    const activoIdx = cols.indexOf("activo")

    for (const row of table.rows) {
      if (!row.c) continue
      const dominio  = String(row.c[domIdx]?.v  ?? "").trim()
      const tenantId = String(row.c[idIdx]?.v   ?? "").trim()
      const activo   = row.c[activoIdx]?.v
      const isActivo =
        typeof activo === "boolean"
          ? activo
          : String(activo).toLowerCase() === "true"

      if (isActivo && dominio && dominio === bare && tenantId) {
        const headers = new Headers(req.headers)
        headers.set("x-tenant-id", tenantId)
        return NextResponse.next({ request: { headers } })
      }
    }
  } catch (err) {
    console.error("proxy tenant lookup falló", err)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Excluir rutas internas de Next.js y archivos estáticos.
     * El proxy solo corre en rutas de página reales.
     */
    "/((?!_next/static|_next/image|favicon|icon|apple-icon|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff2?|ttf|otf)).*)",
  ],
}
