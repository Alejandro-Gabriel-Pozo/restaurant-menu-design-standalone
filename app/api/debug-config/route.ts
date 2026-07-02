import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function GET() {
  const sheetId = process.env.MENU_SHEET_ID
  if (!sheetId) return NextResponse.json({ error: "MENU_SHEET_ID no configurado" })

  const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json&sheet=Config`
  const res = await fetch(url, { cache: "no-store" })
  const raw = await res.text()

  // Parsear gviz
  const cleaned = raw
    .replace("/*O_o*/", "")
    .replace("google.visualization.Query.setResponse(", "")
    .slice(0, -2)

  const json = JSON.parse(cleaned)
  const rows = json.table.rows.map((row: { c: { v: unknown }[] }) => ({
    clave: row.c?.[0]?.v,
    valor: row.c?.[1]?.v,
  }))

  return NextResponse.json({ rows })
}
