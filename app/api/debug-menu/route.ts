/**
 * /api/debug-menu?id=SHEET_ID&sheet=Menu
 * Muestra las filas crudas de la tab Menú sin filtros.
 * Solo para diagnóstico — no expone datos sensibles.
 */
import { NextRequest, NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function GET(req: NextRequest) {
  const id    = req.nextUrl.searchParams.get("id") ?? process.env.MENU_SHEET_ID
  const sheet = req.nextUrl.searchParams.get("sheet") ?? "Menu"

  if (!id) return NextResponse.json({ error: "Pasar ?id=SHEET_ID" }, { status: 400 })

  const url = `https://docs.google.com/spreadsheets/d/${id}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(sheet)}&headers=1`
  const res = await fetch(url, { cache: "no-store" })

  if (!res.ok) {
    return NextResponse.json({
      error: `gviz HTTP ${res.status}`,
      hint: "Sheet no pública o sheet/tab no existe",
      url,
    }, { status: 502 })
  }

  const text = await res.text()
  const cleaned = text
    .replace("/*O_o*/", "")
    .replace("google.visualization.Query.setResponse(", "")
    .slice(0, -2)

  const data  = JSON.parse(cleaned)
  const table = data.table
  const cols: string[] = table.cols.map((c: { label: string }) => c.label)

  const rows = table.rows.map((row: { c: ({ v: unknown } | null)[] }) =>
    Object.fromEntries(cols.map((col, i) => [col, row.c?.[i]?.v ?? null]))
  )

  const disponibles  = rows.filter((r: Record<string, unknown>) => r["disponible"] === true).length
  const nodisponible = rows.filter((r: Record<string, unknown>) => r["disponible"] === false).length
  const nulo         = rows.filter((r: Record<string, unknown>) => r["disponible"] === null).length

  return NextResponse.json({
    ok: true,
    sheet_id: id,
    tab: sheet,
    cols,
    total_filas: rows.length,
    disponible_true:  disponibles,
    disponible_false: nodisponible,
    disponible_null:  nulo,
    rows,
  })
}
