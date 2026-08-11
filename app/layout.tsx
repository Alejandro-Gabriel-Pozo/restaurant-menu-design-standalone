import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Geist, Playfair_Display } from 'next/font/google'
import { getConfig } from '@/lib/get-config'
import { resolveHeroInk, resolvePrimaryForeground, sanitizeCssColor } from '@/lib/hero-utils'
import './globals.css'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const playfair = Playfair_Display({
  variable: '--font-playfair',
  subsets: ['latin'],
})

function portalSheetId(): string | undefined {
  return (
    process.env.ROOT_SHEET_ID ||
    process.env.MASTER_SHEET_ID ||
    process.env.MENU_SHEET_ID
  )
}

export async function generateMetadata(): Promise<Metadata> {
  const config = await getConfig(portalSheetId())

  const siteName    = config.empresa_nombre || config.restaurante_nombre || undefined
  const title       = config.meta_title     || (siteName ? `${siteName} · Menú` : 'Menú')
  const description = config.meta_descripcion || config.restaurante_descripcion || undefined

  const ogLocale = config.meta_og_locale ||
    (config.lang === 'en' ? 'en_US' : config.lang === 'pt' ? 'pt_BR' : 'es_AR')

  const faviconUrl = config.favicon_url || config.empresa_logo_url || config.restaurante_logo_url

  return {
    title,
    description,
    icons: {
      icon: faviconUrl
        ? [{ url: faviconUrl }]
        : [
            { url: '/icon-light-32x32.png' },
            { url: '/icon.svg', type: 'image/svg+xml' },
          ],
      apple: faviconUrl || '/apple-icon.png',
    },
    openGraph: {
      title,
      description,
      siteName,
      locale: ogLocale,
      type: 'website',
      ...(config.meta_og_url       && { url:    config.meta_og_url }),
      ...(config.meta_og_image_url && { images: [{ url: config.meta_og_image_url }] }),
    },
    twitter: {
      card: (config.meta_twitter_card as 'summary' | 'summary_large_image' | 'app' | 'player') ||
            'summary_large_image',
      title,
      description,
      ...(config.meta_og_image_url && { images: [config.meta_og_image_url] }),
    },
  }
}

export async function generateViewport(): Promise<Viewport> {
  const config = await getConfig(portalSheetId())
  const color = config.theme_color || config.color_marca || undefined
  return { colorScheme: 'light', ...(color && { themeColor: color }) }
}

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const config    = await getConfig(portalSheetId())
  const inkDia    = resolveHeroInk(config.hero_ink)
  const primaryFg = resolvePrimaryForeground(config.color_marca)
  const fondoDia  = sanitizeCssColor(config.color_fondo_dia)
  const marca     = sanitizeCssColor(config.color_marca)

  const estilosDinamicos = [
    fondoDia
      ? `:root { --background: ${fondoDia} !important; --card: ${fondoDia} !important; }`
      : "",
    marca
      ? `:root { --primary: ${marca} !important; --ring: ${marca} !important; }`
      : "",
    primaryFg
      ? `:root { --primary-foreground: ${primaryFg} !important; }`
      : "",
    inkDia
      ? `:root { --hero-ink: ${inkDia} !important; }`
      : "",
  ].filter(Boolean).join("\n")

  const lang = config.lang || 'es'

  return (
    <html lang={lang} className={`${geistSans.variable} ${playfair.variable} bg-background`}>
      {estilosDinamicos && <style>{estilosDinamicos}</style>}
      <body className="font-sans antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
