import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function GET() {
  const sheetId = process.env.ROOT_SHEET_ID
    || process.env.MASTER_SHEET_ID
    || process.env.MENU_SHEET_ID
  if (!sheetId) return NextResponse.json({ error: "SHEET_ID no configurado" })

  const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json&sheet=Config&headers=0`
  const res = await fetch(url, { cache: "no-store" })
  const raw = await res.text()

  const cleaned = raw
    .replace("/*O_o*/", "")
    .replace("google.visualization.Query.setResponse(", "")
    .slice(0, -2)

  const json = JSON.parse(cleaned)

  // Mostrar cada fila con v AND f de la celda valor
  const rows = json.table.rows.map((row: { c: { v: unknown; f?: string }[] }) => ({
    key:   row.c?.[0]?.v ?? null,
    v:     row.c?.[1]?.v ?? null,
    f:     row.c?.[1]?.f ?? null,
  }))

  // Filtrar solo las claves relevantes para el diagnóstico
  const keys = [
    "color_fondo_dia",
    "portal_bg_image_url",
    "portal_bg_overlay",
    "portal_header_bg",
    "portal_titulo_color",
  ]
  const relevant = rows.filter((r: { key: unknown }) => keys.includes(String(r.key)))

  return NextResponse.json({ relevant, total_rows: rows.length })
}
