"use client"

import {
  useRef, useState, useCallback, useEffect,
  type ReactNode,
} from "react"
import Link from "next/link"
import { DarkToggle } from "@/components/dark-toggle"
import type { MenuCategory } from "@/lib/get-menu"

interface Props {
  children:  ReactNode
  menu:      MenuCategory[]
}

export function CartaControls({ children, menu }: Props) {
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

  // Delegación: botones data-goto dentro del índice
  const handleIndexClick = useCallback((e: React.MouseEvent) => {
    const btn = (e.target as HTMLElement).closest<HTMLElement>("[data-goto]")
    if (btn?.dataset.goto) goToId(btn.dataset.goto)
  }, [goToId])

  const prev = () => goTo(Math.max(0, current - 1))
  const next = () => goTo(Math.min(total - 1, current + 1))

  const isCategory = pages[current] &&
    !pages[current].startsWith("portada") &&
    !pages[current].startsWith("indice")

  // ── Imprimir todas las páginas ──
  // Expandimos el slider, imprimimos, restauramos
  const handlePrint = useCallback(() => {
    setPrinting(true)
    // Dar un frame para que React aplique la clase print-mode
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        window.print()
        setPrinting(false)
      })
    })
  }, [])

  return (
    <div
      className={`relative h-svh w-full overflow-hidden bg-background${
        printing ? " carta-printing" : ""
      }`}
    >
      {/* ── Topbar fija, z-index alto, fondo sólido ── */}
      <header
        className="absolute left-0 right-0 top-0 z-40 flex h-10 items-center justify-between bg-background/90 px-4 backdrop-blur-sm print:hidden"
        style={{ borderBottom: "1px solid oklch(from var(--border) l c h / 0.4)" }}
      >
        <Link
          href="/"
          className="flex h-10 min-w-[44px] items-center font-sans text-[10px] font-light uppercase tracking-[0.35em] text-foreground/60 hover:text-foreground transition-colors"
        >
          ← Menú
        </Link>
        <div className="flex items-center gap-3">
          {/* Toggle imprimir — solo visible para staff */}
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

      {/* ── Slider ── */}
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

      {/* ── Barra nav inferior — FUERA del scroll ── */}
      {total > 1 && (
        <nav
          aria-label="Navegación de carta"
          className="absolute bottom-0 left-0 right-0 z-40 flex h-14 items-center justify-between bg-background/90 px-3 backdrop-blur-sm print:hidden"
          style={{ borderTop: "1px solid oklch(from var(--border) l c h / 0.4)" }}
        >
          {/* Flecha prev — 44×44 mínimo */}
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

          {/* Centro */}
          <div className="flex flex-col items-center gap-1">
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
            {/* Indicador de página */}
            <p className="font-sans text-[9px] font-light text-muted-foreground">
              {current + 1} / {total}
            </p>
          </div>

          {/* Flecha next */}
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

      {/* ── CSS de impresión — todas las páginas visibles ── */}
      <style>{`
        @media print {
          /* Reset de altura fija para que fluya todo el contenido */
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
            break-inside: avoid;
            page-break-after: always;
          }
          /* Ocultar UI de navegación */
          header, nav, .print\\:hidden { display: none !important; }
          /* Imagen de sección en impresión: altura fija razonable */
          .carta-page [style*="clamp"] { height: 80px; }
          /* Fondo blanco, texto oscuro para ahorrar tinta */
          body, .bg-background { background: white !important; color: black !important; }
        }
      `}</style>
    </div>
  )
}
