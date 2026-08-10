import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function GET() {
  const masterId = process.env.MASTER_SHEET_ID

  if (!masterId) {
    return NextResponse.json({
      error: "MASTER_SHEET_ID no está definido en las env vars de este entorno",
      env_keys: Object.keys(process.env).filter(k => k.startsWith("MENU") || k.startsWith("MASTER")),
    })
  }

  const url = `https://docs.google.com/spreadsheets/d/${masterId}/gviz/tq?tqx=out:json&sheet=Tenants&headers=1`

  try {
    const res = await fetch(url, { cache: "no-store" })
    const status = res.status

    if (!res.ok) {
      return NextResponse.json({
        error: `gviz devolvio HTTP ${status}`,
        hint: "La sheet maestra probablemente NO es pública. Compartila como 'Cualquiera con el enlace puede ver'.",
        masterId,
        url,
      })
    }

    const text = await res.text()
    const cleaned = text
      .replace("/*O_o*/", "")
      .replace("google.visualization.Query.setResponse(", "")
      .slice(0, -2)

    const data = JSON.parse(cleaned)
    const table = data.table
    const cols: string[] = table.cols.map((c: { label: string }) => c.label)
    const rows = table.rows.map((row: { c: ({ v: unknown } | null)[] }) =>
      Object.fromEntries(cols.map((col, i) => [col, row.c?.[i]?.v ?? null]))
    )

    return NextResponse.json({
      ok: true,
      masterId,
      cols,
      tenants: rows,
      count: rows.length,
    })
  } catch (err) {
    return NextResponse.json({
      error: "Excepción al parsear la respuesta de gviz",
      detail: String(err),
      masterId,
      url,
    })
  }
}
