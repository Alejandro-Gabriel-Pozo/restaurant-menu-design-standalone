// lib/types.ts
// Tipo para los ítems que vienen de Google Sheets vía gviz
export type SheetMenuItem = {
  category: string
  name: string
  description?: string
  price: number
  available?: boolean
  tags?: string[]
}
