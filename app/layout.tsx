import { Analytics } from '@vercel/analytics/next'
import type { Viewport } from 'next'
import { Geist, Playfair_Display } from 'next/font/google'
import { getConfig } from '@/lib/get-config'
import { resolveHeroInk } from '@/lib/hero-utils'
import './globals.css'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const playfair = Playfair_Display({
  variable: '--font-playfair',
  subsets: ['latin'],
})

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

export async function generateViewport(): Promise<Viewport> {
  const config = await getConfig()
  const color = config.theme_color || config.color_marca || '#E8B84B'
  return { colorScheme: 'light', themeColor: color }
}

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const config = await getConfig()
  const inkDia   = resolveHeroInk(config.hero_ink)
  const inkNoche = resolveHeroInk(config.hero_ink_noche)

  const estilosDinamicos = [
    config.color_fondo_dia
      ? `:root:not(.dark) { --background: ${config.color_fondo_dia} !important; --card: ${config.color_fondo_dia} !important; }`
      : "",
    config.color_fondo_noche
      ? `.dark { --background: ${config.color_fondo_noche} !important; --card: ${config.color_fondo_noche} !important; }`
      : "",
    inkDia
      ? `:root:not(.dark) { --hero-ink: ${inkDia} !important; }`
      : "",
    inkNoche
      ? `.dark { --hero-ink: ${inkNoche} !important; }`
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
