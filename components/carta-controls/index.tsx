"use client"

import {
  useRef, useState, useCallback, useEffect,
  type ReactNode,
} from "react"
import type { MenuCategory } from "@/lib/get-menu"
import type { SiteConfig }   from "@/lib/get-config"
import { CartaTopbar }       from "./carta-topbar"
import { CartaNav }          from "./carta-nav"

interface Props {
  children: ReactNode
  menu:     MenuCategory[]
  config:   SiteConfig
}

export function CartaControls({ children, menu: _menu, config }: Props) {
  const sliderRef  = useRef<HTMLDivElement>(null)
  const [current,  setCurrent]  = useState(0)
  const [total,    setTotal]    = useState(0)
  const [pages,    setPages]    = useState<string[]>([])
  const [printing, setPrinting] = useState(false)
  const [canScrollDown, setCanScrollDown] = useState(false)

  // La carta ocupa todo el viewport: bloquea el scroll/rebote del documento
  // para que no se pueda "levantar" la página y mostrar espacio vacío abajo.
  useEffect(() => {
    const html = document.documentElement
    html.classList.add("carta-lock")
    return () => html.classList.remove("carta-lock")
  }, [])

  useEffect(() => {
    const els = Array.from(
      sliderRef.current?.querySelectorAll<HTMLElement>("[data-page]") ?? []
    )
    setTotal(els.length)
    setPages(els.map(el => el.dataset.page ?? ""))
  }, [])

  // ref callback: engancha el ResizeObserver en cuanto el nav se monta,
  // sin depender de que `total` ya esté seteado.
  const navRefCallback = useCallback((nav: HTMLElement | null) => {
    if (!nav) return
    const root = document.documentElement
    const update = () =>
      root.style.setProperty("--carta-nav-h", `${nav.offsetHeight}px`)
    update()
    const ro = new ResizeObserver(update)
    ro.observe(nav)
    // cleanup implícito: cuando nav === null el componente ya se desmontó
  }, [])

  const onScroll = useCallback(() => {
    const el = sliderRef.current
    if (!el) return
    setCurrent(Math.round(el.scrollLeft / el.clientWidth))
  }, [])

  // ¿La página actual tiene más contenido hacia abajo? (para el aviso de scroll)
  const updateScrollHint = useCallback(() => {
    const page = sliderRef.current?.querySelectorAll<HTMLElement>("[data-page]")[current]
    const scroller = page?.querySelector<HTMLElement>(".overflow-y-auto")
    if (!scroller) { setCanScrollDown(false); return }
    setCanScrollDown(scroller.scrollHeight - scroller.scrollTop - scroller.clientHeight > 12)
  }, [current])

  useEffect(() => {
    updateScrollHint()
    const el = sliderRef.current
    if (!el) return
    // los scroll no burbujean: captura los de las páginas internas
    el.addEventListener("scroll", updateScrollHint, true)
    window.addEventListener("resize", updateScrollHint)
    const t = window.setTimeout(updateScrollHint, 300)
    return () => {
      el.removeEventListener("scroll", updateScrollHint, true)
      window.removeEventListener("resize", updateScrollHint)
      window.clearTimeout(t)
    }
  }, [updateScrollHint, pages])

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

  const handlePrint = useCallback(() => {
    setPrinting(true)
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
      style={{ height: "100dvh" }}
    >
      <CartaTopbar onPrint={handlePrint} config={config} />

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

      {/* Aviso de "hay más para ver": degradé + flecha sobre la barra de navegación */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-0 right-0 z-30 flex h-16 items-end justify-center pb-1 transition-opacity duration-300"
        style={{
          bottom: "var(--carta-nav-h, 56px)",
          opacity: canScrollDown ? 1 : 0,
          background: "linear-gradient(to bottom, transparent, var(--background) 85%)",
        }}
      >
        <svg className="carta-scroll-hint text-primary" width="22" height="22" viewBox="0 0 24 24"
          fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </div>

      <CartaNav
        ref={navRefCallback}
        current={current}
        total={total}
        pages={pages}
        config={config}
        onPrev={() => goTo(Math.max(0, current - 1))}
        onNext={() => goTo(Math.min(total - 1, current + 1))}
        onGoToId={goToId}
      />

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
