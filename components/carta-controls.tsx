"use client"

import {
  useRef, useState, useCallback, useEffect,
  type ReactNode,
} from "react"
import Link from "next/link"
import { DarkToggle } from "@/components/dark-toggle"
import type { MenuCategory } from "@/lib/get-menu"
import type { SiteConfig } from "@/lib/get-config"

interface Props {
  children:  ReactNode
  menu:      MenuCategory[]
  config:    SiteConfig
}

// Íconos SVG de redes sociales inline (sin dependencias externas)
function IconInstagram() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
      <circle cx="12" cy="12" r="4"/>
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/>
    </svg>
  )
}
function IconWhatsApp() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  )
}
function IconFacebook() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  )
}
function IconMaps() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
      <circle cx="12" cy="9" r="2.5"/>
    </svg>
  )
}

export function CartaControls({ children, menu, config }: Props) {
  const sliderRef  = useRef<HTMLDivElement>(null)
  const [current,  setCurrent]  = useState(0)
  const [total,    setTotal]    = useState(0)
  const [pages,    setPages]    = useState<string[]>([])
  const [printing, setPrinting] = useState(false)

  useEffect(() => {
    const els = Array.from(
      sliderRef.current?.querySelectorAll<HTMLElement>("[data-page]") ?? []
    )
    setTotal(els.length)
    setPages(els.map(el => el.dataset.page ?? ""))
  }, [])

  const onScroll = useCallback(() => {
    const el = sliderRef.current
    if (!el) return
    setCurrent(Math.round(el.scrollLeft / el.clientWidth))
  }, [])

  const goTo = useCallback((idx: number) => {
    const el = sliderRef.current
    if (!el) return
    el.scrollTo({ left: idx * el.clientWidth, behavior: "smooth" })
  }, [])

  const goToId = useCallback((id: string) => {
    const idx = pages.indexOf(id)
    if (idx !== -1) goTo(idx)
  }, [pages, goTo])

  const handleIndexClick = useCallback((e: React.MouseEvent) => {
    const btn = (e.target as HTMLElement).closest<HTMLElement>("[data-goto]")
    if (btn?.dataset.goto) goToId(btn.dataset.goto)
  }, [goToId])

  const prev = () => goTo(Math.max(0, current - 1))
  const next = () => goTo(Math.min(total - 1, current + 1))

  const isPortada  = pages[current]?.startsWith("portada")
  const isCategory = pages[current] &&
    !pages[current].startsWith("portada") &&
    !pages[current].startsWith("indice")

  const handlePrint = useCallback(() => {
    setPrinting(true)
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        window.print()
        setPrinting(false)
      })
    })
  }, [])

  // Redes sociales: solo las que tienen valor en config
  const socialLinks = [
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
  ].filter(Boolean) as { href: string; label: string; icon: React.ReactNode }[]

  return (
    <div
      className={`relative h-svh w-full overflow-hidden bg-background${
        printing ? " carta-printing" : ""
      }`}
    >
      {/* Topbar */}
      <header
        id="carta-topbar"
        className="absolute left-0 right-0 top-0 z-40 flex h-10 items-center justify-between bg-background/90 px-4 backdrop-blur-sm"
        style={{ borderBottom: "1px solid oklch(from var(--border) l c h / 0.4)" }}
      >
        <Link
          href="/"
          className="flex h-10 min-w-[44px] items-center font-sans text-[10px] font-light uppercase tracking-[0.35em] text-foreground/60 hover:text-foreground transition-colors"
        >
          ← Menú
        </Link>
        <div className="flex items-center gap-3">
          <button
            onClick={handlePrint}
            aria-label="Imprimir carta completa"
            className="flex h-10 min-w-[44px] items-center justify-center gap-1.5 font-sans text-[10px] font-light uppercase tracking-[0.3em] text-foreground/60 hover:text-foreground transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <polyline points="6 9 6 2 18 2 18 9" />
              <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
              <rect x="6" y="14" width="12" height="8" />
            </svg>
            <span className="hidden sm:inline">Imprimir</span>
          </button>
          <DarkToggle />
        </div>
      </header>

      {/* Slider */}
      <div
        ref={sliderRef}
        onScroll={onScroll}
        onClick={handleIndexClick}
        className="carta-slider h-full w-full"
        style={{
          display: "flex",
          overflowX: "auto",
          overflowY: "hidden",
          scrollSnapType: "x mandatory",
          scrollBehavior: "smooth",
          WebkitOverflowScrolling: "touch",
          msOverflowStyle: "none",
          scrollbarWidth: "none",
        }}
      >
        {children}
      </div>

      {/* Nav inferior */}
      {total > 1 && (
        <nav
          id="carta-nav"
          aria-label="Navegación de carta"
          className="absolute bottom-0 left-0 right-0 z-40 flex h-14 items-center justify-between bg-background/90 px-3 backdrop-blur-sm"
          style={{ borderTop: "1px solid oklch(from var(--border) l c h / 0.4)" }}
        >
          <button
            onClick={prev}
            disabled={current === 0}
            aria-label="Página anterior"
            className="flex h-11 w-11 items-center justify-center rounded-full text-foreground/60 transition-colors hover:bg-primary/10 hover:text-foreground disabled:opacity-20"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>

          {/* Centro: sociales en portada / índice+paginado en el resto */}
          <div className="flex flex-col items-center gap-1">
            {isPortada && socialLinks.length > 0 ? (
              <div className="flex items-center gap-3">
                {socialLinks.map(({ href, label, icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="flex h-9 w-9 items-center justify-center rounded-full text-foreground/50 transition-colors hover:bg-primary/10 hover:text-primary"
                  >
                    {icon}
                  </a>
                ))}
              </div>
            ) : (
              <>
                {isCategory && (
                  <button
                    onClick={() => goToId("indice-0")}
                    className="flex h-7 items-center gap-1 rounded-full bg-primary/10 px-3 font-sans text-[9px] font-medium uppercase tracking-[0.35em] text-primary transition-colors hover:bg-primary/20"
                  >
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                      <polyline points="9 22 9 12 15 12 15 22" />
                    </svg>
                    Índice
                  </button>
                )}
                <p className="font-sans text-[9px] font-light text-muted-foreground">
                  {current + 1} / {total}
                </p>
              </>
            )}
          </div>

          <button
            onClick={next}
            disabled={current === total - 1}
            aria-label="Página siguiente"
            className="flex h-11 w-11 items-center justify-center rounded-full text-foreground/60 transition-colors hover:bg-primary/10 hover:text-foreground disabled:opacity-20"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </nav>
      )}

      {/* CSS de impresión */}
      <style>{`
        @media print {
          #carta-topbar, #carta-nav { display: none !important; }
          .relative.h-svh { height: auto !important; overflow: visible !important; }
          .carta-slider {
            display: block !important;
            overflow: visible !important;
            height: auto !important;
            scroll-snap-type: none !important;
          }
          .carta-page {
            width: 100% !important;
            min-width: unset !important;
            height: auto !important;
            min-height: unset !important;
            scroll-snap-align: none !important;
            page-break-after: always;
            break-after: page;
          }
          .section-header-band { height: 80px !important; }
          body, .bg-background { background: white !important; color: black !important; }
        }
      `}</style>
    </div>
  )
}
