import { getConfig } from "@/lib/get-config"
import type { MetadataRoute } from "next"

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const config = await getConfig()
  const name        = config.restaurante_nombre || "Menú"
  const themeColor  = config.theme_color || config.color_marca || "#E8B84B"
  const icon        = config.favicon_url || "/icon.svg"

  return {
    name,
    short_name: name,
    description: config.restaurante_descripcion || name,
    start_url: "/",
    display: "standalone",
    background_color: "#fafaf7",
    theme_color: themeColor,
    icons: [
      { src: icon, sizes: "any", type: "image/svg+xml" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  }
}
