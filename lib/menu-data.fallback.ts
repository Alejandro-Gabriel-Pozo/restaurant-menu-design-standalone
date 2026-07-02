// lib/menu-data.fallback.ts
// Menú de emergencia: se usa cuando MENU_SHEET_ID no está configurado
// o cuando la lectura de la Sheet falla.
import { SheetMenuItem } from "./types"

export const fallbackMenu: SheetMenuItem[] = [
  {
    category: "Entradas",
    name: "Escabeche de chivo con pan casero",
    description: "Escabeche de chivo acompañado con pan casero",
    price: 3500,
    available: true,
    tags: ["Regional"],
  },
  {
    category: "Sopas",
    name: "Sopón",
    description: "Sopa de verduras típica de la zona",
    price: 20000,
    available: true,
    tags: ["Regional"],
  },
  {
    category: "Platos Principales",
    name: "Bandeja paisa",
    description: "Frijoles, arroz, chicharrón, huevo, chorizo y aguacate",
    price: 35000,
    available: true,
    tags: ["Especialidad"],
  },
  {
    category: "Bebidas",
    name: "Jugo natural",
    description: "Jugo de fruta fresca del día",
    price: 8000,
    available: true,
    tags: ["Sin alcohol"],
  },
]
