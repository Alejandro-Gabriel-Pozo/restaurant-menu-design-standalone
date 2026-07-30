import { Analytics } from '@vercel/analytics/next'
import type { Viewport } from 'next'
import { Geist, Playfair_Display } from 'next/font/google'
import { getConfig, resolveHeroInk } from '@/lib/get-config'
import './globals.css'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const playfair = Playfair_Display({
  variable: '--font-playfair',
  subsets: ['latin'],
})

// ── Metadata dinámica desde Google Sheets ────────────────────────────────────
export async function generateMetadata() {
  const config = await getConfig()
  const title       = config.meta_title       || `${config.restaurante_nombre} · Menú`
  const description = config.meta_descripcion || config.restaurante_descripcion

  return {
    title,
    description,
    icons: {
      icon: config.favicon_url
        ? [{ url: config.favicon_url }]
        : [
            { url: '/icon-light-32x32.png', media: '(prefers-color-scheme: light)' },
            { url: '/icon-dark-32x32.png',  media: '(prefers-color-scheme: dark)'  },
            { url: '/icon.svg',             type: 'image/svg+xml'                  },
          ],
      apple: '/apple-icon.png',
    },
  }
}

// ── Viewport / theme-color dinámico ──────────────────────────────────────────
export async function generateViewport(): Promise<Viewport> {
  const config = await getConfig()
  const color = config.theme_color || config.color_marca || '#E8B84B'
  return {
    colorScheme: 'light',
    themeColor: color,
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const config = await getConfig()
  const heroInkResuelto = resolveHeroInk(config.hero_ink)

  const estilosDinamicos = [
    config.color_fondo_dia
      ? `:root:not(.dark) { --background: ${config.color_fondo_dia} !important; --card: ${config.color_fondo_dia} !important; }`
      : "",
    config.color_fondo_noche
      ? `.dark { --background: ${config.color_fondo_noche} !important; --card: ${config.color_fondo_noche} !important; }`
      : "",
    // hero_ink sobreescribe en ambos modos si está seteado
    heroInkResuelto
      ? `:root { --hero-ink: ${heroInkResuelto} !important; }`
      : "",
  ].filter(Boolean).join("\n")

  return (
    <html lang="es" className={`${geistSans.variable} ${playfair.variable} bg-background`}>
      {estilosDinamicos && <style>{estilosDinamicos}</style>}
      <body className="font-sans antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
