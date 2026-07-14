import { Analytics } from '@vercel/analytics/next'
import type { Viewport } from 'next'
import { Geist, Playfair_Display } from 'next/font/google'
import { getConfig } from '@/lib/get-config'
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className={`${geistSans.variable} ${playfair.variable} bg-background`}>
      <body className="font-sans antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
