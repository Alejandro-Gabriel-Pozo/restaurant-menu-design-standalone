import { NextRequest, NextResponse } from "next/server"
import { parseGviz } from "@/lib/gviz"

/**
 * Proxy multitenant (Next.js 16+).
 *
 * Resuelve el tenant por dominio inyectando x-tenant-id en los headers.
 * Si no hay match, pasa sin modificar.
 *
 * NOTA: el fetch aquí NO usa fetchGviz() de lib/gviz porque el Edge
 * Runtime no soporta "server-only". parseGviz() sí es reutilizable
 * porque es una función pura sin imports de Node.
 */
export async function proxy(req: NextRequest) {
  const masterId = process.env.MASTER_SHEET_ID
  if (!masterId) return NextResponse.next()

  const host = req.headers.get("host") ?? ""
  const bare = host.replace(/:\d+$/, "")

  try {
    const url = `https://docs.google.com/spreadsheets/d/${masterId}/gviz/tq?tqx=out:json&sheet=Tenants&headers=1`
    const res = await fetch(url, { next: { revalidate: 3600 } })
    if (!res.ok) return NextResponse.next()

    const table = parseGviz(await res.text())
    const cols  = table.cols.map((c) => c.label.toLowerCase().trim())
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
    "/((?!_next/static|_next/image|favicon|icon|apple-icon|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff2?|ttf|otf)).*)",
  ],
}
