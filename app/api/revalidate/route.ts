/**
 * /api/revalidate
 *
 * Flush manual del cache ISR. Útil desde Google Apps Script,
 * un deploy hook, o directamente en el browser.
 *
 * Uso:
 *   GET /api/revalidate?secret=TU_SECRET&path=/carta/varvarco
 *   GET /api/revalidate?secret=TU_SECRET&path=/          (portal)
 *   GET /api/revalidate?secret=TU_SECRET&all=1           (todo)
 *
 * Env var requerida: REVALIDATE_SECRET
 */
import { revalidatePath } from "next/cache"
import { NextRequest, NextResponse } from "next/server"
import { getTenants } from "@/lib/tenants"

export const dynamic = "force-dynamic"

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret")
  const expected = process.env.REVALIDATE_SECRET

  if (!expected) {
    return NextResponse.json(
      { error: "REVALIDATE_SECRET no configurado en env vars" },
      { status: 500 },
    )
  }

  if (secret !== expected) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const all  = req.nextUrl.searchParams.get("all")
  const path = req.nextUrl.searchParams.get("path")

  if (all === "1") {
    // Revalida portal + todas las cartas activas
    revalidatePath("/")
    revalidatePath("/carta", "layout")
    try {
      const tenants = await getTenants()
      for (const t of tenants) {
        revalidatePath(`/carta/${t.tenant_id}`)
      }
      return NextResponse.json({
        ok: true,
        revalidated: ["/", "/carta", ...tenants.map((t) => `/carta/${t.tenant_id}`)],
      })
    } catch {
      return NextResponse.json({ ok: true, revalidated: ["/", "/carta"] })
    }
  }

  if (path) {
    revalidatePath(path)
    return NextResponse.json({ ok: true, revalidated: [path] })
  }

  return NextResponse.json(
    { error: "Pasar ?path=/ruta o ?all=1" },
    { status: 400 },
  )
}
