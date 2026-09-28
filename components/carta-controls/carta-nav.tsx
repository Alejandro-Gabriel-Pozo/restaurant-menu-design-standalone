import { forwardRef } from "react"
import type { SiteConfig } from "@/lib/get-config"
import {
  IconInstagram,
  IconWhatsApp,
  IconFacebook,
  IconMaps,
} from "./social-icons"

interface SocialLink {
  href:  string
  label: string
  icon:  React.ReactNode
}

function buildSocialLinks(config: SiteConfig): SocialLink[] {
  return [
    config.restaurante_instagram && {
      href: config.restaurante_instagram.startsWith("http")
        ? config.restaurante_instagram
        : `https://instagram.com/${config.restaurante_instagram.replace("@", "")}`,
      label: "Instagram",
      icon: <IconInstagram />,
    },
    config.restaurante_whatsapp && {
      href: `https://wa.me/${config.restaurante_whatsapp.replace(/\D/g, "")}`,
      label: "WhatsApp",
      icon: <IconWhatsApp />,
    },
    config.restaurante_footer_maps_url && {
      href: config.restaurante_footer_maps_url,
      label: "Google Maps",
      icon: <IconMaps />,
    },
    config.restaurante_facebook && {
      href: config.restaurante_facebook.startsWith("http")
        ? config.restaurante_facebook
        : `https://facebook.com/${config.restaurante_facebook}`,
      label: "Facebook",
      icon: <IconFacebook />,
    },
  ].filter(Boolean) as SocialLink[]
}

interface CartaNavProps {
  current:    number
  total:      number
  pages:      string[]
  config:     SiteConfig
  onPrev:     () => void
  onNext:     () => void
  onGoToId:   (id: string) => void
}

export const CartaNav = forwardRef<HTMLElement, CartaNavProps>(function CartaNav(
  { current, total, pages, config, onPrev, onNext, onGoToId },
  ref
) {
  if (total <= 1) return null

  const socialLinks = buildSocialLinks(config)
  const hasSocial   = socialLinks.length > 0
  const isPortada   = pages[current]?.startsWith("portada")
  const isCategory  = pages[current] &&
    !pages[current].startsWith("portada") &&
    !pages[current].startsWith("indice")

  // Invita a deslizar: la flecha "siguiente" late mientras se está en portada/índice
  const nudge = current < 2

  const flechaColor  = config.color_nav_flechas || null
  const iconoColor   = config.color_nav_iconos  || null
  const flechaStyle  = flechaColor ? { color: flechaColor } : undefined
  const iconoStyle   = iconoColor  ? { color: iconoColor  } : undefined

  return (
    <nav
      ref={ref}
      id="carta-nav"
      aria-label="Navegación de carta"
      className="absolute bottom-0 left-0 right-0 z-40 backdrop-blur-sm bg-background/90"
      style={{ borderTop: "1px solid oklch(from var(--border) l c h / 0.4)" }}
    >
      <style>{`
        @media (prefers-reduced-motion: no-preference) {
          .carta-nudge:not(:disabled) { animation: carta-nudge 1.6s ease-in-out infinite; }
          .carta-scroll-hint { animation: carta-bounce 1.4s ease-in-out infinite; }
        }
        @keyframes carta-nudge {
          0%, 100% { transform: translateX(0); }
          50%      { transform: translateX(6px); }
        }
        @keyframes carta-bounce {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(4px); }
        }
      `}</style>

      {/* Fila principal: prev / centro / next */}
      <div className="flex h-16 items-center justify-between px-3">
        <button
          onClick={onPrev}
          disabled={current === 0}
          aria-label="Página anterior"
          className="flex h-12 w-12 items-center justify-center rounded-full border border-primary/40 bg-primary/15 text-primary transition-colors hover:bg-primary/25 active:bg-primary/30 disabled:border-transparent disabled:bg-transparent disabled:opacity-20"
          style={flechaStyle}
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        <div className="flex flex-col items-center gap-1">
          {isPortada ? (
            hasSocial && (
              <div className="flex items-center gap-4">
                {socialLinks.map(({ href, label, icon }) => (
                  <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                    aria-label={label}
                    className="flex h-10 w-10 items-center justify-center rounded-full text-foreground/55 transition-colors hover:bg-primary/10 hover:text-primary"
                    style={iconoStyle}
                  >
                    {icon}
                  </a>
                ))}
              </div>
            )
          ) : (
            // En índice: muestra contador. En categorías: solo botón Índice (el
            // número ya aparece en la banda de sección).
            isCategory ? (
              <button
                onClick={() => onGoToId("indice-0")}
                className="flex h-9 min-w-[80px] items-center justify-center gap-1.5 rounded-full bg-primary/10 px-4 font-sans text-xs font-medium uppercase tracking-[0.3em] text-primary transition-colors hover:bg-primary/20 active:bg-primary/30"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
                Índice
              </button>
            ) : (
              <p className="font-sans text-[10px] font-light text-muted-foreground">
                {current + 1} / {total}
              </p>
            )
          )}
        </div>

        <button
          onClick={onNext}
          disabled={current === total - 1}
          aria-label="Página siguiente"
          className={`flex h-12 w-12 items-center justify-center rounded-full border border-primary/40 bg-primary/15 text-primary transition-colors hover:bg-primary/25 active:bg-primary/30 disabled:border-transparent disabled:bg-transparent disabled:opacity-20${nudge ? " carta-nudge" : ""}`}
          style={flechaStyle}
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>

      {/* Franja social compacta en páginas internas */}
      {!isPortada && hasSocial && (
        <div
          className="flex items-center justify-center gap-6 py-2"
          style={{ borderTop: "1px solid oklch(from var(--border) l c h / 0.18)" }}
        >
          {socialLinks.map(({ href, label, icon }) => (
            <a key={label} href={href} target="_blank" rel="noopener noreferrer"
              aria-label={label}
              className="flex h-8 w-8 items-center justify-center text-foreground/40 transition-colors hover:text-primary"
              style={iconoStyle}
            >
              {icon}
            </a>
          ))}
        </div>
      )}
    </nav>
  )
})
