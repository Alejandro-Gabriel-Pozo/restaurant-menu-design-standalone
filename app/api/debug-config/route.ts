import { getConfig } from "@/lib/get-config"
import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function GET() {
  const sheetId = process.env.MENU_SHEET_ID ?? "(no configurado)"
  const config = await getConfig()

  return NextResponse.json({
    sheet_id_presente: !!process.env.MENU_SHEET_ID,
    sheet_id_primeros_chars: sheetId.slice(0, 8) + "...",
    config,
  })
}
