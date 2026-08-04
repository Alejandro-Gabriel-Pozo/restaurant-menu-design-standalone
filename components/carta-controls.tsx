"use client"

import { useRef, useState, useCallback, useEffect, type ReactNode } from "react"
import Link from "next/link"
import { DarkToggle } from "@/components/dark-toggle"

interface Props { children: ReactNode }

export function CartaControls({ children }: Props) {
  const sliderRef  = useRef<HTMLDivElement>(null)
  const [current, setCurrent]   = useState(0)
  const [total,   setTotal]     = useState(0)

  // Contar páginas al montar
  useEffect(() => {
    const pages = sliderRef.current?.querySelectorAll("[data-page]") ?? []
    setTotal(pages.length)
  }, [])

  // Actualizar indicador al hacer scroll
  const onScroll = useCallback(() => {
    const el = sliderRef.current
    if (!el) return
    const idx = Math.round(el.scrollLeft / el.clientWidth)
    setCurrent(idx)
  }, [])

  const goTo = useCallback((idx: number) => {
    const el = sliderRef.current
    if (!el) return
    el.scrollTo({ left: idx * el.clientWidth, behavior: "smooth" })
  }, [])

  const prev = () => goTo(Math.max(0, current - 1))
  const next = () => goTo(Math.min(total - 1, current + 1))

  return (
    <div className="relative h-svh w-full overflow-hidden bg-background">

      {/* ── Barra superior ─────────────────────────────────────── */}
      <div className="absolute left-0 right-0 top-0 z-30 flex items-center justify-between px-5 py-3 print:hidden">
        <Link
          href="/"
          className="font-sans text-[10px] font-light uppercase tracking-[0.35em] text-foreground/60 hover:text-foreground transition-colors"
        >
          ← Menú
        </Link>
        <div className="flex items-center gap-4">
          <button
            onClick={() => window.print()}
            className="font-sans text-[10px] font-light uppercase tracking-[0.35em] text-foreground/60 hover:text-foreground transition-colors"
          >
            Imprimir
          </button>
          <DarkToggle />
        </div>
      </div>

      {/* ── Slider horizontal con snap ──────────────────────────── */}
      <div
        ref={sliderRef}
        onScroll={onScroll}
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

      {/* ── Controles de navegación ────────────────────────────── */}
      {total > 1 && (
        <>
          {/* Flecha izquierda */}
          {current > 0 && (
            <button
              onClick={prev}
              aria-label="Página anterior"
              className="absolute left-3 top-1/2 z-30 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-background/80 text-foreground/60 shadow-md backdrop-blur-sm hover:text-foreground transition-colors print:hidden"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
          )}

          {/* Flecha derecha */}
          {current < total - 1 && (
            <button
              onClick={next}
              aria-label="Página siguiente"
              className="absolute right-3 top-1/2 z-30 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-background/80 text-foreground/60 shadow-md backdrop-blur-sm hover:text-foreground transition-colors print:hidden"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          )}

          {/* Indicador de página (puntos) */}
          <div className="absolute bottom-5 left-1/2 z-30 -translate-x-1/2 flex gap-2 print:hidden">
            {Array.from({ length: total }).map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`Ir a página ${i + 1}`}
                className="h-1.5 rounded-full transition-all duration-300"
                style={{
                  width: i === current ? "1.5rem" : "0.375rem",
                  backgroundColor: i === current ? "var(--color-primary, #E8B84B)" : "oklch(0.5 0 0 / 0.3)",
                }}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
